import { create } from "zustand";
import * as THREE from "three";
import { SpellInstance } from "@/game/types";

interface SpellsState {
  spells: SpellInstance[];
  selectedSpell: 1 | 2 | 3 | 4 | 5;
  
  // Actions
  addSpell: (spell: SpellInstance) => void;
  removeSpell: (spellId: string) => void;
  setSelectedSpell: (spellType: 1 | 2 | 3 | 4 | 5) => void;
  clearSpells: () => void;
}

export const useSpells = create<SpellsState>((set) => ({
  spells: [],
  selectedSpell: 1,
  
  addSpell: (spell) => set((state) => ({
    spells: [...state.spells, spell]
  })),
  
  removeSpell: (spellId) => set((state) => ({
    spells: state.spells.filter(spell => spell.id !== spellId)
  })),
  
  setSelectedSpell: (spellType) => set(() => ({
    selectedSpell: spellType
  })),
  
  clearSpells: () => set(() => ({
    spells: []
  }))
}));
