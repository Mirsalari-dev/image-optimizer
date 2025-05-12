# WebP Image Optimizer

A lightweight Node.js tool to convert JPG, JPEG, and PNG images to WebP format with customizable quality settings. Significantly reduce image file sizes while maintaining visual quality for faster web performance.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Features

- Convert individual images or entire directories recursively
- Customize output quality (1-100) to balance file size and visual fidelity
- Automatic size comparison to ensure WebP files are smaller than originals
- Detailed conversion reports showing file size reduction percentages
- Simple command-line interface
- Can be used as a library in your Node.js applications

## 🚀 Installation

### Global Installation (CLI usage)

```bash
# Install globally
npm install -g webp-image-optimizer

# Now you can use it from anywhere
webp-optimizer ./path/to/images
```

### Local Project Installation

```bash
# Add to your project
npm install webp-image-optimizer

# Or with yarn
yarn add webp-image-optimizer
```

## 📊 Usage

### Command Line Usage

```bash
# Convert a single image
webp-optimizer path/to/image.jpg

# Convert a directory of images with default quality (80)
webp-optimizer path/to/directory

# Convert with custom quality setting (1-100)
webp-optimizer path/to/directory 60

# Convert without recursive directory scanning
webp-optimizer path/to/directory 80 false
```

### Using as a Node.js Library

```javascript
const {
  convertImageToWebP,
  convertDirectoryImages,
} = require("webp-image-optimizer");

// Convert a single image
async function convertSingleImage() {
  try {
    const outputPath = await convertImageToWebP("./image.jpg", 75);
    console.log(`Image converted successfully: ${outputPath}`);
  } catch (error) {
    console.error("Conversion failed:", error);
  }
}

// Convert all images in a directory
async function convertAllImages() {
  try {
    await convertDirectoryImages("./images", 80, true);
    console.log("All images converted successfully");
  } catch (error) {
    console.error("Directory conversion failed:", error);
  }
}
```

### Using NPM Scripts

You can add these scripts to your package.json:

```json
"scripts": {
  "optimize": "webp-optimizer ./images",
  "optimize:60": "webp-optimizer ./images 60",
  "optimize:80": "webp-optimizer ./images 80"
}
```

## 🛠️ API Reference

### convertImageToWebP(imagePath, quality, compareSize)

Converts a single image to WebP format.

- `imagePath` (String): Path to the image file
- `quality` (Number, optional): Quality setting from 1-100, default is 80
- `compareSize` (Boolean, optional): If true, only saves WebP if smaller than original (default: true)
- Returns: Promise resolving to the output file path

### convertDirectoryImages(directoryPath, quality, recursive)

Converts all compatible images in a directory.

- `directoryPath` (String): Path to the directory
- `quality` (Number, optional): Quality setting from 1-100, default is 80
- `recursive` (Boolean, optional): Process subdirectories if true (default: true)
- Returns: Promise that resolves when all conversions are complete

## 📈 Example Results

Before/after comparison for typical image types:

| Image Type            | Original Size | WebP Size | Reduction |
| --------------------- | ------------- | --------- | --------- |
| JPEG photo            | 1.2 MB        | 320 KB    | 73%       |
| PNG icon              | 45 KB         | 12 KB     | 73%       |
| PNG with transparency | 280 KB        | 95 KB     | 66%       |

## 🔍 How It Works

The optimizer uses the [Sharp](https://sharp.pixelplumbing.com/) library to process images with the following approach:

1. Read the original image file
2. Convert to WebP with specified quality
3. Compare file sizes
4. Keep the WebP version only if it's smaller than the original
5. Generate detailed conversion statistics

## 📄 License

MIT License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Mirsalari-dev/image-optimizer/issues).

## 💖 Acknowledgements

- [Sharp](https://sharp.pixelplumbing.com/) - High performance Node.js image processing
- Google for developing the WebP format
