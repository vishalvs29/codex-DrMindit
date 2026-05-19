export type AudioAssetProvider = "local" | "s3" | "r2" | "cdn";

const assetHost = process.env.AUDIO_ASSET_HOST?.replace(/\/$/, "") ?? "";
const defaultProvider = process.env.AUDIO_ASSET_PROVIDER ?? "local";

function getAssetHost(): string {
  if (!assetHost) {
    return "";
  }
  return assetHost;
}

export function resolveAudioAssetUrl(audioFileName: string) {
  if (defaultProvider === "local" || !getAssetHost()) {
    return `/audio/${audioFileName}`;
  }

  return `${getAssetHost()}/${audioFileName}`;
}

export function resolveAudioThumbnailUrl(thumbnailFileName: string) {
  if (defaultProvider === "local" || !getAssetHost()) {
    return `/audio/thumbnails/${thumbnailFileName}`;
  }

  return `${getAssetHost()}/thumbnails/${thumbnailFileName}`;
}

// Backwards-compatible helpers named for the new "sessions" terminology.
// These currently resolve to the same underlying asset paths. If we move
// assets to /public/sessions in future, update these helpers only.
export function resolveSessionAssetUrl(fileName: string) {
  return resolveAudioAssetUrl(fileName);
}

export function resolveSessionThumbnailUrl(fileName: string) {
  return resolveAudioThumbnailUrl(fileName);
}

export function getAudioProvider() {
  return defaultProvider as AudioAssetProvider;
}

export function getAudioProviderNote() {
  const provider = getAudioProvider();
  if (provider === "local") {
    return "Development assets are served from /public/audio. We expose session-named helpers (resolveSessionAssetUrl) for the Sessions rename — production should use a CDN-backed host with AUDIO_ASSET_HOST and a cloud object store for scale.";
  }

  return `Using ${provider.toUpperCase()} asset provider via ${getAssetHost()}.`;
}
