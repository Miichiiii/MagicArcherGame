import { useEffect, useState } from "react";
import { useSpells } from "@/lib/stores/useSpells";
import { useNPC } from "@/lib/stores/useNPC";
import { useLevel } from "@/lib/stores/useLevel";
import { useGame } from "@/lib/stores/useGame";
import { useAudio } from "@/lib/stores/useAudio";
import { SPELL_TYPES } from "./constants";

const GameUI = () => {
  const { selectedSpell, setSelectedSpell } = useSpells();
  const { npcs } = useNPC();
  const { level, score } = useLevel();
  const { phase, restart } = useGame();
  const { toggleMute, isMuted } = useAudio();
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  
  // Check if level is complete
  useEffect(() => {
    if (npcs.length > 0) {
      const allHealed = npcs.every(npc => npc.isHealed);
      setIsLevelComplete(allHealed);
    }
  }, [npcs]);
  
  // Handle spell selection
  const handleSpellSelect = (spellNumber: 1 | 2 | 3 | 4 | 5) => {
    setSelectedSpell(spellNumber);
  };
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Spell selector */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900/80 rounded-lg p-2 flex space-x-2">
        {[1, 2, 3, 4, 5].map((spellNumber) => (
          <div 
            key={spellNumber}
            className={`w-16 h-16 flex flex-col items-center justify-center rounded-md cursor-pointer pointer-events-auto ${
              selectedSpell === spellNumber ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => handleSpellSelect(spellNumber as 1 | 2 | 3 | 4 | 5)}
          >
            <div 
              className="w-10 h-10 rounded-full"
              style={{ backgroundColor: SPELL_TYPES[spellNumber as 1 | 2 | 3 | 4 | 5].color }}
            ></div>
            <div className="text-white text-xs mt-1">{spellNumber}</div>
          </div>
        ))}
      </div>
      
      {/* Level info */}
      <div className="absolute top-4 left-4 bg-gray-900/80 rounded-lg p-3">
        <div className="text-white font-semibold">Level: {level}</div>
        <div className="text-white">NPCs Healed: {npcs.filter(npc => npc.isHealed).length}/{npcs.length}</div>
        <div className="text-white">Score: {score}</div>
      </div>
      
      {/* Controls help */}
      <div className="absolute top-4 right-4 bg-gray-900/80 rounded-lg p-3">
        <div className="text-white font-semibold">Controls:</div>
        <div className="text-white text-sm">WASD / Arrows: Move</div>
        <div className="text-white text-sm">1-5: Select Spell</div>
        <div className="text-white text-sm">Space: Cast Spell</div>
        <div className="text-white text-sm">P: Pause</div>
        <button 
          className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded pointer-events-auto"
          onClick={toggleMute}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>
      
      {/* Level complete overlay */}
      {isLevelComplete && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4">Level {level} Complete!</h2>
            <p className="text-gray-300 mb-6">
              You've successfully healed all the NPCs! Your healing magic has brought happiness back to this area.
            </p>
            <p className="text-xl text-white mb-6">Score: {score}</p>
            <button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg pointer-events-auto"
              onClick={restart}
            >
              Return to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
