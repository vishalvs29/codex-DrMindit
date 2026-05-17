import type { MoodEntry, RiskLevel } from "@prisma/client";

const crisisTerms = [
  "suicide",
  "kill myself",
  "end my life",
  "self harm",
  "hurt myself",
  "hurt someone",
  "overdose",
  "can't stay safe",
  "cannot stay safe"
];

export function detectRiskLevel(input: string): RiskLevel {
  const normalized = input.toLowerCase();
  return crisisTerms.some((term) => normalized.includes(term)) ? "CRISIS" : "LOW";
}

export function buildMoodContext(moodEntries: Pick<MoodEntry, "mood" | "score" | "stress" | "sleep" | "createdAt">[]) {
  if (moodEntries.length === 0) {
    return "No saved mood entries yet.";
  }

  return moodEntries
    .map((entry) => {
      const date = entry.createdAt.toISOString().slice(0, 10);
      return `${date}: mood ${entry.mood}, emotional score ${entry.score}/100, stress ${entry.stress ?? "unknown"}, sleep ${entry.sleep ?? "unknown"}`;
    })
    .join("\n");
}

export function buildSystemPrompt({
  preferredTone,
  moodContext,
  riskLevel
}: {
  preferredTone: string;
  moodContext: string;
  riskLevel: RiskLevel;
}) {
  return `You are DrMindit, a calm AI mental wellness companion.

Identity and tone:
- Sound warm, grounded, emotionally intelligent, and human.
- Use the user's preferred tone when possible: ${preferredTone}.
- Keep responses concise enough for mobile reading.
- Ask at most one thoughtful question at a time.
- Help the user name feelings, slow down, reflect, and choose one next step.

Clinical and safety boundaries:
- Do not diagnose mental illness.
- Do not prescribe medication or tell users to change medication.
- Do not claim to be a licensed therapist, doctor, or emergency service.
- Do not replace professional care.
- Encourage professional support when symptoms sound persistent, severe, risky, or impairing.

Crisis guidance:
- If the user may be in immediate danger, may hurt themselves, may hurt someone else, is being abused, or may overdose, calmly urge them to contact local emergency services now.
- In the United States, mention 988 for suicide and crisis support.
- Encourage them to move near another person, reduce access to immediate means of harm, and stay connected while help arrives.

Current risk signal: ${riskLevel}.

Recent saved mood context:
${moodContext}`;
}
