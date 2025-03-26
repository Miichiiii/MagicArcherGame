import { useEffect } from "react";
import { useGame } from "@/lib/stores/useGame";
import { useLevel } from "@/lib/stores/useLevel";
import { useNPC } from "@/lib/stores/useNPC";
import { useSpells } from "@/lib/stores/useSpells";
import { useAudio } from "@/lib/stores/useAudio";

// This component handles game logic that doesn't need to render anything
const GameLogic = () => {
  const { phase, end } = useGame();
  const { level, score, setScore } = useLevel();
  const { npcs } = useNPC();
  const { spells } = useSpells();
  const { backgroundMusic } = useAudio();
  
  // Start background music when the game starts
  useEffect(() => {
    if (phase === "playing" && backgroundMusic) {
      backgroundMusic.play().catch(err => {
        console.log("Failed to play background music:", err);
      });
    }
    
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    };
  }, [phase, backgroundMusic]);
  
  // Update score based on healed NPCs
  useEffect(() => {
    if (phase === "playing") {
      const healedCount = npcs.filter(npc => npc.isHealed).length;
      const newScore = healedCount * 100 * level;
      setScore(newScore);
    }
  }, [npcs, level, phase, setScore]);
  
  // Check for level completion
  useEffect(() => {
    if (phase === "playing" && npcs.length > 0) {
      const allHealed = npcs.every(npc => npc.isHealed);
      
      if (allHealed) {
        console.log("All NPCs healed! Level complete!");
        // We won't end the game here, just let the UI show the level complete message
      }
    }
  }, [npcs, phase, end]);
  
  return null;
};

export default GameLogic;
