import { readFileSync } from "node:fs";
import sharp from "sharp";

const svg = readFileSync(new URL("../public/goose-orange.svg", import.meta.url));

async function makeIcon(size: number, outFile: string) {
  const pad = Math.round(size * 0.14);
  const inner = size - pad * 2;
  const gooseBuffer = await sharp(svg, { density: 384 })
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#4e2996",
    },
  })
    .composite([{ input: gooseBuffer, left: pad, top: pad }])
    .png()
    .toFile(new URL(`../public/${outFile}`, import.meta.url).pathname.slice(1));
}

for (const size of [180, 192, 512]) {
  await makeIcon(size, `icon-${size}.png`);
  console.log(`wrote icon-${size}.png`);
}
