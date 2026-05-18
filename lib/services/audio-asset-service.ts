export function resolveAudioAssetUrl(trackSlug: string, fallbackUrl: string) {
  const host = process.env.AUDIO_ASSET_HOST?.replace(/\/$/, "");
  if (!host) {
    return fallbackUrl;
  }

  return `${host}/${encodeURIComponent(trackSlug)}.mp3`;
}
