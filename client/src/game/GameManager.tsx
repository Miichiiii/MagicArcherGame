import { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Player from "./Player";
import NPC from "./NPC";
import Spell from "./Spell";
import Room from "./Room";
import { useKeyboardControls } from "@react-three/drei";
import { Controls, NPC as NPCType, SpellInstance } from "./types";
import { useGame } from "@/lib/stores/useGame";
import { useSpells } from "@/lib/stores/useSpells";
import { useNPC } from "@/lib/stores/useNPC";
import { useLevel } from "@/lib/stores/useLevel";
import { NPC_COUNT, PLAYER_POSITIONS, NPC_SPAWN_RADIUS, NPC_HEALING_THRESHOLD } from "./constants";

const GameManager = () => {
  const [, getControls] = useKeyboardControls<Controls>();
  const { selectedSpell } = useSpells();
  const { spells, addSpell, removeSpell } = useSpells();
  const { npcs, setNPCs, healNPC, markNPCHealed } = useNPC();
  const { level, completeLevel } = useLevel();
  const castCooldown = useRef(0);
  const levelCompleteRef = useRef(false);
  const numPlayersRef = useRef(1); // Set to 2 for two-player mode
  const { phase, end } = useGame();
  
  // Initialize the game
  useEffect(() => {
    // Reset game state
    levelCompleteRef.current = false;
    
    // Generate NPCs
    const initialNPCs: NPCType[] = [];
    for (let i = 0; i < NPC_COUNT; i++) {
      // Calculate a random position within a certain radius from the center
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * NPC_SPAWN_RADIUS;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Assign a random mood from the negative ones
      const moods = ["angry", "sad", "worried"] as const;
      const mood = moods[Math.floor(Math.random() * moods.length)];
      
      initialNPCs.push({
        id: `npc-${i}`,
        position: [x, 0, z],
        mood,
        healingProgress: 0,
        isHealed: false
      });
    }
    
    setNPCs(initialNPCs);
    console.log("Game initialized with", initialNPCs.length, "NPCs");
    
    // Check if game is complete periodically
    const checkGameComplete = () => {
      const allHealed = npcs.every(npc => npc.isHealed);
      if (allHealed && !levelCompleteRef.current && npcs.length > 0) {
        console.log("All NPCs healed! Level complete!");
        levelCompleteRef.current = true;
        completeLevel();
      }
    };
    
    const intervalId = setInterval(checkGameComplete, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [level, setNPCs, completeLevel, npcs]);
  
  // Handle spell casting
  useFrame((_, delta) => {
    if (phase !== "playing") return;
    
    // Update cooldown
    if (castCooldown.current > 0) {
      castCooldown.current -= delta;
    }
    
    // Check for spell casting input
    const controls = getControls();
    if (controls.cast && castCooldown.current <= 0) {
      for (let playerIndex = 0; playerIndex < numPlayersRef.current; playerIndex++) {
        // Get player position from refs (would be better handled via refs to Player components)
        const playerPosition = PLAYER_POSITIONS[playerIndex];
        
        // Create a spell in the direction player is facing (for simplicity, always forward)
        const direction = new THREE.Vector3(0, 0, -1);
        
        // Create a unique ID for the spell
        const spellId = `spell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        addSpell({
          id: spellId,
          type: selectedSpell,
          position: [playerPosition[0], playerPosition[1], playerPosition[2]],
          direction,
          createdAt: Date.now()
        });
        
        // Set cooldown
        castCooldown.current = 0.5; // 500ms cooldown
      }
    }
  });
  
  // Handle spell hit on NPCs
  const handleSpellHit = (spellId: string, npcId: string, healAmount: number) => {
    healNPC(npcId, healAmount);
    
    // Check if NPC is fully healed
    const npc = npcs.find(n => n.id === npcId);
    if (npc && npc.healingProgress >= NPC_HEALING_THRESHOLD && !npc.isHealed) {
      markNPCHealed(npcId);
    }
  };
  
  // Handle spell expiration
  const handleSpellExpired = (spellId: string) => {
    removeSpell(spellId);
  };
  
  // Handle NPC fully healed
  const handleNPCHealed = (npcId: string) => {
    console.log(`NPC ${npcId} fully healed!`);
    markNPCHealed(npcId);
  };
  
  return (
    <>
      <Room />
      
      {/* Players */}
      {Array.from({ length: numPlayersRef.current }).map((_, i) => (
        <Player key={`player-${i}`} playerId={i + 1} position={PLAYER_POSITIONS[i]} />
      ))}
      
      {/* NPCs */}
      {npcs.map(npc => (
        <NPC 
          key={npc.id} 
          npc={npc} 
          onHealed={handleNPCHealed} 
        />
      ))}
      
      {/* Spells */}
      {spells.map(spell => (
        <Spell 
          key={spell.id}
          id={spell.id}
          type={spell.type}
          position={spell.position}
          direction={spell.direction}
          onHitNPC={handleSpellHit}
          onExpired={handleSpellExpired}
          npcs={npcs.map(npc => ({ 
            id: npc.id, 
            position: npc.position,
            isHealed: npc.isHealed
          }))}
        />
      ))}
    </>
  );
};

export default GameManager;
