# WebP Image Converter

A lightweight Node.js tool to convert JPG, JPEG, and PNG images to WebP format with customizable quality settings. Significantly reduce image file sizes while maintaining visual quality for faster web performance.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Features

- Convert individual images or entire directories recursively
- Customize output quality (1-100) to balance file size and visual fidelity
- Automatic size comparison to ensure WebP files are smaller than originals
- Detailed conversion reports showing file size reduction percentages
- Simple command-line interface

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/webp-image-converter.git
cd webp-image-converter

# Install dependencies
npm install
```

## 📊 Usage

### Basic Usage

```bash
# Convert a single image
node image-converter.js path/to/image.jpg

# Convert a directory of images with default quality (80)
node image-converter.js path/to/directory

# Convert with custom quality setting (1-100)
node image-converter.js path/to/directory 60

# Convert without recursive directory scanning
node image-converter.js path/to/directory 80 false
```

### Using NPM Scripts

```bash
# Convert images in the 'images' directory with quality setting of 60
npm run convert:60

# Convert with quality setting of 80
npm run convert:80
```

## 🛠️ Parameters

The script accepts the following parameters:

```
node image-converter.js <path> [quality] [recursive]
```

- `path`: Path to the image file or directory
- `quality`: (Optional) Quality setting from 1-100, default is 80
- `recursive`: (Optional) Process subdirectories if set to true (default), skip if false

## 📈 Example Results

Before/after comparison for typical image types:

| Image Type            | Original Size | WebP Size | Reduction |
| --------------------- | ------------- | --------- | --------- |
| JPEG photo            | 1.2 MB        | 320 KB    | 73%       |
| PNG icon              | 45 KB         | 12 KB     | 73%       |
| PNG with transparency | 280 KB        | 95 KB     | 66%       |

## 🔍 How It Works

The converter uses the [Sharp](https://sharp.pixelplumbing.com/) library to process images with the following approach:

1. Read the original image file
2. Convert to WebP with specified quality
3. Compare file sizes
4. Keep the WebP version only if it's smaller than the original
5. Generate detailed conversion statistics

## 📝 Code Example

```javascript
// Converting a single image
const { convertImageToWebP } = require("./image-converter");

async function example() {
  try {
    const result = await convertImageToWebP("image.jpg", 75, true);
    console.log(`Converted image saved to: ${result}`);
  } catch (error) {
    console.error("Conversion failed:", error);
  }
}
```

## 📄 License

MIT License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/webp-image-converter/issues).

## 💖 Acknowledgements

- [Sharp](https://sharp.pixelplumbing.com/) - High performance Node.js image processing
- Google for developing the WebP format
