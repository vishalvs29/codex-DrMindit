"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, Plus, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatSession = {
  id: string;
  title: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
};

type PersistedMessage = {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
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
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const canSend = useMemo(() => message.trim().length > 0 && !isStreaming, [message, isStreaming]);

  async function loadSessions() {
    const response = await fetch("/api/sessions");
    if (!response.ok) return;
    const data = (await response.json()) as { sessions: ChatSession[] };
    setSessions(data.sessions);
  }

  async function loadMessages(nextSessionId: string) {
    const response = await fetch(`/api/sessions/${nextSessionId}/messages`);
    if (!response.ok) return;

    const data = (await response.json()) as { messages: PersistedMessage[] };
    setSessionId(nextSessionId);
    setMessages(
      data.messages
        .filter((item) => item.role !== "SYSTEM")
        .map((item) => ({
          role: item.role === "ASSISTANT" ? "assistant" : "user",
          content: item.content
        }))
    );
  }

  function startNewSession() {
    setSessionId(undefined);
    setMessages([
      {
        role: "assistant",
        content:
          "Welcome back. I am here with you. What feels most important to talk through right now?"
      }
    ]);
  }

  useEffect(() => {
    void loadSessions();
  }, []);

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
      void loadSessions();
      inputRef.current?.focus();
    }
  }

  return (
    <div className="mx-auto grid h-[calc(100vh-6rem)] max-w-7xl grid-rows-[auto_1fr_auto] gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[280px_1fr] lg:grid-rows-[1fr_auto] lg:px-8">
      <GlassCard className="hide-scrollbar overflow-x-auto p-3 lg:row-span-2 lg:overflow-y-auto">
        <div className="flex gap-2 lg:block lg:space-y-2">
          <Button size="sm" variant="secondary" className="shrink-0 lg:w-full" onClick={startNewSession}>
            <Plus className="h-4 w-4" /> New
          </Button>
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => void loadMessages(session.id)}
              className={`flex min-w-56 items-center gap-3 rounded-2xl border px-3 py-2 text-left text-sm transition lg:w-full ${
                session.id === sessionId
                  ? "border-cyanGlow bg-cyanGlow/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
              }`}
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-cyanGlow" />
              <span className="truncate">{session.title}</span>
            </button>
          ))}
        </div>
      </GlassCard>
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
