import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getOrCreateUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await prisma.session.findMany({
    where: { userId: user.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 8
      }
    },
    orderBy: { updatedAt: "desc" },
    take: 20
  });

  return NextResponse.json({ sessions });
}
