import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, RoundedBox } from '@react-three/drei';
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

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = index * 1.2 - (total * 0.6) + Math.sin(state.clock.elapsedTime + index * 0.5) * 0.03;
      
      if (isActive) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
        meshRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  const getColor = () => {
    if (isActive) return '#1a5c3a';
    if (task.status === 'completed') return '#2d7a50';
    if (task.status === 'processing') return '#3d9970';
    return '#4a4a4a';
  };

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2} enabled={!isActive}>
        <RoundedBox
          ref={meshRef}
          args={[2.2, 0.8, 1.2]}
          radius={0.08}
          smoothness={4}
          position={[0, index * 1.2 - (total * 0.6), 0]}
        >
          <meshStandardMaterial
            color={getColor()}
            roughness={0.4}
            metalness={0.1}
          />
        </RoundedBox>
      </Float>

      <Text
        position={[0, index * 1.2 - (total * 0.6), 0.65]}
        fontSize={0.12}
        maxWidth={1.8}
        lineHeight={1.2}
        textAlign="center"
        color={isActive ? '#ffffff' : '#cccccc'}
        anchorX="center"
        anchorY="middle"
      >
        {task.title.length > 30 ? task.title.substring(0, 30) + '...' : task.title}
      </Text>

      <Text
        position={[-1.3, index * 1.2 - (total * 0.6), 0]}
        fontSize={0.15}
        color="#2d7a50"
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

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base platform */}
      <mesh position={[0, -tasks.length * 0.6 - 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 64]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.3} 
          roughness={0.6}
        />
      </mesh>

      {/* Grid */}
      <gridHelper
        args={[4, 8, '#333333', '#2a2a2a']}
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
      {tasks.length > 0 && <Particles count={20} />}
    </group>
  );
};

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
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
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
        size={0.02}
        color="#2d7a50"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

const StackVisualizer: React.FC<StackVisualizerProps> = ({ tasks, currentTask }) => {
  return (
    <div className="w-full h-full min-h-[400px] stack-canvas bg-card rounded-xl">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#2d7a50" />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
        
        <StackScene tasks={tasks} currentTask={currentTask} />
        
        <fog attach="fog" args={['#0a0a0a', 5, 15]} />
      </Canvas>
    </div>
  );
};

export default StackVisualizer;
