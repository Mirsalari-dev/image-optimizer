#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");
const { convertImageToWebP, convertDirectoryImages } = require("../lib/index");

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(
      "WebP Image Optimizer - Convert images to WebP format with optimized size"
    );
    console.log("");
    console.log("Usage: webp-optimizer <path> [quality] [recursive]");
    console.log("  path: Path to file or directory");
    console.log("  quality: Quality (1-100, default 80)");
    console.log(
      "  recursive: Process subdirectories (true/false, default true)"
    );
    console.log("");
    console.log("Examples:");
    console.log("  webp-optimizer ./images");
    console.log("  webp-optimizer ./images 60");
    console.log("  webp-optimizer ./logo.png 90");
    console.log("  webp-optimizer ./images 75 false");
    return;
  }

  const targetPath = args[0];
  const quality = parseInt(args[1]) || 80;
  const recursive = args[2] !== "false";

  console.log(`Starting conversion with quality ${quality}%...`);

  try {
    const stats = await fs.stat(targetPath);

    if (stats.isDirectory()) {
      await convertDirectoryImages(targetPath, quality, recursive);
    } else if (stats.isFile()) {
      const ext = path.extname(targetPath).toLowerCase();
      if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
        await convertImageToWebP(targetPath, quality);
      } else {
        console.log("Selected file is not a JPG or PNG image.");
      }
    }

    console.log("Conversion process completed.");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the script
main();
