import { useState } from "react";
import { useGame } from "@/lib/stores/useGame";
import { useLevel } from "@/lib/stores/useLevel";
import { useAudio } from "@/lib/stores/useAudio";
import HowToPlay from "./HowToPlay";

const Menu = () => {
  const { start } = useGame();
  const { level, highScore, resetLevels } = useLevel();
  const { toggleMute, isMuted } = useAudio();
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [playerCount, setPlayerCount] = useState(1);
  
  const handleStartGame = () => {
    console.log(`Starting game with ${playerCount} player(s)`);
    start();
  };
  
  return (
    <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center overflow-hidden">
      <div className="max-w-xl w-full p-8 bg-gray-800 rounded-xl shadow-2xl z-10">
        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Zaubershooter
        </h1>
        <h2 className="text-xl text-center text-purple-400 mb-8">Healing Magic</h2>
        
        <div className="mb-6 text-center">
          <p className="text-gray-300 mb-2">Current Level: {level}</p>
          <p className="text-gray-300">High Score: {highScore}</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <button
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            onClick={handleStartGame}
          >
            Start Game
          </button>
          
          <div className="flex justify-center space-x-4">
            <button
              className={`px-4 py-2 rounded-lg transition ${
                playerCount === 1 
                  ? "bg-indigo-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setPlayerCount(1)}
            >
              1 Player
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition ${
                playerCount === 2 
                  ? "bg-indigo-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setPlayerCount(2)}
            >
              2 Players
            </button>
          </div>
          
          <button
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
            onClick={() => setShowHowToPlay(true)}
          >
            How to Play
          </button>
          
          <button
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
            onClick={toggleMute}
          >
            {isMuted ? "Unmute Sound" : "Mute Sound"}
          </button>
          
          <button
            className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition"
            onClick={resetLevels}
          >
            Reset Progress
          </button>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          Use WASD to move, 1-5 to select spells, Space to cast, and P to pause
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-purple-500 opacity-10"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-blue-500 opacity-10"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-green-500 opacity-10"></div>
      </div>
      
      {/* How to Play modal */}
      {showHowToPlay && (
        <HowToPlay onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
};

export default Menu;
