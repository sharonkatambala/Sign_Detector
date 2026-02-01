// 21 Landmakrs
// 0: Wrist
// 1-4: Thumb
// 5-8: Index
// 9-12: Middle
// 13-16: Ring
// 17-20: Pinky

type Landmark = { x: number; y: number; z: number };

export class SignClassifier {
    constructor() {
        // Load weights or model here if available
        console.log("Classifier initialized");
    }

    predict(landmarks: Landmark[]): string | null {
        if (!landmarks || landmarks.length !== 21) return null;

        // Helper: is finger extended?
        // Compare tip to pip (proximal interphalangeal joint) or mcp
        // Index: 8 (tip), 6 (pip), 5 (mcp)

        // Check extension based on y-coordinate (up is lower value in pixels usually, but in normalized coordinates (0-1), 0 is top).
        // However, hand rotation matters. A better geometric check uses distance from wrist.
        // Extended if dist(tip, wrist) > dist(pip, wrist) is a rough check.

        const isExtended = (tipIdx: number, pipIdx: number) => {
            const tip = landmarks[tipIdx];
            const pip = landmarks[pipIdx];
            const wrist = landmarks[0];

            const dTip = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
            const dPip = Math.hypot(pip.x - wrist.x, pip.y - wrist.y);

            return dTip > dPip;
        };

        const thumbExt = isExtended(4, 2); // Compare with MCP or similar? Thumb is tricky.
        const indexExt = isExtended(8, 6);
        const middleExt = isExtended(12, 10);
        const ringExt = isExtended(16, 14);
        const pinkyExt = isExtended(20, 18);

        // Thumb is special, check x dictance for L shape if needed. 
        // For simplicity, let's just use the booleans.

        let sign = "";

        // Logic for some letters
        if (!indexExt && !middleExt && !ringExt && !pinkyExt) {
            // All fingers closed: A, S, E, M, N...
            // Heuristic: A usually has thumb out to side, S thumb over fingers.
            // Let's call it "A" for now.
            sign = "A";
            if (thumbExt) sign = "A"; // Thumb up/out is A
            else sign = "S"; // Thumb curled is S (simplified)
        }
        else if (indexExt && middleExt && ringExt && pinkyExt && thumbExt) {
            sign = "B"; // Open hand (often B or 5)
        }
        else if (!thumbExt && !indexExt && !middleExt && !ringExt && !pinkyExt) {
            // Should be caught by first block, but ensure logic falls through
        }
        else if (indexExt && !middleExt && !ringExt && !pinkyExt) {
            // Pointing up: D
            sign = "D";
        }
        else if (indexExt && middleExt && !ringExt && !pinkyExt) {
            // V shape: V
            sign = "V";
            // If thumb extended?
        }
        else if (thumbExt && !indexExt && !middleExt && !ringExt && pinkyExt) {
            // Shaka or Y
            sign = "Y";
        }
        else if (thumbExt && indexExt && !middleExt && !ringExt && !pinkyExt) {
            // L shape
            sign = "L";
        }
        else if (indexExt && middleExt && ringExt && !pinkyExt) {
            // W
            sign = "W";
        }
        else if (thumbExt && indexExt && pinkyExt && !middleExt && !ringExt) {
            // I_LOVE_YOU sign (Spider-man?)
            sign = "🤟";
        }
        else if (!thumbExt && !indexExt && !middleExt && !ringExt && pinkyExt) {
            // I
            sign = "I";
        }

        // Add C: Curved fingers? Hard to detect with just extension.
        // Use X coordinates for C.

        return sign || null;
    }
}
