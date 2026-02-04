import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface NestedTask {
  id: string;
  title: string;
  depth: number;
  children: NestedTask[];
  status: 'pending' | 'processing' | 'completed';
}

interface NestedStackVisualizerProps {
  tasks: NestedTask[];
  currentDepth: number;
  isProcessing: boolean;
}

const StackBlock: React.FC<{ 
  position: [number, number, number]; 
  size: [number, number, number];
  color: string;
  title: string;
  isActive: boolean;
}> = ({ position, size, color, title, isActive }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.1} enabled={!isActive}>
        <mesh ref={meshRef}>
          <boxGeometry args={size} />
          <meshStandardMaterial 
            color={color} 
            roughness={0.4}
            metalness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>
      
      <Text
        position={[0, 0, size[2] / 2 + 0.01]}
        fontSize={0.08}
        maxWidth={size[0] * 0.8}
        textAlign="center"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {title.length > 20 ? title.substring(0, 20) + '...' : title}
      </Text>
    </group>
  );
};

const NestedStackScene: React.FC<NestedStackVisualizerProps> = ({ tasks, currentDepth, isProcessing }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  const depthColors = ['#0A5F38', '#10B981', '#6EE7B7'];

  const renderTask = (task: NestedTask, xOffset: number = 0, yOffset: number = 0): JSX.Element[] => {
    const blocks: JSX.Element[] = [];
    const baseSize: [number, number, number] = [1.5 - task.depth * 0.3, 0.4, 0.8 - task.depth * 0.1];
    
    blocks.push(
      <StackBlock
        key={task.id}
        position={[xOffset, yOffset, task.depth * 0.5]}
        size={baseSize}
        color={depthColors[Math.min(task.depth, 2)]}
        title={task.title}
        isActive={task.depth === currentDepth}
      />
    );

    // Render children
    task.children.forEach((child, index) => {
      const childX = xOffset + (index - (task.children.length - 1) / 2) * 0.8;
      const childY = yOffset + 0.6;
      blocks.push(...renderTask(child, childX, childY));
      
      // Connection line
      blocks.push(
        <line key={`line-${task.id}-${child.id}`}>
          <bufferGeometry>
            <float32BufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                xOffset, yOffset + 0.2, task.depth * 0.5,
                childX, childY - 0.2, child.depth * 0.5,
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#10B981" opacity={0.5} transparent />
        </line>
      );
    });

    return blocks;
  };

  return (
    <group ref={groupRef}>
      {/* Base platform */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 64]} />
        <meshStandardMaterial color="#0f0f0f" metalness={0.2} roughness={0.8} />
      </mesh>

      <gridHelper args={[6, 12, '#1a1a1a', '#151515']} position={[0, -1.45, 0]} />

      {/* Render nested stacks */}
      {tasks.map(task => renderTask(task, 0, -1))}

      {/* Ambient particles */}
      {isProcessing && <Particles count={30} />}
    </group>
  );
};

const Particles: React.FC<{ count: number }> = ({ count }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 3;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#10B981"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
};

const NestedStackVisualizer: React.FC<NestedStackVisualizerProps> = (props) => {
  return (
    <div className="w-full h-full min-h-[400px] stack-canvas bg-card rounded-xl">
      <Canvas
        camera={{ position: [0, 1, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
        <pointLight position={[-10, -5, -10]} intensity={0.3} color="#10B981" />
        <pointLight position={[0, 5, 0]} intensity={0.4} color="#ffffff" />
        
        <NestedStackScene {...props} />
        
        <fog attach="fog" args={['#0a0a0a', 5, 15]} />
      </Canvas>
    </div>
  );
};

export default NestedStackVisualizer;
