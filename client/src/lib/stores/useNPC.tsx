import { create } from "zustand";
import { NPC, NPCMood } from "@/game/types";
import { NPC_HEALING_THRESHOLD } from "@/game/constants";

interface NPCState {
  npcs: NPC[];
  
  // Actions
  setNPCs: (npcs: NPC[]) => void;
  healNPC: (npcId: string, amount: number) => void;
  markNPCHealed: (npcId: string) => void;
  updateNPCPosition: (npcId: string, position: [number, number, number]) => void;
  clearNPCs: () => void;
}

const getMoodFromProgress = (progress: number): NPCMood => {
  const percentage = progress / NPC_HEALING_THRESHOLD;
  
  if (percentage >= 1) return "happy";
  if (percentage >= 0.8) return "content";
  if (percentage >= 0.5) return "neutral";
  if (percentage >= 0.3) return "worried";
  if (percentage >= 0.1) return "sad";
  return "angry";
};

export const useNPC = create<NPCState>((set) => ({
  npcs: [],
  
  setNPCs: (npcs) => set(() => ({
    npcs
  })),
  
  healNPC: (npcId, amount) => set((state) => {
    const updatedNPCs = state.npcs.map(npc => {
      if (npc.id === npcId && !npc.isHealed) {
        const newProgress = Math.min(NPC_HEALING_THRESHOLD, npc.healingProgress + amount);
        const newMood = getMoodFromProgress(newProgress);
        
        return {
          ...npc,
          healingProgress: newProgress,
          mood: newMood
        };
      }
      return npc;
    });
    
    return { npcs: updatedNPCs };
  }),
  
  markNPCHealed: (npcId) => set((state) => {
    const updatedNPCs = state.npcs.map(npc => {
      if (npc.id === npcId) {
        return {
          ...npc,
          isHealed: true,
          mood: "happy",
          healingProgress: NPC_HEALING_THRESHOLD
        };
      }
      return npc;
    });
    
    return { npcs: updatedNPCs };
  }),
  
  updateNPCPosition: (npcId, position) => set((state) => {
    const updatedNPCs = state.npcs.map(npc => {
      if (npc.id === npcId) {
        return {
          ...npc,
          position
        };
      }
      return npc;
    });
    
    return { npcs: updatedNPCs };
  }),
  
  clearNPCs: () => set(() => ({
    npcs: []
  }))
}));
