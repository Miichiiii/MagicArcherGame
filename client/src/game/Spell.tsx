import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SPELL_TYPES, SPELL_SIZE } from "./constants";
import { useAudio } from "@/lib/stores/useAudio";

interface SpellProps {
  id: string;
  type: 1 | 2 | 3 | 4 | 5;
  position: [number, number, number];
  direction: THREE.Vector3;
  onHitNPC: (spellId: string, npcId: string, healAmount: number) => void;
  onExpired: (id: string) => void;
  npcs: { id: string; position: [number, number, number]; isHealed: boolean }[];
}

const Spell = ({ id, type, position, direction, onHitNPC, onExpired, npcs }: SpellProps) => {
  const spellRef = useRef<THREE.Mesh>(null);
  const lifeTimeRef = useRef(0);
  const hitNPCs = useRef<Set<string>>(new Set());
  const spellConfig = SPELL_TYPES[type];
  const { playHit } = useAudio();
  
  // Set up the spell
  useEffect(() => {
    console.log(`Spell ${id} of type ${type} created at position`, position);
    
    // Set a timeout to remove the spell after its lifetime
    const timeout = setTimeout(() => {
      onExpired(id);
    }, spellConfig.duration * 1000);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [id, type, position, spellConfig.duration, onExpired]);
  
  // Handle spell movement and collision
  useFrame((_, delta) => {
    if (!spellRef.current) return;
    
    // Update lifetime
    lifeTimeRef.current += delta;
    
    // Move the spell in the direction
    const normalizedDirection = direction.clone().normalize();
    spellRef.current.position.add(normalizedDirection.multiplyScalar(spellConfig.speed * delta));
    
    // Check for collisions with NPCs
    for (const npc of npcs) {
      // Skip healed NPCs
      if (npc.isHealed) continue;
      
      // Skip NPCs we've already hit (for area spells)
      if (hitNPCs.current.has(npc.id) && !spellConfig.isPiercing) continue;
      
      // Check distance to NPC
      const spellPos = new THREE.Vector3(
        spellRef.current.position.x,
        spellRef.current.position.y,
        spellRef.current.position.z
      );
      const npcPos = new THREE.Vector3(npc.position[0], npc.position[1], npc.position[2]);
      const distance = spellPos.distanceTo(npcPos);
      
      // If within range, hit the NPC
      if (distance < spellConfig.radius + SPELL_SIZE) {
        // Mark as hit
        hitNPCs.current.add(npc.id);
        
        // Apply healing effect
        onHitNPC(id, npc.id, spellConfig.healAmount);
        
        // Play hit sound
        playHit();
        
        // If not a piercing spell, expire after first hit
        if (!spellConfig.isPiercing && !spellConfig.isArea) {
          onExpired(id);
          break;
        }
      }
    }
    
    // For area spells, check if they should expire based on lifetime
    if (spellConfig.isArea && lifeTimeRef.current >= spellConfig.duration) {
      onExpired(id);
    }
  });
  
  return (
    <mesh 
      ref={spellRef} 
      position={position}
      castShadow
    >
      {spellConfig.isArea ? (
        <sphereGeometry args={[spellConfig.radius, 16, 16]} />
      ) : (
        <sphereGeometry args={[SPELL_SIZE, 8, 8]} />
      )}
      <meshStandardMaterial 
        color={spellConfig.color} 
        emissive={spellConfig.color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
      
      {/* Particle effects */}
      <pointLight
        color={spellConfig.color}
        intensity={1}
        distance={spellConfig.radius * 2}
        decay={2}
      />
    </mesh>
  );
};

export default Spell;
