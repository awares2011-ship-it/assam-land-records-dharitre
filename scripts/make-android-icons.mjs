// One-off: generate Android launcher icons from public/app-logo.webp.
// Usage: node scripts/make-android-icons.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC  = path.resolve('public/app-logo.webp');
const BASE = path.resolve('android/app/src/main/res');

const sizes = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi':  144,
  'mipmap-xxxhdpi': 192,
};
const adaptiveSize = 432;       // 108dp foreground canvas @ xxxhdpi
const inset = 0.72;             // Keep 72% of width as safe artwork area

async function roundCorners(buf, size, radius) {
  const r = radius ?? Math.round(size * 0.22);
  const mask = Buffer.from(
    `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}"/></svg>`
  );
  return sharp(buf)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function circle(buf, size) {
  const mask = Buffer.from(
    `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`
  );
  return sharp(buf)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Logo not found at', SRC);
    process.exit(1);
  }

  for (const [dir, size] of Object.entries(sizes)) {
    const out = path.join(BASE, dir);
    fs.mkdirSync(out, { recursive: true });

    const resized = await sharp(SRC).resize(size, size, { fit: 'cover' }).png().toBuffer();

    const launcher = await roundCorners(resized, size, Math.round(size * 0.22));
    fs.writeFileSync(path.join(out, 'ic_launcher.png'), launcher);

    const round = await circle(resized, size);
    fs.writeFileSync(path.join(out, 'ic_launcher_round.png'), round);

    // Adaptive foreground: artwork centred inside a 432px canvas at xxxhdpi
    // (Android crops freely; keeping ~72% inset avoids edge clipping).
    const fgSize = Math.round(size * (adaptiveSize / 192));
    const art = Math.round(fgSize * inset);
    const fg = await sharp({
      create: { width: fgSize, height: fgSize, channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 } },
    })
      .composite([{
        input: await sharp(SRC).resize(art, art, { fit: 'cover' }).png().toBuffer(),
        gravity: 'center',
      }])
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(out, 'ic_launcher_foreground.png'), fg);

    console.log(`✓ ${dir} @ ${size}px`);
  }

  // Adaptive icon background colour (brand violet from the logo gradient)
  const valuesDir = path.join(BASE, 'values');
  fs.mkdirSync(valuesDir, { recursive: true });
  fs.writeFileSync(
    path.join(valuesDir, 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#7E22CE</color>
</resources>
`,
  );

  // Adaptive icon XML (used by Android 8+ launchers for round / squircle masks)
  for (const dir of ['mipmap-anydpi-v26']) {
    const out = path.join(BASE, dir);
    fs.mkdirSync(out, { recursive: true });
    const adaptive = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;
    fs.writeFileSync(path.join(out, 'ic_launcher.xml'),       adaptive);
    fs.writeFileSync(path.join(out, 'ic_launcher_round.xml'), adaptive);
  }
  console.log('✓ adaptive icon XML + background colour');
}

main().catch(e => { console.error(e); process.exit(1); });
