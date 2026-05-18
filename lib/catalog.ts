export const programCatalog = [
  {
    slug: "7-day-reset",
    title: "7-Day Mental Reset",
    description:
      "A gentle first week to stabilize sleep, breath, reflection, and nervous system rhythm with small daily commitments.",
    duration: 7,
    category: "reset",
    accent: "from-cyanGlow to-mint",
    benefits: ["Lower daily overwhelm", "Create a calming routine", "Build self-reflection momentum"],
    days: [
      ["Arrive and breathe", "Settle your body and establish a two-minute reset ritual."],
      ["Name the signal", "Notice emotional cues before they become pressure."],
      ["Soften the body", "Release jaw, shoulder, and breath tension through guided scanning."],
      ["Thought offload", "Move repetitive worries out of working memory."],
      ["Boundary pause", "Practice a short pause before saying yes to new demands."],
      ["Repair and recover", "Plan one recovery action after a difficult interaction."],
      ["Integrate", "Choose the rituals you want to keep next week."]
    ]
  },
  {
    slug: "anxiety-reduction",
    title: "21-Day Anxiety Reduction",
    description:
      "A structured anxiety program combining grounding, cognitive reframes, exposure planning, and nervous system recovery.",
    duration: 21,
    category: "anxiety",
    accent: "from-blue-500 to-iris",
    benefits: ["Reduce anticipatory worry", "Build coping flexibility", "Practice calm action under uncertainty"],
    days: Array.from({ length: 21 }, (_, index) => [
      `Anxiety skill ${index + 1}`,
      [
        "Map the worry loop and identify the trigger.",
        "Separate facts from predictions.",
        "Practice one tolerable step toward the avoided task."
      ][index % 3]
    ])
  },
  {
    slug: "sleep-improvement",
    title: "Sleep Improvement",
    description:
      "A calming sleep track for winding down, reducing rumination, and designing a more reliable evening rhythm.",
    duration: 14,
    category: "sleep",
    accent: "from-indigo-400 to-cyanGlow",
    benefits: ["Reduce nighttime rumination", "Improve wind-down consistency", "Create a gentler morning landing"],
    days: Array.from({ length: 14 }, (_, index) => [
      `Sleep practice ${index + 1}`,
      [
        "Design a landing routine for the final hour of the day.",
        "Use audio and breath to slow physiological arousal.",
        "Offload unfinished thoughts into a tomorrow list."
      ][index % 3]
    ])
  },
  {
    slug: "focus-improvement",
    title: "Focus Improvement",
    description:
      "A practical focus journey for attention rituals, distraction recovery, and energy-aware work blocks.",
    duration: 10,
    category: "focus",
    accent: "from-mint to-blue-500",
    benefits: ["Reduce context-switch fatigue", "Build deep work cues", "Recover faster from distraction"],
    days: Array.from({ length: 10 }, (_, index) => [
      `Focus ritual ${index + 1}`,
      [
        "Create a clean start cue and define one meaningful outcome.",
        "Map your top distractions without self-criticism.",
        "Practice a recovery routine after interruption."
      ][index % 3]
    ])
  }
].map((program) => ({
  ...program,
  days: program.days.map(([title, description], index) => ({
    dayNumber: index + 1,
    title,
    description,
    tasks: [
      {
        title: "Ground",
        description: "Begin with one minute of slow breathing and body awareness.",
        durationMinutes: 2,
        sortOrder: 1
      },
      {
        title: title,
        description,
        durationMinutes: program.category === "sleep" ? 10 : 7,
        sortOrder: 2
      },
      {
        title: "Reflect",
        description: "Write one sentence about what changed in your body, mood, or attention.",
        durationMinutes: 3,
        sortOrder: 3
      }
    ]
  }))
}));

export const audioCategoryCatalog = [
  ["meditation", "Meditation", "Mindful sessions for steadiness and emotional spaciousness."],
  ["sleep-stories", "Sleep Stories", "Slow narrative soundscapes for winding down."],
  ["anxiety-relief", "Anxiety Relief", "Grounding practices for worry, panic, and pressure."],
  ["ptsd-support", "PTSD Support", "Trauma-informed resets focused on safety and orientation."],
  ["focus-sessions", "Focus Sessions", "Attention support for calm productivity."],
  ["deep-breathing", "Deep Breathing", "Breath-led practices for nervous system regulation."],
  ["nervous-system-reset", "Nervous System Reset", "Short body-based resets after stress activation."]
] as const;

export const audioTrackCatalog = [
  {
    slug: "deep-blue-breathing",
    title: "Deep Blue Breathing",
    categorySlug: "anxiety-relief",
    duration: 720,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    imageGradient: "linear-gradient(135deg,#2563eb,#06b6d4)",
    description: "A paced breath session for lowering activation and returning to the present."
  },
  {
    slug: "morning-grounding",
    title: "Morning Grounding",
    categorySlug: "meditation",
    duration: 480,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    imageGradient: "linear-gradient(135deg,#0f766e,#22c55e)",
    description: "A gentle orientation practice to begin the day with clarity."
  },
  {
    slug: "delta-sleep-harbor",
    title: "Delta Sleep Harbor",
    categorySlug: "sleep-stories",
    duration: 1860,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    imageGradient: "linear-gradient(135deg,#312e81,#38bdf8)",
    description: "A slow sleep soundscape for easing rumination and inviting rest."
  },
  {
    slug: "safe-room-reset",
    title: "Safe Room Reset",
    categorySlug: "ptsd-support",
    duration: 960,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    imageGradient: "linear-gradient(135deg,#4c1d95,#f472b6)",
    description: "A trauma-informed orientation sequence focused on immediate safety cues."
  },
  {
    slug: "clean-focus-current",
    title: "Clean Focus Current",
    categorySlug: "focus-sessions",
    duration: 1500,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    imageGradient: "linear-gradient(135deg,#075985,#67e8f9)",
    description: "A steady background session for one focused work block."
  },
  {
    slug: "vagus-nerve-reset",
    title: "Vagus Nerve Reset",
    categorySlug: "nervous-system-reset",
    duration: 660,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    imageGradient: "linear-gradient(135deg,#164e63,#5af3c7)",
    description: "A short physiological reset for after conflict, overload, or urgency."
  },
  {
    slug: "box-breath-compass",
    title: "Box Breath Compass",
    categorySlug: "deep-breathing",
    duration: 540,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    imageGradient: "linear-gradient(135deg,#1d4ed8,#8267ff)",
    description: "A simple breath pattern to stabilize attention and emotional intensity."
  }
];
