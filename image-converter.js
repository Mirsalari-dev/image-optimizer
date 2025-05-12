/* eslint-disable @typescript-eslint/no-require-imports */
// image-converter.js
const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

/**
 * Convert image to WebP format with quality control
 * @param {string} imagePath - Original image path
 * @param {number} quality - Quality (between 1 and 100)
 * @param {boolean} compareSize - Compare size before and after
 * @returns {Promise<string>} - Output path
 */
async function convertImageToWebP(imagePath, quality = 80, compareSize = true) {
  try {
    // Determine output path and filename
    const dir = path.dirname(imagePath);
    const filename = path.basename(imagePath, path.extname(imagePath));
    const outputPath = path.join(dir, `${filename}.webp`);

    // Get the original file size
    const originalStats = await fs.stat(imagePath);
    const originalSize = originalStats.size;

    // Convert image to WebP with specified quality
    await sharp(imagePath)
      .webp({
        quality: quality, // Set the quality (1-100)
        effort: 6, // More effort for compression (0-6)
      })
      .toFile(outputPath);

    if (compareSize) {
      // Get the new file size
      const newStats = await fs.stat(outputPath);
      const newSize = newStats.size;

      // Calculate size reduction percentage
      const reduction = (
        ((originalSize - newSize) / originalSize) *
        100
      ).toFixed(2);

      console.log(`Successful conversion: ${imagePath} → ${outputPath}`);
      console.log(`  Original size: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`  New size: ${(newSize / 1024).toFixed(2)} KB`);
      console.log(`  Size reduction: ${reduction}%`);

      // If the new file is larger than the original, keep the original
      if (newSize > originalSize) {
        await fs.unlink(outputPath);
        console.log(
          `  WebP file is larger than the original, conversion canceled.`
        );
        return imagePath;
      }
    } else {
      console.log(`Successful conversion: ${imagePath} → ${outputPath}`);
    }

    return outputPath;
  } catch (error) {
    console.error(`Error converting ${imagePath}:`, error);
    throw error;
  }
}

async function convertDirectoryImages(
  directoryPath,
  quality = 80,
  recursive = true
) {
  try {
    // Read directory contents
    const items = await fs.readdir(directoryPath, { withFileTypes: true });

    let totalOriginalSize = 0;
    let totalNewSize = 0;
    let fileCount = 0;

    for (const item of items) {
      const itemPath = path.join(directoryPath, item.name);

      if (item.isDirectory() && recursive) {
        // If the element is a directory and recursive mode is active, enter the folder
        await convertDirectoryImages(itemPath, quality, recursive);
      } else if (item.isFile()) {
        // Check file extension
        const ext = path.extname(item.name).toLowerCase();
        if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
          const originalStats = await fs.stat(itemPath);
          totalOriginalSize += originalStats.size;

          const outputPath = await convertImageToWebP(itemPath, quality, false);

          const newStats = await fs.stat(outputPath);
          totalNewSize += newStats.size;

          fileCount++;
        }
      }
    }

    if (fileCount > 0) {
      const reduction = (
        ((totalOriginalSize - totalNewSize) / totalOriginalSize) *
        100
      ).toFixed(2);
      console.log(`\nConversion results in directory ${directoryPath}:`);
      console.log(`  Number of converted files: ${fileCount}`);
      console.log(
        `  Total original size: ${(totalOriginalSize / (1024 * 1024)).toFixed(
          2
        )} MB`
      );
      console.log(
        `  Total new size: ${(totalNewSize / (1024 * 1024)).toFixed(2)} MB`
      );
      console.log(`  Total size reduction: ${reduction}%`);
    }
  } catch (error) {
    console.error(`Error processing directory ${directoryPath}:`, error);
    throw error;
  }
}

// For command line use
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Please specify the image file or folder path.");
    console.log("Usage: node image-converter.js <path> [quality] [recursive]");
    console.log("  path: File or folder path");
    console.log("  quality: Quality (1-100, default 80)");
    console.log(
      "  recursive: Process folders recursively (true/false, default true)"
    );
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
        console.log("The selected file is not a JPG or PNG image.");
      }
    }

    console.log("Conversion operation has finished.");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the script
main();

module.exports = {
  convertImageToWebP,
  convertDirectoryImages,
};
