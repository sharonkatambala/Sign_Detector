# SignWait - Real-time ASL Detector

A modern web application that uses computer vision to detect American Sign Language (ASL) fingerspelling in real-time right in your browser.

## Features

- **Real-time Detection**: Uses MediaPipe and TensorFlow.js to track hand landmarks and classify signs.
- **Smart Autocomplete**: Suggests words based on fingerspelled characters.
- **Text-to-Speech**: Pronounce your typed sentences with a single click.
- **Privacy Focused**: All processing happens locally in your browser; no video is sent to the cloud.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A webcam

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the URL shown (usually `http://localhost:5173`).

4. Allow camera access when prompted.

## Usage

1. **Sign**: Hold your hand in front of the camera. The app supports basic signs like A (Fist), B (Open Hand), D (Point), V, L, Y, and I.
2. **Type**: Signs held steadily will be added to the transcript.
3. **Select**: Click a word suggestion to auto-complete your thought.
4. **Speak**: Click the Play button to hear your text spoken aloud.

## Technology Stack

- React + TypeScript + Vite
- MediaPipe (Computer Vision)
- Web Speech API
- Lucide React (Icons)
