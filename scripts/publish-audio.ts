import fs from 'fs';
import path from 'path';

// Simple local publish script: moves files from ./staging/audio into ./public/audio
// Usage: node ./scripts/publish-audio.ts ./staging/audio/my-file.wav
// This is intentionally simple and does not require cloud SDKs. For S3/R2/CDN, extend with provider-specific SDKs.

async function main() {
  const src = process.argv[2];
  if (!src) {
    console.error('Usage: node ./scripts/publish-audio.ts <path-to-audio-file> [thumbnail-file]');
    process.exit(1);
  }

  const thumbnail = process.argv[3];

  const publicAudioDir = path.join(process.cwd(), 'public', 'audio');
  const publicThumbDir = path.join(publicAudioDir, 'thumbnails');

  fs.mkdirSync(publicAudioDir, { recursive: true });
  fs.mkdirSync(publicThumbDir, { recursive: true });

  const srcBase = path.basename(src);
  const dest = path.join(publicAudioDir, srcBase);
  fs.copyFileSync(src, dest);
  console.log(`Copied audio to ${path.relative(process.cwd(), dest)}`);

  if (thumbnail) {
    const thumbBase = path.basename(thumbnail);
    const destThumb = path.join(publicThumbDir, thumbBase);
    fs.copyFileSync(thumbnail, destThumb);
    console.log(`Copied thumbnail to ${path.relative(process.cwd(), destThumb)}`);
  }

  console.log('Done. If you host assets on a CDN or object store, upload the files there and set AUDIO_ASSET_HOST accordingly.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
