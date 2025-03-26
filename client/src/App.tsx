import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { useGame } from "./lib/stores/useGame";
import GameManager from "./game/GameManager";
import Menu from "./components/Menu";
import GameUI from "./game/GameUI";
import SoundManager from "./game/SoundManager";
import { Controls } from "./game/types";
import "@fontsource/inter";

// Define control keys for the game
const keyMap = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.spell1, keys: ["Digit1"] },
  { name: Controls.spell2, keys: ["Digit2"] },
  { name: Controls.spell3, keys: ["Digit3"] },
  { name: Controls.spell4, keys: ["Digit4"] },
  { name: Controls.spell5, keys: ["Digit5"] },
  { name: Controls.cast, keys: ["Space"] },
  { name: Controls.pause, keys: ["KeyP"] },
];

// Main App component
function App() {
  const { phase } = useGame();
  const [showCanvas, setShowCanvas] = useState(false);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Preload audio
  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    const hit = new Audio("/sounds/hit.mp3");
    hit.volume = 0.5;
    setHitSound(hit);

    const success = new Audio("/sounds/success.mp3");
    success.volume = 0.5;
    setSuccessSound(success);

    // Show the canvas once everything is loaded
    setShowCanvas(true);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <KeyboardControls map={keyMap}>
          {phase === 'ready' && <Menu />}
          
          {phase === 'playing' && (
            <>
              <Canvas
                shadows
                camera={{
                  position: [0, 10, 0],
                  rotation: [-Math.PI / 2, 0, 0],
                  fov: 60,
                  near: 0.1,
                  far: 1000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "default"
                }}
              >
                <color attach="background" args={["#111827"]} />
                
                {/* Game content */}
                <Suspense fallback={null}>
                  <GameManager />
                </Suspense>
              </Canvas>
              <GameUI />
            </>
          )}
          
          <SoundManager />
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
