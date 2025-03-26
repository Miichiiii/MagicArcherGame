import * as THREE from "three";

export enum Controls {
  forward = "forward",
  backward = "backward",
  leftward = "leftward",
  rightward = "rightward",
  spell1 = "spell1",
  spell2 = "spell2",
  spell3 = "spell3",
  spell4 = "spell4",
  spell5 = "spell5",
  cast = "cast",
  pause = "pause"
}

export type NPCMood = "angry" | "sad" | "worried" | "neutral" | "content" | "happy";

export interface NPC {
  id: string;
  position: [number, number, number];
  mood: NPCMood;
  healingProgress: number;
  isHealed: boolean;
}

export interface SpellInstance {
  id: string;
  type: 1 | 2 | 3 | 4 | 5;
  position: [number, number, number];
  direction: THREE.Vector3;
  createdAt: number;
}

export interface Obstacle {
  position: [number, number, number];
  size: [number, number, number];
  type: "table" | "bookshelf" | "cauldron";
}

export interface Level {
  id: number;
  name: string;
  description: string;
  npcCount: number;
  timeLimit?: number; // Optional time limit in seconds
  requiredHealCount?: number; // Optional number of NPCs to heal
}
