import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { useGame } from "@/lib/stores/useGame";

const SoundManager = () => {
  const { backgroundMusic, isMuted } = useAudio();
  const { phase } = useGame();
  
  // Handle background music based on game phase
  useEffect(() => {
    if (!backgroundMusic) return;
    
    // If muted, ensure music is paused
    if (isMuted) {
      backgroundMusic.pause();
      return;
    }
    
    // Play music during gameplay
    if (phase === "playing") {
      backgroundMusic.play().catch(err => {
        console.log("Failed to play background music:", err);
      });
      backgroundMusic.loop = true;
    } else {
      // Pause when not playing
      backgroundMusic.pause();
    }
    
    return () => {
      backgroundMusic.pause();
    };
  }, [phase, backgroundMusic, isMuted]);
  
  // Listen for visibility changes to pause/resume music
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && backgroundMusic) {
        backgroundMusic.pause();
      } else if (!document.hidden && backgroundMusic && phase === "playing" && !isMuted) {
        backgroundMusic.play().catch(err => {
          console.log("Failed to resume background music:", err);
        });
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [backgroundMusic, phase, isMuted]);
  
  return null; // This component doesn't render anything
};

export default SoundManager;
