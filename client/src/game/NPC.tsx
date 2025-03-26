import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { NPC as NPCType, NPCMood } from "./types";
import { NPC_COLORS, NPC_SIZE, NPC_SPEED, NPC_WANDER_DISTANCE, NPC_HEALING_THRESHOLD } from "./constants";
import { useAudio } from "@/lib/stores/useAudio";

interface NPCProps {
  npc: NPCType;
  onHealed: (id: string) => void;
}

const getEmoji = (mood: NPCMood): string => {
  switch (mood) {
    case "angry": return "😠";
    case "sad": return "😢";
    case "worried": return "😟";
    case "neutral": return "😐";
    case "content": return "🙂";
    case "happy": return "😄";
    default: return "😐";
  }
};

const NPC = ({ npc, onHealed }: NPCProps) => {
  const npcRef = useRef<THREE.Mesh>(null);
  const targetPosition = useRef<THREE.Vector3>(new THREE.Vector3(npc.position[0], 0, npc.position[2]));
  const [moodEmoji, setMoodEmoji] = useState(getEmoji(npc.mood));
  const { playSuccess } = useAudio();
  
  // Set up movement pattern
  useEffect(() => {
    const setNewTargetPosition = () => {
      if (!npcRef.current) return;
      
      // Set a new random target position near the NPC's starting position
      const randomX = npc.position[0] + (Math.random() * NPC_WANDER_DISTANCE * 2 - NPC_WANDER_DISTANCE);
      const randomZ = npc.position[2] + (Math.random() * NPC_WANDER_DISTANCE * 2 - NPC_WANDER_DISTANCE);
      
      // Keep the NPC within the room boundaries
      const boundedX = Math.max(-15, Math.min(15, randomX));
      const boundedZ = Math.max(-15, Math.min(15, randomZ));
      
      targetPosition.current.set(boundedX, 0, boundedZ);
    };
    
    // Set initial target position
    setNewTargetPosition();
    
    // Set new target position every few seconds
    const interval = setInterval(setNewTargetPosition, 2000 + Math.random() * 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, [npc.position]);
  
  // Update mood emoji when mood changes
  useEffect(() => {
    setMoodEmoji(getEmoji(npc.mood));
    
    // If NPC is healed, trigger the healed callback
    if (npc.healingProgress >= NPC_HEALING_THRESHOLD && !npc.isHealed) {
      onHealed(npc.id);
      playSuccess();
    }
  }, [npc.mood, npc.healingProgress, npc.isHealed, npc.id, onHealed, playSuccess]);
  
  // Handle NPC movement
  useFrame((_, delta) => {
    if (!npcRef.current) return;
    
    // Only move if not fully healed
    if (!npc.isHealed) {
      // Calculate direction to target
      const direction = new THREE.Vector3().subVectors(targetPosition.current, npcRef.current.position).normalize();
      
      // Move towards target position
      const distanceToTarget = npcRef.current.position.distanceTo(targetPosition.current);
      if (distanceToTarget > 0.1) {
        // Move slower when more healed
        const speedFactor = 1 - (npc.healingProgress / NPC_HEALING_THRESHOLD) * 0.7;
        npcRef.current.position.add(direction.multiplyScalar(NPC_SPEED * delta * speedFactor));
      }
    }
  });
  
  // Get color based on mood
  const npcColor = NPC_COLORS[npc.mood];
  
  return (
    <group>
      <mesh 
        ref={npcRef} 
        position={[npc.position[0], 0, npc.position[2]]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[NPC_SIZE, NPC_SIZE, NPC_SIZE]} />
        <meshStandardMaterial color={npcColor} />
        
        {/* Healing progress indicator */}
        <mesh position={[0, NPC_SIZE / 2 + 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshBasicMaterial color="#444" />
        </mesh>
        
        <mesh position={[0, NPC_SIZE / 2 + 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 32, 1, 0, Math.PI * 2 * (npc.healingProgress / NPC_HEALING_THRESHOLD)]} />
          <meshBasicMaterial color="#4ade80" />
        </mesh>
        
        {/* Mood indicator */}
        <Text
          position={[0, NPC_SIZE + 0.5, 0]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {moodEmoji}
        </Text>
      </mesh>
    </group>
  );
};

export default NPC;
