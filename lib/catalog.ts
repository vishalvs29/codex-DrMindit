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
        "Use sessions and breath to slow physiological arousal.",
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
    slug: "morning-grounding",
    title: "Morning Grounding",
    categorySlug: "meditation",
    duration: 240,
    audioPath: "morning-grounding.wav",
    thumbnailPath: "morning-grounding.svg",
    imageGradient: "linear-gradient(135deg,#0f766e,#22c55e)",
    narrator: "Sage Oak",
    tags: ["meditation", "morning", "presence"],
    accessTier: "FREE",
    description: "A gentle orientation practice to begin the day with clarity."
  },
  {
    slug: "delta-sleep-harbor",
    title: "Delta Sleep Harbor",
    categorySlug: "sleep-stories",
    duration: 300,
    audioPath: "delta-sleep-harbor.wav",
    thumbnailPath: "delta-sleep-harbor.svg",
    imageGradient: "linear-gradient(135deg,#312e81,#38bdf8)",
    narrator: "Lina Mercer",
    tags: ["sleep", "rest", "soundscape"],
    accessTier: "PREMIUM",
    description: "A slow sleep soundscape for easing rumination and inviting rest."
  },
  {
    slug: "deep-blue-breathing",
    title: "Deep Blue Breathing",
    categorySlug: "anxiety-relief",
    duration: 300,
    audioPath: "deep-blue-breathing.wav",
    thumbnailPath: "deep-blue-breathing.svg",
    imageGradient: "linear-gradient(135deg,#2563eb,#06b6d4)",
    narrator: "Ari Vale",
    tags: ["anxiety", "breathwork", "grounding"],
    accessTier: "PREMIUM",
    description: "A paced breath session for lowering activation and returning to the present."
  },
  {
    slug: "box-breath-compass",
    title: "Box Breath Compass",
    categorySlug: "deep-breathing",
    duration: 240,
    audioPath: "box-breath-compass.wav",
    thumbnailPath: "box-breath-compass.svg",
    imageGradient: "linear-gradient(135deg,#1d4ed8,#8267ff)",
    narrator: "Noah Wells",
    tags: ["breathing", "regulation", "focus"],
    accessTier: "PREMIUM",
    description: "A simple breath pattern to stabilize attention and emotional intensity."
  },
  {
    slug: "clean-focus-current",
    title: "Clean Focus Current",
    categorySlug: "focus-sessions",
    duration: 300,
    audioPath: "clean-focus-current.wav",
    thumbnailPath: "clean-focus-current.svg",
    imageGradient: "linear-gradient(135deg,#075985,#67e8f9)",
    narrator: "Mira Cole",
    tags: ["focus", "productivity", "attention"],
    accessTier: "PREMIUM",
    description: "A steady background session for one focused work block."
  }
  ,
  {
    slug: "brain-heart-coherence",
    title: "Brain-Heart Coherence",
    categorySlug: "deep-breathing",
    duration: 420,
    audioPath: "brain-heart-coherence.wav",
    thumbnailPath: "brain-heart-coherence.svg",
    imageGradient: "linear-gradient(135deg,#6ee7b7,#60a5fa)",
    narrator: "Dr. Aya Rao",
    tags: ["coherence", "breathwork", "heart-rate-variability"],
    accessTier: "PREMIUM",
    description: "A guided coherence practice to gently synchronize breath and heart rhythm for nervous system balance."
  }
] as const;
