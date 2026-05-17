import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatRequestSchema } from "@/lib/validators";

export const runtime = "nodejs";

const systemPrompt = `You are DrMindit, a supportive AI mental wellness companion.
Use a calm, emotionally intelligent tone. Ask one thoughtful question at a time.
Remember session context, reflect feelings without overclaiming, and suggest grounding or journaling when useful.
Do not diagnose, do not claim to be a licensed therapist, and do not replace medical care.
If the user expresses immediate risk of self-harm, harm to others, abuse, overdose, or danger, encourage contacting emergency services or 988 in the United States immediately and staying with a trusted person.`;

export async function POST(request: Request) {
  const user = await getOrCreateUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = chatRequestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 503 });
  }

  const session =
    parsed.data.sessionId
      ? await prisma.session.findFirst({
          where: {
            id: parsed.data.sessionId,
            userId: user.id
          }
        })
      : await prisma.session.create({
          data: {
            userId: user.id,
            title: parsed.data.message.slice(0, 64)
          }
        });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await prisma.message.create({
    data: {
      sessionId: session.id,
      role: "USER",
      content: parsed.data.message
    }
  });

  const [history, moodEntries] = await Promise.all([
    prisma.message.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "desc" },
      take: 12
    }),
    prisma.moodEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  const moodContext = moodEntries
    .map((entry) => `${entry.mood} (${entry.score}/100), stress ${entry.stress ?? "unknown"}`)
    .join("; ");

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const encoder = new TextEncoder();
  let assistantContent = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
          stream: true,
          temperature: 0.7,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "system",
              content: `Recent mood context: ${moodContext || "No saved mood entries yet."}`
            },
            ...history
              .reverse()
              .map((message) => ({
                role: message.role === "ASSISTANT" ? ("assistant" as const) : ("user" as const),
                content: message.content
              }))
          ]
        });

        for await (const chunk of completion) {
          const token = chunk.choices[0]?.delta?.content ?? "";
          assistantContent += token;
          controller.enqueue(encoder.encode(token));
        }

        await prisma.message.create({
          data: {
            sessionId: session.id,
            role: "ASSISTANT",
            content: assistantContent
          }
        });

        await prisma.session.update({
          where: { id: session.id },
          data: {
            summary: assistantContent.slice(0, 240)
          }
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Streaming failed.";
        controller.enqueue(encoder.encode(`I am having trouble responding right now. ${message}`));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "x-session-id": session.id
    }
  });
}
