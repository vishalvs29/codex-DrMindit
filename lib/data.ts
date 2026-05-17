import {
  Activity,
  AudioWaveform,
  Building2,
  CalendarHeart,
  HeartPulse,
  Moon,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";

export const featureCards = [
  {
    icon: Sparkles,
    title: "AI therapeutic companion",
    body: "A calm conversational guide that remembers context, adapts tone, and helps users reflect safely between sessions."
  },
  {
    icon: Activity,
    title: "Emotional analytics",
    body: "Mood trends, sleep correlation, stress patterns, and personalized next steps shown in plain, human language."
  },
  {
    icon: AudioWaveform,
    title: "Audio therapy library",
    body: "Sleep, focus, anxiety relief, grounding, and trauma-informed soundscapes designed for short daily practice."
  },
  {
    icon: ShieldCheck,
    title: "Crisis-aware safety",
    body: "Emergency resources, grounding tools, escalation language, and privacy-first support flows built into the product."
  }
];

export const programs = [
  {
    title: "7-Day Mental Reset",
    duration: "7 days",
    accent: "from-cyanGlow to-mint",
    body: "A gentle first week to stabilize sleep, breath, reflection, and nervous system rhythm."
  },
  {
    title: "21-Day Anxiety Reduction",
    duration: "21 days",
    accent: "from-blue-500 to-iris",
    body: "Daily exposure planning, cognitive reframes, and short practices for anticipatory worry."
  },
  {
    title: "Sleep Improvement",
    duration: "14 days",
    accent: "from-indigo-400 to-cyanGlow",
    body: "Wind-down routines, audio sessions, and thought offloading for deeper rest."
  },
  {
    title: "Focus Improvement",
    duration: "10 days",
    accent: "from-mint to-blue-500",
    body: "Attention rituals, distraction mapping, and recovery-friendly productivity blocks."
  }
];

export const audioTracks = [
  { title: "Deep Blue Breathing", category: "Anxiety Relief", minutes: 12, image: "linear-gradient(135deg,#2563eb,#06b6d4)" },
  { title: "Morning Grounding", category: "Meditation", minutes: 8, image: "linear-gradient(135deg,#0f766e,#22c55e)" },
  { title: "Delta Sleep Harbor", category: "Sleep Stories", minutes: 31, image: "linear-gradient(135deg,#312e81,#38bdf8)" },
  { title: "Safe Room Reset", category: "PTSD Support", minutes: 16, image: "linear-gradient(135deg,#4c1d95,#f472b6)" },
  { title: "Clean Focus Current", category: "Focus", minutes: 25, image: "linear-gradient(135deg,#075985,#67e8f9)" }
];

export const navItems = [
  { href: "/dashboard", label: "Home", icon: HeartPulse },
  { href: "/chat", label: "Therapy", icon: Sparkles },
  { href: "/mood", label: "Mood", icon: Activity },
  { href: "/audio", label: "Audio", icon: Moon },
  { href: "/programs", label: "Programs", icon: CalendarHeart },
  { href: "/institutional", label: "Teams", icon: Building2 },
  { href: "/profile", label: "Profile", icon: Users }
];
