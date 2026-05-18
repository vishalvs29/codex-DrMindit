import { describe, expect, test } from "vitest";
import { buildCrisisResourceMessage, detectRiskLevel } from "@/lib/ai/prompts";

describe("AI crisis safety", () => {
  test("detects suicide and overdose signals", () => {
    expect(detectRiskLevel("I'm thinking about suicide")).toBe("CRISIS");
    expect(detectRiskLevel("I might overdose tonight")).toBe("CRISIS");
    expect(detectRiskLevel("I feel sad but safe")).toBe("LOW");
  });

  test("builds a direct crisis resource message", () => {
    const message = buildCrisisResourceMessage();
    expect(message).toContain("iCall India at 9152987821");
    expect(message).toContain("Vandrevala Foundation at 1860-2662-345");
  });
});
