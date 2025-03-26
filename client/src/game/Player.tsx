import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "./types";
import { PLAYER_SPEED, PLAYER_COLOR, PLAYER_SIZE } from "./constants";
import { useGame } from "@/lib/stores/useGame";
import { useSpells } from "@/lib/stores/useSpells";

interface PlayerProps {
  playerId: number;
  position: [number, number, number];
}

const Player = ({ playerId, position }: PlayerProps) => {
  const playerRef = useRef<THREE.Mesh>(null);
  const velocity = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const [, getControls] = useKeyboardControls<Controls>();
  const { selectedSpell, setSelectedSpell } = useSpells();
  
  // Set up player
  useEffect(() => {
    console.log(`Player ${playerId} initialized at position`, position);
    
    // Listen for spell selection keys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Digit1") setSelectedSpell(1);
      if (e.code === "Digit2") setSelectedSpell(2);
      if (e.code === "Digit3") setSelectedSpell(3);
      if (e.code === "Digit4") setSelectedSpell(4);
      if (e.code === "Digit5") setSelectedSpell(5);
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.addEventListener("keydown", handleKeyDown);
    };
  }, [playerId, position, setSelectedSpell]);
  
  // Handle player movement
  useFrame((_, delta) => {
    if (!playerRef.current) return;
    
    const state = getControls();
    
    // Reset velocity
    velocity.current.set(0, 0, 0);
    
    // Handle movement
    if (state.forward) velocity.current.z -= PLAYER_SPEED * delta;
    if (state.backward) velocity.current.z += PLAYER_SPEED * delta;
    if (state.leftward) velocity.current.x -= PLAYER_SPEED * delta;
    if (state.rightward) velocity.current.x += PLAYER_SPEED * delta;
    
    // Apply movement
    if (velocity.current.length() > 0) {
      playerRef.current.position.x += velocity.current.x;
      playerRef.current.position.z += velocity.current.z;
      
      // Add boundaries to keep player in the room
      playerRef.current.position.x = Math.max(-15, Math.min(15, playerRef.current.position.x));
      playerRef.current.position.z = Math.max(-15, Math.min(15, playerRef.current.position.z));
      
      // Log movement for debugging
      // console.log(`Player ${playerId} moved to`, playerRef.current.position);
    }
  });
  
  return (
    <mesh 
      ref={playerRef} 
      position={position}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE]} />
      <meshStandardMaterial color={PLAYER_COLOR} />
      
      {/* Wizard hat */}
      <mesh position={[0, PLAYER_SIZE / 1.5, 0]}>
        <coneGeometry args={[PLAYER_SIZE / 2, PLAYER_SIZE, 16]} />
        <meshStandardMaterial color={playerId === 1 ? "#5046e5" : "#7e22ce"} />
      </mesh>
      
      {/* Wand */}
      <mesh position={[PLAYER_SIZE/1.5, 0, -PLAYER_SIZE/2]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.1, 0.1, PLAYER_SIZE * 1.5, 8]} />
        <meshStandardMaterial color="#713f12" />
        
        {/* Wand tip */}
        <mesh position={[0, PLAYER_SIZE * 0.75, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial 
            color={
              selectedSpell === 1 ? "#3b82f6" : 
              selectedSpell === 2 ? "#10b981" : 
              selectedSpell === 3 ? "#f59e0b" : 
              selectedSpell === 4 ? "#ec4899" : 
              "#8b5cf6"
            } 
            emissive={
              selectedSpell === 1 ? "#3b82f6" : 
              selectedSpell === 2 ? "#10b981" : 
              selectedSpell === 3 ? "#f59e0b" : 
              selectedSpell === 4 ? "#ec4899" : 
              "#8b5cf6"
            } 
            emissiveIntensity={0.5}
          />
        </mesh>
      </mesh>
    </mesh>
  );
};

export default Player;
