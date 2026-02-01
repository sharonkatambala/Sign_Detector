# 🤟 SignWait - Real-time ASL Detector

A modern web application that uses computer vision and AI to detect American Sign Language (ASL) fingerspelling in real-time, right in your browser.

![SignWait Demo](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Hand%20Tracking-orange)

## ✨ Features

- **🎥 Real-time Detection**: Uses MediaPipe and TensorFlow.js to track hand landmarks and classify signs
- **🔤 Smart Autocomplete**: Suggests words based on fingerspelled characters
- **🔊 Text-to-Speech**: Pronounce your typed sentences with a single click
- **🔒 Privacy Focused**: All processing happens locally in your browser—no video is sent to the cloud
- **🎨 Modern UI**: Beautiful glassmorphism design with dark theme and smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A webcam
- Modern web browser (Chrome, Edge, or Firefox recommended)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sharonkatambala/Sign_Detector.git
   cd Sign_Detector
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to the URL shown (usually `http://localhost:5173`)

5. **Allow camera access** when prompted

## 📖 Usage

1. **Sign**: Hold your hand in front of the camera
2. **Type**: Signs held steadily will be added to the transcript
3. **Select**: Click a word suggestion to auto-complete your thought
4. **Speak**: Click the Play button to hear your text spoken aloud

### Supported Signs (Demo)

Currently supports basic ASL signs:
- ✊ **A/S** - Fist (thumb position varies)
- ✋ **B** - Open hand
- ☝️ **D** - Pointing finger
- 🤞 **V** - Peace sign
- 🤙 **Y** - Shaka sign
- 👌 **L** - L shape
- 🤘 **I** - Pinky up
- 🖖 **W** - Three fingers extended
- 🤟 **I Love You** sign

## 🛠️ Technology Stack

- **Frontend**: React 18.3 + TypeScript
- **Build Tool**: Vite 7.3
- **Computer Vision**: MediaPipe Hand Landmarker
- **UI**: Custom CSS with Glassmorphism
- **Speech**: Web Speech API
- **Icons**: Lucide React

## 📁 Project Structure

```
Sign_Detector/
├── src/
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles and design system
│   ├── components/
│   │   └── CameraView.tsx   # Webcam + hand detection
│   └── lib/
│       ├── handDetector.ts  # MediaPipe wrapper
│       ├── classifier.ts    # Sign recognition logic
│       └── dictionary.ts    # Autocomplete engine
├── public/
│   └── debug.html          # Diagnostic page
├── index.html
├── package.json
└── README.md
```

## 🎯 How It Works

1. **Hand Detection**: MediaPipe's Hand Landmarker detects 21 keypoints on your hand in 3D space
2. **Feature Extraction**: The app analyzes finger positions (extended/curled) and hand shape
3. **Classification**: Geometric heuristics map hand poses to ASL letters
4. **Smoothing**: Predictions are smoothed using a moving window and confidence threshold
5. **Autocomplete**: As letters are typed, the dictionary suggests matching words
6. **Speech**: Selected text is pronounced using the browser's native TTS engine

## 🔧 Improving Accuracy

The current classifier uses **rule-based heuristics**. For production-grade A-Z recognition:

### Option 1: Train a Custom Model
1. Collect landmark data for all 26 letters
2. Train an MLP or Random Forest in Python
3. Export to TensorFlow.js
4. Load in `classifier.ts`

### Option 2: Use an Existing Model
- Integrate pre-trained ASL recognition models
- Fine-tune on your own data
- Use transfer learning from existing hand pose datasets

## 🐛 Troubleshooting

### White/Blank Screen
1. Open browser console (F12) and check for errors
2. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Ensure camera permissions are granted

### Model Loading Issues
- Check your internet connection (model downloads from Google CDN)
- Try the debug page: `http://localhost:5173/debug.html`

### Low FPS or Lag
- Close other tabs/applications
- Lower video resolution in browser settings
- Use a device with better GPU support

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🎨 Enhance the UI/UX
- 🧠 Train better models for A-Z recognition
- 🌍 Add support for other sign languages

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [MediaPipe](https://mediapipe.dev/) for the Hand Landmarker model
- [TensorFlow.js](https://www.tensorflow.org/js) for browser-based ML
- Google for hosting the pre-trained models

## 📞 Contact

Created by [Sharon Katambala](https://github.com/sharonkatambala)

---

⭐ **Star this repo** if you find it helpful!
