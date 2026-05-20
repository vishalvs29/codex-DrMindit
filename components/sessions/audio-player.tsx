"use client";

export { AudioPlayerProvider, useAudioPlayer, FavoriteButton } from "@/components/audio/audio-player";
export type { PlayerTrack } from "@/components/audio/audio-player";

// Note: this file re-exports the existing audio player implementation under the
// `sessions` namespace to support a gradual rename without breaking imports.
