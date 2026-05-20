import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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

  // If provider is S3/R2, upload to the configured bucket
  const provider = process.env.AUDIO_ASSET_PROVIDER || 'local';
  if (provider === 's3' || provider === 'r2') {
    const bucket = process.env.AUDIO_ASSET_BUCKET;
    const region = process.env.AUDIO_ASSET_REGION || 'auto';
    const endpoint = process.env.AUDIO_ASSET_ENDPOINT || undefined; // for R2 or custom S3-compatible endpoints

    if (!bucket) {
      console.error('AUDIO_ASSET_BUCKET is required for s3/r2 provider. Files were copied locally but not uploaded.');
      process.exit(1);
    }

    const s3 = new S3Client({ region, endpoint });

    async function upload(filePath: string, destKey: string) {
      const body = fs.readFileSync(filePath);
      const cmd = new PutObjectCommand({ Bucket: bucket, Key: destKey, Body: body, ACL: 'public-read', ContentType: getContentType(destKey) });
      await s3.send(cmd);
      const host = process.env.AUDIO_ASSET_HOST || `https://${bucket}${endpoint ? '' : `.${region}.digitaloceanspaces.com`}`;
      return `${host.replace(/\/$/, '')}/${destKey}`;
    }

    function getContentType(name: string) {
      if (name.endsWith('.mp3')) return 'audio/mpeg';
      if (name.endsWith('.wav')) return 'audio/wav';
      if (name.endsWith('.ogg')) return 'audio/ogg';
      if (name.endsWith('.svg')) return 'image/svg+xml';
      return 'application/octet-stream';
    }

    try {
      const uploadedAudioUrl = await upload(dest, srcBase);
      console.log(`Uploaded audio to ${uploadedAudioUrl}`);
      if (thumbnail) {
        const thumbBase = path.basename(thumbnail);
        const destThumb = path.join('thumbnails', thumbBase);
        const uploadedThumbUrl = await upload(path.join(publicThumbDir, thumbBase), destThumb);
        console.log(`Uploaded thumbnail to ${uploadedThumbUrl}`);
      }
      console.log('Upload complete. Set AUDIO_ASSET_HOST to the CDN root if necessary.');
    } catch (err) {
      console.error('Upload failed:', err);
      process.exit(1);
    }
  } else {
    console.log('Done. Files were copied to public/audio.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
