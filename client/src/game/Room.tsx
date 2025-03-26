import { useMemo } from "react";
import * as THREE from "three";
import { ROOM_SIZE, OBSTACLE_COUNT, OBSTACLE_SIZES } from "./constants";

const Room = () => {
  // Generate random obstacles
  const obstacles = useMemo(() => {
    const obstacleData = [];
    for (let i = 0; i < OBSTACLE_COUNT; i++) {
      // Generate random position within the room boundaries
      const posX = Math.random() * (ROOM_SIZE - 4) - (ROOM_SIZE / 2 - 2);
      const posZ = Math.random() * (ROOM_SIZE - 4) - (ROOM_SIZE / 2 - 2);
      
      // Skip obstacles too close to the center (player spawn area)
      if (Math.abs(posX) < 3 && Math.abs(posZ) < 3) continue;
      
      // Random size
      const sizeIndex = Math.floor(Math.random() * OBSTACLE_SIZES.length);
      const size = OBSTACLE_SIZES[sizeIndex];
      
      // Random height
      const height = 1 + Math.random() * 1.5;
      
      // Random rotation
      const rotation = Math.random() * Math.PI * 2;
      
      // Random type (0 = table, 1 = bookshelf, 2 = cauldron)
      const type = Math.floor(Math.random() * 3);
      
      obstacleData.push({
        position: [posX, height / 2, posZ] as [number, number, number],
        rotation: [0, rotation, 0] as [number, number, number],
        size: [size[0], height, size[1]] as [number, number, number],
        type
      });
    }
    return obstacleData;
  }, []);
  
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Walls */}
      <group>
        {/* North Wall */}
        <mesh position={[0, 2, -ROOM_SIZE / 2]} receiveShadow>
          <boxGeometry args={[ROOM_SIZE, 4, 0.5]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        
        {/* South Wall */}
        <mesh position={[0, 2, ROOM_SIZE / 2]} receiveShadow>
          <boxGeometry args={[ROOM_SIZE, 4, 0.5]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        
        {/* East Wall */}
        <mesh position={[ROOM_SIZE / 2, 2, 0]} receiveShadow>
          <boxGeometry args={[0.5, 4, ROOM_SIZE]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        
        {/* West Wall */}
        <mesh position={[-ROOM_SIZE / 2, 2, 0]} receiveShadow>
          <boxGeometry args={[0.5, 4, ROOM_SIZE]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
      
      {/* Obstacles */}
      {obstacles.map((obstacle, index) => (
        <group key={index} position={obstacle.position} rotation={new THREE.Euler(...obstacle.rotation)}>
          {obstacle.type === 0 && (
            // Table
            <>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[obstacle.size[0], obstacle.size[1] * 0.1, obstacle.size[2]]} />
                <meshStandardMaterial color="#713f12" />
              </mesh>
              {/* Table legs */}
              {[-1, 1].map((x) => 
                [-1, 1].map((z) => (
                  <mesh 
                    key={`${x}-${z}`} 
                    position={[
                      x * (obstacle.size[0] / 2 - 0.2), 
                      -obstacle.size[1] / 2 + 0.4, 
                      z * (obstacle.size[2] / 2 - 0.2)
                    ]} 
                    castShadow 
                    receiveShadow
                  >
                    <boxGeometry args={[0.2, obstacle.size[1] * 0.8, 0.2]} />
                    <meshStandardMaterial color="#713f12" />
                  </mesh>
                ))
              )}
            </>
          )}
          
          {obstacle.type === 1 && (
            // Bookshelf
            <>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[obstacle.size[0], obstacle.size[1], obstacle.size[2] * 0.3]} />
                <meshStandardMaterial color="#854d0e" />
              </mesh>
              {/* Books */}
              {Array.from({ length: 3 }).map((_, i) => (
                <mesh
                  key={i}
                  position={[
                    (Math.random() - 0.5) * obstacle.size[0] * 0.8,
                    (i - 1) * obstacle.size[1] / 3,
                    -obstacle.size[2] * 0.1
                  ]}
                  castShadow
                  receiveShadow
                >
                  <boxGeometry args={[obstacle.size[0] * 0.2, obstacle.size[1] * 0.1, obstacle.size[2] * 0.1]} />
                  <meshStandardMaterial color={["#f59e0b", "#84cc16", "#3b82f6"][i % 3]} />
                </mesh>
              ))}
            </>
          )}
          
          {obstacle.type === 2 && (
            // Cauldron
            <>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[obstacle.size[0] / 2, obstacle.size[0] / 2 * 1.2, obstacle.size[1], 16]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
              {/* Liquid inside */}
              <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[obstacle.size[0] / 2 * 0.8, obstacle.size[0] / 2 * 0.8, 0.2, 16]} />
                <meshStandardMaterial 
                  color="#10b981" 
                  emissive="#10b981" 
                  emissiveIntensity={0.2} 
                />
              </mesh>
            </>
          )}
        </group>
      ))}
      
      {/* Center magical circle */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.5, 2, 32]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Ambient decorations */}
      <mesh position={[ROOM_SIZE / 2 - 1, 1.5, ROOM_SIZE / 2 - 1]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Light sources */}
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#f8fafc" />
      <pointLight position={[ROOM_SIZE / 3, 2, ROOM_SIZE / 3]} intensity={0.5} color="#a855f7" />
      <pointLight position={[-ROOM_SIZE / 3, 2, -ROOM_SIZE / 3]} intensity={0.5} color="#3b82f6" />
      
      {/* Ambient light */}
      <ambientLight intensity={0.3} />
    </group>
  );
};

export default Room;
