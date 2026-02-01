import { useState, useEffect } from 'react';
import { CameraView } from './components/CameraView';
import { getSuggestions } from './lib/dictionary';
import { Volume2, X, Play, Copy, Trash2, Hand } from 'lucide-react';

function App() {
  console.log("🎨 App component rendering...");
  const [text, setText] = useState<string>("");
  const [lastWord, setLastWord] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  // Update suggestions when text changes
  useEffect(() => {
    // Find the last partial word
    // "Hello wor" -> "wor"
    const words = text.split(" ");
    const last = words[words.length - 1];
    setLastWord(last);

    if (last.length > 0) {
      setSuggestions(getSuggestions(last));
    } else {
      setSuggestions([]);
    }
  }, [text]);

  const handleSignDetected = (sign: string) => {
    // Append letter
    // If sign is "SPACE" or something we can handle it
    // For now we assume A-Z
    setText(prev => prev + sign);
  };

  const handleSuggestionClick = (word: string) => {
    // Replace last word with suggestion
    const output = text.substring(0, text.lastIndexOf(lastWord)) + word + " ";
    setText(output);
  };

  const handleSpeak = () => {
    if (!text) return;

    // Cancel any current speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    // Select voice if available (optional)
    const voices = synth.getVoices();
    // Try to find a nice English voice
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha'));
    if (preferredVoice) utterance.voice = preferredVoice;

    synth.speak(utterance);
  };

  const clearText = () => {
    if (confirm("Clear all text?")) {
      setText("");
    }
  };

  const deleteLastChar = () => {
    setText(prev => prev.slice(0, -1));
  };

  const addSpace = () => {
    setText(prev => prev + " ");
  };

  return (
    <div className="container">
      <header className="col-span-full mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Hand className="text-white" size={24} />
          </div>
          <div>
            <h1>SignWait</h1>
            <p className="text-gray-400 text-sm">Real-time ASL to Text & Speech</p>
          </div>
        </div>
        <div className="hidden md:block">
          <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">How it works</a>
        </div>
      </header>

      {/* Left Column: Camera */}
      <div className="flex flex-col gap-4">
        <CameraView onSignDetected={handleSignDetected} />

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-200">Controls</h3>
          <div className="flex gap-2 flex-wrap">
            <button onClick={addSpace} className="btn-icon flex-1 h-12 rounded-lg border-blue-500/30 hover:bg-blue-500/20">
              SPACE
            </button>
            <button onClick={deleteLastChar} className="btn-icon w-12 h-12 rounded-lg hover:text-red-400">
              <X size={20} />
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-300">Tips:</strong> Ensure good lighting. Keep your hand visible within the frame.
            Stable gestures are detected as letters. Hold a sign for a moment to type it.
          </p>
        </div>
      </div>

      {/* Right Column: Text & Tools */}
      <div className="flex flex-col gap-4 h-full">
        <div className="glass-panel p-6 flex-1 flex flex-col relative min-h-[300px]">
          <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-4">
            <h2 className="text-xl font-semibold text-white">Transcript</h2>
            <div className="flex gap-2">
              <button onClick={() => navigator.clipboard.writeText(text)} className="btn-icon rounded-full p-2" title="Copy">
                <Copy size={16} />
              </button>
              <button onClick={clearText} className="btn-icon rounded-full p-2 hover:bg-red-500/20 hover:text-red-400" title="Clear">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <textarea
            className="flex-1 bg-transparent border-none resize-none outline-none text-2xl text-gray-200 font-medium placeholder-gray-700"
            placeholder="Start signing to type..."
            value={text}
            readOnly
          />

          {/* Autocomplete */}
          {suggestions.length > 0 && (
            <div className="mt-6 mb-4">
              <span className="text-xs text-blue-400 uppercase tracking-wider font-bold mb-2 block">Suggestions</span>
              <div className="suggestions">
                {suggestions.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(word)}
                    className="suggestion-chip"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-gray-700 flex justify-end">
            <button
              onClick={handleSpeak}
              disabled={!text || isSpeaking}
              className={`btn-primary flex items-center gap-2 rounded-full px-6 py-3 shadow-lg shadow-blue-900/50 ${isSpeaking ? 'opacity-70' : ''}`}
            >
              {isSpeaking ? (
                <Volume2 className="animate-pulse" />
              ) : (
                <Play fill="currentColor" />
              )}
              {isSpeaking ? 'Speaking...' : 'Speak Text'}
            </button>
          </div>
        </div>

        {/* Debug / Info */}
        <div className="glass-panel p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Supported Signs (Demo)</h3>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-800 rounded">Open Hand (B)</span>
            <span className="px-2 py-1 bg-gray-800 rounded">Fist (A)</span>
            <span className="px-2 py-1 bg-gray-800 rounded">Point (D)</span>
            <span className="px-2 py-1 bg-gray-800 rounded">V Sign (V)</span>
            <span className="px-2 py-1 bg-gray-800 rounded">Shaka (Y)</span>
            <span className="px-2 py-1 bg-gray-800 rounded">L Shape (L)</span>
            <span className="px-2 py-1 bg-gray-800 rounded">Pinky (I)</span>
            <span className="px-2 py-1 bg-gray-800 rounded">Spider-Man (🤟)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
