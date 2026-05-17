"use client";

import { motion } from "framer-motion";
import { Activity, HeartPulse, MessageCircle, Moon, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const bubbles = [
  "I had a difficult morning.",
  "Let us slow the moment down.",
  "Name one sensation you can feel.",
  "You are safe enough to breathe."
];

export function AnimatedAIShell() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mx-auto max-w-sm"
    >
      <div className="absolute -inset-6 rounded-[2rem] bg-cyanGlow/20 blur-3xl" />
      <GlassCard className="relative overflow-hidden p-4">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyanGlow">Live support</p>
            <h3 className="mt-1 text-lg font-semibold">Therapeutic AI</h3>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-cyanGlow">
            <HeartPulse className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-3">
          {bubbles.map((bubble, index) => (
            <motion.div
              key={bubble}
              initial={{ opacity: 0, x: index % 2 ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.18 }}
              className={`rounded-2xl px-4 py-3 text-sm ${
                index % 2 ? "ml-10 bg-blue-500/20 text-blue-50" : "mr-8 bg-white/10 text-slate-200"
              }`}
            >
              {bubble}
            </motion.div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-4 gap-2">
          {[Activity, Moon, MessageCircle, ShieldCheck].map((Icon, index) => (
            <motion.div
              key={index}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.15 }}
              className="grid h-14 place-items-center rounded-2xl bg-white/5 text-cyanGlow"
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
