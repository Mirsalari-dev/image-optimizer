/* eslint-disable @typescript-eslint/no-require-imports */
// image-converter.js
const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

/**
 * تبدیل تصویر به فرمت WebP با کنترل کیفیت
 * @param {string} imagePath - مسیر تصویر اصلی
 * @param {number} quality - کیفیت (بین 1 تا 100)
 * @param {boolean} compareSize - مقایسه اندازه قبل و بعد
 * @returns {Promise<string>} - مسیر خروجی
 */
async function convertImageToWebP(imagePath, quality = 80, compareSize = true) {
  try {
    // تعیین مسیر و نام فایل خروجی
    const dir = path.dirname(imagePath);
    const filename = path.basename(imagePath, path.extname(imagePath));
    const outputPath = path.join(dir, `${filename}.webp`);

    // اندازه فایل اصلی را بدست می‌آوریم
    const originalStats = await fs.stat(imagePath);
    const originalSize = originalStats.size;

    // تبدیل تصویر به WebP با کیفیت مشخص شده
    await sharp(imagePath)
      .webp({
        quality: quality, // کیفیت را تنظیم می‌کنیم (1-100)
        effort: 6, // تلاش بیشتر برای فشرده‌سازی (0-6)
      })
      .toFile(outputPath);

    if (compareSize) {
      // اندازه فایل جدید را بدست می‌آوریم
      const newStats = await fs.stat(outputPath);
      const newSize = newStats.size;

      // محاسبه درصد کاهش حجم
      const reduction = (
        ((originalSize - newSize) / originalSize) *
        100
      ).toFixed(2);

      console.log(`تبدیل موفق: ${imagePath} → ${outputPath}`);
      console.log(`  حجم اصلی: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`  حجم جدید: ${(newSize / 1024).toFixed(2)} KB`);
      console.log(`  کاهش حجم: ${reduction}%`);

      // اگر فایل جدید بزرگتر از اصلی است، اصلی را نگه داریم
      if (newSize > originalSize) {
        await fs.unlink(outputPath);
        console.log(`  فایل WebP بزرگتر از اصلی است، تبدیل لغو شد.`);
        return imagePath;
      }
    } else {
      console.log(`تبدیل موفق: ${imagePath} → ${outputPath}`);
    }

    return outputPath;
  } catch (error) {
    console.error(`خطا در تبدیل ${imagePath}:`, error);
    throw error;
  }
}

async function convertDirectoryImages(
  directoryPath,
  quality = 80,
  recursive = true
) {
  try {
    // خواندن محتوای دایرکتوری
    const items = await fs.readdir(directoryPath, { withFileTypes: true });

    let totalOriginalSize = 0;
    let totalNewSize = 0;
    let fileCount = 0;

    for (const item of items) {
      const itemPath = path.join(directoryPath, item.name);

      if (item.isDirectory() && recursive) {
        // اگر المان یک پوشه است و حالت بازگشتی فعال است، وارد پوشه می‌شویم
        await convertDirectoryImages(itemPath, quality, recursive);
      } else if (item.isFile()) {
        // بررسی پسوند فایل
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
      console.log(`\nنتایج تبدیل در پوشه ${directoryPath}:`);
      console.log(`  تعداد فایل‌های تبدیل شده: ${fileCount}`);
      console.log(
        `  حجم کل اصلی: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB`
      );
      console.log(
        `  حجم کل جدید: ${(totalNewSize / (1024 * 1024)).toFixed(2)} MB`
      );
      console.log(`  کاهش حجم کل: ${reduction}%`);
    }
  } catch (error) {
    console.error(`خطا در پردازش دایرکتوری ${directoryPath}:`, error);
    throw error;
  }
}

// برای استفاده در خط فرمان
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("لطفا مسیر پوشه یا فایل تصویر را مشخص کنید.");
    console.log(
      "استفاده: node image-converter.js <path> [quality] [recursive]"
    );
    console.log("  path: مسیر فایل یا پوشه");
    console.log("  quality: کیفیت (1-100، پیش‌فرض 80)");
    console.log(
      "  recursive: پردازش بازگشتی پوشه‌ها (true/false، پیش‌فرض true)"
    );
    return;
  }

  const targetPath = args[0];
  const quality = parseInt(args[1]) || 80;
  const recursive = args[2] !== "false";

  console.log(`شروع تبدیل با کیفیت ${quality}%...`);

  try {
    const stats = await fs.stat(targetPath);

    if (stats.isDirectory()) {
      await convertDirectoryImages(targetPath, quality, recursive);
    } else if (stats.isFile()) {
      const ext = path.extname(targetPath).toLowerCase();
      if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
        await convertImageToWebP(targetPath, quality);
      } else {
        console.log("فایل انتخاب شده تصویر با فرمت JPG یا PNG نیست.");
      }
    }

    console.log("عملیات تبدیل به پایان رسید.");
  } catch (error) {
    console.error("خطا:", error);
  }
}

// اجرای اسکریپت
main();

module.exports = {
  convertImageToWebP,
  convertDirectoryImages,
};
