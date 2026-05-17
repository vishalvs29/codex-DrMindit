"use client";

import { useMemo, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Welcome back. I am here with you. What feels most important to talk through right now?"
    }
  ]);
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string>();
  const [isStreaming, setIsStreaming] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const canSend = useMemo(() => message.trim().length > 0 && !isStreaming, [message, isStreaming]);

  async function sendMessage() {
    const content = message.trim();
    if (!content || isStreaming) return;

    setMessages((current) => [...current, { role: "user", content }, { role: "assistant", content: "" }]);
    setMessage("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: content })
      });

      if (!response.ok || !response.body) {
        throw new Error("Unable to reach DrMindit right now.");
      }

      const nextSessionId = response.headers.get("x-session-id");
      if (nextSessionId) setSessionId(nextSessionId);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setMessages((current) => {
          const copy = [...current];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + chunk };
          return copy;
        });
      }
    } catch (error) {
      setMessages((current) => {
        const copy = [...current];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "I could not respond. Please try again in a moment."
        };
        return copy;
      });
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="mx-auto grid h-[calc(100vh-6rem)] max-w-5xl grid-rows-[1fr_auto] gap-4 px-4 py-5 sm:px-6 lg:px-8">
      <GlassCard className="hide-scrollbar overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((item, index) => (
            <div key={index} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 sm:text-base ${
                  item.role === "user"
                    ? "bg-blue-500/25 text-blue-50"
                    : "bg-white/10 text-slate-100"
                }`}
              >
                {item.role === "assistant" && (
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyanGlow">
                    <Sparkles className="h-3.5 w-3.5" /> DrMindit
                  </div>
                )}
                <p className="whitespace-pre-wrap">{item.content || "Thinking..."}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard className="p-3">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendMessage();
              }
            }}
            placeholder="Tell DrMindit what is happening..."
            className="min-h-14 flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyanGlow/50"
          />
          <Button aria-label="Send message" size="icon" disabled={!canSend} onClick={() => void sendMessage()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
