/* eslint-disable @typescript-eslint/no-require-imports */
// lib/index.js
const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

/**
 * Convert an image to WebP format with quality control
 * @param {string} imagePath - Path to the original image
 * @param {number} quality - Quality (between 1 and 100)
 * @param {boolean} compareSize - Compare before and after size
 * @returns {Promise<string>} - Output path
 */
async function convertImageToWebP(imagePath, quality = 80, compareSize = true) {
  try {
    // Determine output path and filename
    const dir = path.dirname(imagePath);
    const filename = path.basename(imagePath, path.extname(imagePath));
    const outputPath = path.join(dir, `${filename}.webp`);

    // Get original file size
    const originalStats = await fs.stat(imagePath);
    const originalSize = originalStats.size;

    // Convert image to WebP with specified quality
    await sharp(imagePath)
      .webp({
        quality: quality, // Set quality (1-100)
        effort: 6, // More effort for compression (0-6)
      })
      .toFile(outputPath);

    if (compareSize) {
      // Get new file size
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

      // If new file is larger than original, keep the original
      if (newSize > originalSize) {
        await fs.unlink(outputPath);
        console.log(
          `  WebP file is larger than original, conversion canceled.`
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

/**
 * Convert all compatible images in a directory to WebP
 * @param {string} directoryPath - Path to the directory
 * @param {number} quality - Quality setting (1-100)
 * @param {boolean} recursive - Process subdirectories
 * @returns {Promise<void>}
 */
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
        // If the item is a directory and recursion is enabled, enter the directory
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

module.exports = {
  convertImageToWebP,
  convertDirectoryImages,
};
