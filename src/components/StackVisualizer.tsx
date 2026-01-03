import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, RoundedBox, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Task } from '@/types';

interface StackBlockProps {
  task: Task;
  index: number;
  total: number;
  isActive: boolean;
}

const StackBlock: React.FC<StackBlockProps> = ({ task, index, total, isActive }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Animate the block
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = index * 1.2 - (total * 0.6) + Math.sin(state.clock.elapsedTime + index * 0.5) * 0.05;
      
      // Active block pulses
      if (isActive) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.03;
        meshRef.current.scale.set(scale, scale, scale);
      }
    }
    
    if (glowRef.current && isActive) {
      glowRef.current.scale.set(
        1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.1,
        1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.1,
        1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      );
    }
  });

  // Color gradient based on task status
  const getColor = () => {
    if (isActive) return '#00d4ff'; // Cyan for active
    if (task.status === 'completed') return '#10b981'; // Green for completed
    if (task.status === 'processing') return '#8b5cf6'; // Purple for processing
    return '#6366f1'; // Indigo for pending
  };

  return (
    <group>
      {/* Glow effect for active block */}
      {isActive && (
        <mesh ref={glowRef} position={[0, index * 1.2 - (total * 0.6), 0]}>
          <boxGeometry args={[2.4, 0.9, 1.4]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.15} />
        </mesh>
      )}
      
      {/* Main block */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3} enabled={!isActive}>
        <RoundedBox
          ref={meshRef}
          args={[2.2, 0.8, 1.2]}
          radius={0.1}
          smoothness={4}
          position={[0, index * 1.2 - (total * 0.6), 0]}
        >
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={256}
            transmission={0.8}
            roughness={0.3}
            thickness={0.5}
            ior={1.5}
            chromaticAberration={0.06}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.3}
            temporalDistortion={0.2}
            color={getColor()}
          />
        </RoundedBox>
      </Float>

      {/* Task label */}
      <Text
        position={[0, index * 1.2 - (total * 0.6), 0.65]}
        fontSize={0.12}
        maxWidth={1.8}
        lineHeight={1.2}
        textAlign="center"
        color={isActive ? '#ffffff' : '#a1a1aa'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-medium.woff"
      >
        {task.title.length > 30 ? task.title.substring(0, 30) + '...' : task.title}
      </Text>

      {/* Index label */}
      <Text
        position={[-1.3, index * 1.2 - (total * 0.6), 0]}
        fontSize={0.15}
        color="#6366f1"
        anchorX="center"
        anchorY="middle"
      >
        {(total - index).toString()}
      </Text>
    </group>
  );
};

interface StackVisualizerProps {
  tasks: Task[];
  currentTask: Task | null;
}

const StackScene: React.FC<StackVisualizerProps> = ({ tasks, currentTask }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Rotate the entire stack slowly
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base platform */}
      <mesh position={[0, -tasks.length * 0.6 - 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 64]} />
        <meshStandardMaterial 
          color="#1e1b4b" 
          metalness={0.8} 
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Grid lines on platform */}
      <gridHelper
        args={[4, 8, '#3730a3', '#312e81']}
        position={[0, -tasks.length * 0.6 - 0.55, 0]}
      />

      {/* Stack blocks */}
      {tasks.map((task, index) => (
        <StackBlock
          key={task.id}
          task={task}
          index={index}
          total={tasks.length}
          isActive={currentTask?.id === task.id}
        />
      ))}

      {/* Ambient particles */}
      {tasks.length > 0 && <Particles count={30} />}
    </group>
  );
};

// Floating particles
const Particles: React.FC<{ count: number }> = ({ count }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6;
      positions[i + 1] = (Math.random() - 0.5) * 6;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count * 3; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
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
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const StackVisualizer: React.FC<StackVisualizerProps> = ({ tasks, currentTask }) => {
  return (
    <div className="w-full h-full min-h-[400px] stack-canvas">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#00d4ff" />
        
        {/* Scene */}
        <StackScene tasks={tasks} currentTask={currentTask} />
        
        {/* Environment */}
        <fog attach="fog" args={['#0a0a1a', 5, 15]} />
      </Canvas>
    </div>
  );
};

export default StackVisualizer;
