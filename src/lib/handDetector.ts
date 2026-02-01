import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export class HandDetector {
    private static landmarker: HandLandmarker | null = null;

    static async initialize() {
        if (this.landmarker) return this.landmarker;

        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );

        this.landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                delegate: "GPU"
            },
            runningMode: "VIDEO",
            numHands: 1
        });

        return this.landmarker;
    }

    static detect(video: HTMLVideoElement, timestamp: number) {
        if (!this.landmarker) return null;
        return this.landmarker.detectForVideo(video, timestamp);
    }
}
