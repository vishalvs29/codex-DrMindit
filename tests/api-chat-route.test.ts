import { describe, expect, test, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  requireUser: vi.fn(async () => ({
    id: "test-user",
    clerkId: "test-clerk",
    email: "test@example.com",
    preferredTone: "calm"
  }))
}));

vi.mock("@/lib/api/rate-limit", () => ({
  assertRateLimit: vi.fn().mockResolvedValue(undefined)
}));

vi.mock("@/lib/api/request", () => ({
  parseJson: vi.fn(async () => ({ message: "I want to die", sessionId: undefined }))
}));

vi.mock("@/lib/validators", () => ({
  chatRequestSchema: {}
}));

const createChatCompletionStreamMock = vi.fn();
vi.mock("@/lib/services/ai-chat-service", () => ({
  createChatCompletionStream: createChatCompletionStreamMock
}));

vi.mock("@/lib/api/errors", () => ({
  handleApiError: vi.fn((error) => {
    throw error;
  })
}));

const detectCrisisSignalMock = vi.fn(() => true);
const buildCrisisResourceMessageMock = vi.fn(() => "Please contact iCall India at 9152987821 or the Vandrevala Foundation at 1860-2662-345.");
vi.mock("@/lib/ai/prompts", () => ({
  detectCrisisSignal: detectCrisisSignalMock,
  buildCrisisResourceMessage: buildCrisisResourceMessageMock
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Chat API route", () => {
  test("returns a crisis resource response before calling AI", async () => {
    const { POST } = await import("@/app/api/chat/route");

    const response = await POST(
      new Request("https://example.com/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "I want to die" })
      })
    );

    const body = await response.text();

    expect(body).toContain("9152987821");
    expect(body).toContain("1860-2662-345");
    expect(response.headers.get("x-crisis-detected")).toBe("true");
    expect(createChatCompletionStreamMock).not.toHaveBeenCalled();
    expect(detectCrisisSignalMock).toHaveBeenCalledWith("I want to die");
    expect(buildCrisisResourceMessageMock).toHaveBeenCalled();
  });
});
