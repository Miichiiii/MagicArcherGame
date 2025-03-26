import * as THREE from "three";

// Room settings
export const ROOM_SIZE = 30;
export const OBSTACLE_COUNT = 8;
export const OBSTACLE_SIZES = [
  [2, 2],
  [3, 1.5],
  [1.5, 3],
  [2.5, 2.5]
];

// Player settings
export const PLAYER_SPEED = 5;
export const PLAYER_SIZE = 1;
export const PLAYER_COLOR = "#64748b";
export const PLAYER_POSITIONS: [number, number, number][] = [
  [0, 0.5, 0], // Player 1
  [2, 0.5, 0]  // Player 2
];

// NPC settings
export const NPC_COUNT = 10;
export const NPC_SIZE = 0.8;
export const NPC_SPEED = 1.5;
export const NPC_WANDER_DISTANCE = 5;
export const NPC_SPAWN_RADIUS = 10;
export const NPC_HEALING_THRESHOLD = 100;
export const NPC_COLORS = {
  angry: "#ef4444", // Red
  sad: "#3b82f6",   // Blue
  worried: "#f59e0b", // Yellow
  neutral: "#a3a3a3", // Gray
  content: "#84cc16", // Green
  happy: "#10b981"   // Teal
};

// Spell settings
export const SPELL_SIZE = 0.3;
export const SPELL_TYPES = {
  1: {
    name: "Calm Wave",
    color: "#3b82f6", // Blue
    speed: 10,
    radius: 0.5,
    healAmount: 20,
    duration: 3,
    isPiercing: false,
    isArea: false,
    description: "A gentle wave that calms angry emotions"
  },
  2: {
    name: "Healing Burst",
    color: "#10b981", // Green
    speed: 8,
    radius: 2,
    healAmount: 15,
    duration: 0.5,
    isPiercing: false,
    isArea: true,
    description: "Burst of healing energy affecting all nearby NPCs"
  },
  3: {
    name: "Joy Beam",
    color: "#f59e0b", // Orange
    speed: 15,
    radius: 0.3,
    healAmount: 30,
    duration: 2,
    isPiercing: true,
    isArea: false,
    description: "Concentrated beam of joy that pierces through NPCs"
  },
  4: {
    name: "Serenity Pulse",
    color: "#ec4899", // Pink
    speed: 5,
    radius: 1,
    healAmount: 25,
    duration: 4,
    isPiercing: false,
    isArea: false,
    description: "A slow pulse that provides deep healing"
  },
  5: {
    name: "Harmony Shower",
    color: "#8b5cf6", // Purple
    speed: 12,
    radius: 1.5,
    healAmount: 10,
    duration: 1,
    isPiercing: false,
    isArea: true,
    description: "Spreads harmony to multiple NPCs"
  }
};
