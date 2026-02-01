import React, { useEffect, useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { HandDetector } from '../lib/handDetector';
import { SignClassifier } from '../lib/classifier';
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';

interface CameraViewProps {
    onSignDetected: (sign: string) => void;
}

const SMOOTHING_WINDOW = 10;
const CONFIDENCE_THRESHOLD = 7; // out of 10 frames

export const CameraView: React.FC<CameraViewProps> = ({ onSignDetected }) => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cameraError, setCameraError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPrediction, setCurrentPrediction] = useState<string | null>(null);

    const classifier = useRef(new SignClassifier());
    const predictionBuffer = useRef<string[]>([]);
    const lastEmittedRef = useRef<string | null>(null);
    const frameId = useRef<number>(0);

    useEffect(() => {
        console.log("🚀 CameraView mounting...");
        const init = async () => {
            try {
                console.log("📡 Initializing HandDetector...");
                await HandDetector.initialize();
                console.log("✅ HandDetector initialized successfully");
                setLoading(false);
            } catch (e) {
                console.error("❌ Failed to load model:", e);
                setLoading(false); // Set to false even on error to show UI
            }
        };
        init();

        return () => {
            console.log("🧹 CameraView unmounting");
            cancelAnimationFrame(frameId.current);
        };
    }, []);

    const onResult = useCallback((result: HandLandmarkerResult) => {
        const canvas = canvasRef.current;
        const video = webcamRef.current?.video;
        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw landmarks
        if (result.landmarks && result.landmarks.length > 0) {
            const landmarks = result.landmarks[0];

            // Draw connectors and points
            // We can use DrawingUtils or custom drawing
            // Custom drawing for "Rich aesthetics" - maybe glowing lines?

            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#60a5fa'; // Blue-400

            // Helper to draw
            const drawInfo = (start: number, end: number) => {
                const p1 = landmarks[start];
                const p2 = landmarks[end];
                ctx.beginPath();
                ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
                ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
                ctx.stroke();
            };

            // Thumb
            drawInfo(0, 1); drawInfo(1, 2); drawInfo(2, 3); drawInfo(3, 4);
            // Index
            drawInfo(0, 5); drawInfo(5, 6); drawInfo(6, 7); drawInfo(7, 8);
            // Middle
            drawInfo(9, 10); drawInfo(10, 11); drawInfo(11, 12); drawInfo(0, 9);
            // Ring
            drawInfo(13, 14); drawInfo(14, 15); drawInfo(15, 16); drawInfo(0, 13);
            // Pinky
            drawInfo(0, 17); drawInfo(17, 18); drawInfo(18, 19); drawInfo(19, 20);
            // Connections
            drawInfo(5, 9); drawInfo(9, 13); drawInfo(13, 17);

            // Points
            ctx.fillStyle = '#a78bfa'; // Purple-400
            for (const pt of landmarks) {
                ctx.beginPath();
                ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 4, 0, 2 * Math.PI);
                ctx.fill();
            }

            // Predict
            const sign = classifier.current.predict(landmarks);
            processPrediction(sign);
        } else {
            processPrediction(null);
        }
    }, []);

    const processPrediction = (sign: string | null) => {
        // Add to buffer
        const buffer = predictionBuffer.current;
        buffer.push(sign || "_");
        if (buffer.length > SMOOTHING_WINDOW) buffer.shift();

        // Majority vote
        const counts: Record<string, number> = {};
        for (const s of buffer) {
            counts[s] = (counts[s] || 0) + 1;
        }

        let topSign = "_";
        let maxCount = 0;
        for (const s in counts) {
            if (counts[s] > maxCount) {
                maxCount = counts[s];
                topSign = s;
            }
        }

        if (topSign !== "_" && maxCount >= CONFIDENCE_THRESHOLD) {
            setCurrentPrediction(topSign);
            // Logic to commit letter:
            // If different from last emitted, emit it
            // For consecutive same letters, user usually has to execute a "space" or "neutral" in between, 
            // or we use a timer. For now, just change detection.
            if (topSign !== lastEmittedRef.current) {
                onSignDetected(topSign);
                lastEmittedRef.current = topSign;
            }
        } else {
            setCurrentPrediction(null);
            // If we see nothing for a while, we can reset lastEmitted to allow re-typing same letter
            if (topSign === "_") {
                // Only reset if it's been empty for a bit?
                // Actually, ASL usually uses dynamic movement for double letters, or just pauses.
                // We'll reset if buffer is mostly empty.
                if (maxCount >= CONFIDENCE_THRESHOLD) {
                    lastEmittedRef.current = null;
                }
            }
        }
    };

    const loop = () => {
        if (
            webcamRef.current &&
            webcamRef.current.video &&
            webcamRef.current.video.readyState === 4 &&
            !loading
        ) {
            const video = webcamRef.current.video;
            const startTimeMs = performance.now();
            const result = HandDetector.detect(video, startTimeMs);

            if (result) {
                onResult(result);
            }
        }
        frameId.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        if (!loading) {
            frameId.current = requestAnimationFrame(loop);
        }
        return () => cancelAnimationFrame(frameId.current);
    }, [loading, onResult]);

    if (cameraError) {
        return (
            <div className="glass-panel p-8 flex flex-col items-center justify-center h-full text-center">
                <AlertCircle size={48} className="text-red-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Camera Error</h3>
                <p className="text-gray-300">Please allow camera access to use this app.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 btn-primary flex items-center gap-2"
                >
                    <RefreshCw size={18} /> Retry
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-4 relative flex flex-col items-center">
            <div className="video-wrapper">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    onUserMediaError={() => setCameraError(true)}
                    className="absolute inset-0 w-full h-full object-cover"
                    mirrored
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    width={640} // Internal resolution
                    height={480}
                />

                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-white font-medium">Loading AI Model...</span>
                    </div>
                )}

                <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full text-white font-mono text-sm border border-white/10 backdrop-blur-md">
                    {currentPrediction ? `Detected: ${currentPrediction}` : "No Hand"}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between w-full px-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    {loading ? "Initializing..." : "Camera Active"}
                </div>
                <div className="flex items-center gap-1">
                    <Camera size={14} />
                    <span>30 FPS</span>
                </div>
            </div>
        </div>
    );
};
