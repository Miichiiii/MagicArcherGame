import { useEffect } from "react";
import { useGame } from "@/lib/stores/useGame";

// This component handles global game controls like pausing
const GameControls = () => {
  const { phase, restart } = useGame();
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Pause the game
      if (event.code === "KeyP") {
        console.log("Pause key pressed");
        // Toggle pause state
        if (phase === "playing") {
          // Pause game
          console.log("Game paused");
        } else if (phase === "paused") {
          // Resume game
          console.log("Game resumed");
        }
      }
      
      // Restart the game
      if (event.code === "KeyR") {
        console.log("Restart key pressed");
        restart();
      }
      
      // Exit to menu (ESC key)
      if (event.code === "Escape") {
        console.log("Escape key pressed");
        // Return to menu
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase, restart]);
  
  return null; // This component doesn't render anything
};

export default GameControls;
