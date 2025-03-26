import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LevelState {
  level: number;
  score: number;
  highScore: number;
  
  // Actions
  startLevel: (levelNumber: number) => void;
  completeLevel: () => void;
  setScore: (score: number) => void;
  resetLevels: () => void;
}

export const useLevel = create<LevelState>()(
  persist(
    (set, get) => ({
      level: 1,
      score: 0,
      highScore: 0,
      
      startLevel: (levelNumber) => set(() => ({
        level: levelNumber,
        score: 0
      })),
      
      completeLevel: () => set((state) => {
        const newLevel = state.level + 1;
        const newHighScore = Math.max(state.highScore, state.score);
        
        return {
          level: newLevel,
          highScore: newHighScore
        };
      }),
      
      setScore: (score) => set((state) => ({
        score,
        highScore: Math.max(state.highScore, score)
      })),
      
      resetLevels: () => set(() => ({
        level: 1,
        score: 0
      }))
    }),
    {
      name: "wizard-game-level-storage"
    }
  )
);
