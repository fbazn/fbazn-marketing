import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, "../public/screenshots");

const TARGET_W = 2160;
const TARGET_H = 1350;
const BG = { r: 8, g: 12, b: 24, alpha: 1 }; // #080c18

async function processToTarget(inputPath, outputPath) {
  const meta = await sharp(inputPath).metadata();
  console.log(`Input: ${meta.width}x${meta.height}`);

  // Scale to fit width=TARGET_W, maintain aspect ratio
  const scaleW = TARGET_W / meta.width;
  const newH = Math.round(meta.height * scaleW);

  let pipeline = sharp(inputPath).resize(TARGET_W, newH, { fit: "fill" });

  if (newH < TARGET_H) {
    // Pad top and bottom
    const padTop = Math.floor((TARGET_H - newH) / 2);
    const padBottom = TARGET_H - newH - padTop;
    pipeline = pipeline.extend({
      top: padTop,
      bottom: padBottom,
      left: 0,
      right: 0,
      background: BG,
    });
  } else if (newH > TARGET_H) {
    // Crop from top (keep top portion)
    pipeline = pipeline.extract({ left: 0, top: 0, width: TARGET_W, height: TARGET_H });
  }

  await pipeline.png().toFile(outputPath);
  console.log(`✓ Saved: ${outputPath}`);
}

// --- Review Queue (html2canvas at 1.5x scale → ~2880×1333) ---
// html2canvas outputs are already ~TARGET size, just resize to exact
await processToTarget(
  join(screenshotsDir, "review-queue-raw.png"),
  join(screenshotsDir, "review-queue-detail.png")
);

// --- Sourcing (same) ---
await processToTarget(
  join(screenshotsDir, "sourcing-raw.png"),
  join(screenshotsDir, "sourcing-detail.png")
);

// --- Extension screenshot (raw 1920×1080 from PowerShell) ---
// Crop out browser chrome (top ~110px) and taskbar (bottom ~60px)
// leaving the Amazon page + extension bar
{
  const inputPath = join(screenshotsDir, "ext-raw.png");
  const outputPath = join(screenshotsDir, "amazon-extension.png");
  const meta = await sharp(inputPath).metadata();
  console.log(`Extension input: ${meta.width}x${meta.height}`);

  // Crop: remove top 110px (browser chrome) and bottom 60px (taskbar)
  const cropTop = 110;
  const cropBottom = 60;
  const croppedH = meta.height - cropTop - cropBottom;
  // croppedH = 1080 - 110 - 60 = 910

  // Scale cropped area to TARGET_W
  const scaleW = TARGET_W / meta.width; // 2160/1920 = 1.125
  const scaledH = Math.round(croppedH * scaleW); // 910 * 1.125 = 1024

  const padTop = Math.floor((TARGET_H - scaledH) / 2);
  const padBottom = TARGET_H - scaledH - padTop;

  await sharp(inputPath)
    .extract({ left: 0, top: cropTop, width: meta.width, height: croppedH })
    .resize(TARGET_W, scaledH, { fit: "fill" })
    .extend({ top: padTop, bottom: padBottom, left: 0, right: 0, background: BG })
    .png()
    .toFile(outputPath);

  console.log(`✓ Saved: ${outputPath}`);
}

console.log("\nAll screenshots processed.");
