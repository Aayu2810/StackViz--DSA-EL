import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, Trail, Sparkles, useCursor, PerspectiveCamera } from '@react-three/drei';
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

// Enhanced Stack Block with better animations
const StackBlock: React.FC<{ 
  position: [number, number, number]; 
  size: [number, number, number];
  baseColor: string;
  title: string;
  status: 'pending' | 'processing' | 'completed';
  depth: number;
  currentDepth: number;
  index: number;
}> = ({ position, size, baseColor, title, status, depth, currentDepth, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isDark = document.documentElement.classList.contains('dark');
  
  useCursor(hovered);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      // Enhanced animations based on status
      if (status === 'processing') {
        // Active processing animation
        meshRef.current.position.y = position[1] + Math.sin(time * 4 + index) * 0.15;
        meshRef.current.rotation.x = Math.sin(time * 2) * 0.1;
        meshRef.current.rotation.y = Math.cos(time * 3) * 0.1;
      } else if (status === 'completed') {
        // Completed animation - gentle rotation
        meshRef.current.rotation.y = time * 0.3 + index * 0.1;
      } else if (hovered) {
        // Hover animation
        meshRef.current.rotation.y = Math.sin(time * 2) * 0.05;
        meshRef.current.scale.setScalar(1.05);
      } else {
        // Reset scale when not hovered
        meshRef.current.scale.setScalar(1);
      }
    }
    
    // Glow effect animation
    if (glowRef.current && status === 'processing') {
      const time = state.clock.elapsedTime;
      glowRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
      const material = glowRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        material.opacity = 0.3 + Math.sin(time * 2) * 0.2;
      }
    }
  });

  // Enhanced color system
  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return isDark ? '#FCD34D' : '#F59E0B'; // Amber/yellow
      case 'completed':
        return isDark ? '#00FF88' : '#10B981'; // Neon green/emerald
      default:
        return isDark ? '#0D4D3D' : baseColor; // Dark green/default
    }
  };

  const getGlowColor = () => {
    switch (status) {
      case 'processing':
        return isDark ? '#FCD34D' : '#F59E0B';
      case 'completed':
        return isDark ? '#00FF88' : '#10B981';
      default:
        return 'transparent';
    }
  };

  const getOpacity = () => {
    if (status === 'processing') return 1.0;
    if (status === 'completed') return 0.8;
    if (depth > currentDepth) return 0.2; // Future tasks very dim
    if (depth === currentDepth) return 0.9; // Current depth prominent
    return 0.5; // Past tasks medium
  };

  return (
    <group position={position}>
      {/* Enhanced glow effect */}
      {status === 'processing' && (
        <mesh ref={glowRef} position={[0, 0, 0]}>
          <boxGeometry args={[size[0] + 0.2, size[1] + 0.2, size[2] + 0.2]} />
          <meshStandardMaterial 
            color={getGlowColor()} 
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Main stack block with trail */}
      <Trail
        width={size[0]}
        length={8}
        color={getStatusColor()}
        attenuation={(width) => width}
      >
        <Float 
          speed={status === 'processing' ? 3 : 1.5} 
          rotationIntensity={status === 'processing' ? 0.1 : 0.02} 
          floatIntensity={status === 'processing' ? 0.2 : 0.1} 
          enabled={status !== 'completed'}
        >
          <mesh 
            ref={meshRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <boxGeometry args={size} />
            <meshStandardMaterial 
              color={getStatusColor()} 
              roughness={0.3}
              metalness={0.2}
              transparent
              opacity={getOpacity()}
            />
          </mesh>
        </Float>
      </Trail>
      
      {/* Enhanced text with better visibility */}
      <Text
        position={[0, 0, size[2] / 2 + 0.05]}
        fontSize={0.08}
        maxWidth={size[0] * 0.8}
        textAlign="center"
        color={isDark ? '#FFFFFF' : '#000000'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={isDark ? '#000000' : '#FFFFFF'}
      >
        {title.length > 20 ? title.substring(0, 20) + '...' : title}
      </Text>
      
      {/* Sparkles for processing tasks */}
      {status === 'processing' && (
        <Sparkles
          position={[0, 0, 0]}
          count={10}
          scale={size[0] * 1.5}
          size={2}
          speed={1}
          opacity={0.8}
        />
      )}
    </group>
  );
};

// Enhanced connection lines
const ConnectionLine: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  isActive: boolean;
}> = ({ start, end, isActive }) => {
  const lineRef = useRef<THREE.Line>(null);
  const isDark = document.documentElement.classList.contains('dark');

  useFrame((state) => {
    if (lineRef.current && isActive) {
      const time = state.clock.elapsedTime;
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      if (material) {
        material.opacity = 0.3 + Math.sin(time * 2) * 0.3;
      }
    }
  });

  const points = useMemo(() => {
    const pts = [];
    pts.push(new THREE.Vector3(...start));
    pts.push(new THREE.Vector3(...end));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [start, end]);

  return (
    <line ref={lineRef} geometry={points}>
      <lineBasicMaterial 
        color={isDark ? '#00FF88' : '#10B981'} 
        opacity={isActive ? 0.6 : 0.3}
        transparent
      />
    </line>
  );
};

// Enhanced particle system
const ParticleField: React.FC<{ isProcessing: boolean; isDark: boolean }> = ({ isProcessing, isDark }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(50 * 3);
    const colors = new Float32Array(50 * 3);
    
    for (let i = 0; i < 50 * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 6;
      positions[i + 2] = (Math.random() - 0.5) * 4;
      
      // Color based on theme
      const color = new THREE.Color(isDark ? '#00FF88' : '#10B981');
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    return { positions, colors };
  }, [isDark]);

  useFrame((state) => {
    if (particlesRef.current && isProcessing) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={50}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={50}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={isProcessing ? 0.8 : 0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Enhanced camera controller
const CameraController: React.FC<{ isProcessing: boolean }> = ({ isProcessing }) => {
  const { camera } = useThree();
  
  useFrame((state) => {
    if (isProcessing) {
      // Subtle camera movement during processing
      camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
      camera.position.y = 1 + Math.sin(state.clock.elapsedTime * 0.15) * 0.2;
      camera.lookAt(0, 0, 0);
    }
  });
  
  return null;
};

// Main enhanced scene
const EnhancedNestedStackScene: React.FC<NestedStackVisualizerProps> = ({ 
  tasks, 
  currentDepth, 
  isProcessing 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const isDark = document.documentElement.classList.contains('dark');

  useFrame((state) => {
    if (groupRef.current && !isProcessing) {
      // Gentle rotation when not processing
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  // Enhanced color scheme
  const depthColors = isDark 
    ? ['#0D4D3D', '#00FF88', '#00D9FF', '#FF00FF'] // More varied dark theme colors
    : ['#0A5F38', '#10B981', '#6EE7B7', '#A78BFA']; // Enhanced light theme colors

  const renderTask = (task: NestedTask, xOffset: number = 0, yOffset: number = 0, index: number = 0): JSX.Element[] => {
    const blocks: JSX.Element[] = [];
    const baseSize: [number, number, number] = [1.8 - task.depth * 0.3, 0.5, 1.0 - task.depth * 0.15];
    
    blocks.push(
      <StackBlock
        key={task.id}
        position={[xOffset, yOffset, task.depth * 0.6]}
        size={baseSize}
        baseColor={depthColors[Math.min(task.depth, 3)]}
        title={task.title}
        status={task.status}
        depth={task.depth}
        currentDepth={currentDepth}
        index={index}
      />
    );

    // Enhanced children rendering with better spacing
    task.children.forEach((child, childIndex) => {
      const childX = xOffset + (childIndex - (task.children.length - 1) / 2) * 1.2;
      const childY = yOffset + 0.8;
      blocks.push(...renderTask(child, childX, childY, childIndex));
      
      // Enhanced connection lines
      blocks.push(
        <ConnectionLine
          key={`line-${task.id}-${child.id}`}
          start={[xOffset, yOffset + 0.3, task.depth * 0.6]}
          end={[childX, childY - 0.3, child.depth * 0.6]}
          isActive={task.status === 'processing' || child.status === 'processing'}
        />
      );
    });

    return blocks;
  };

  return (
    <group ref={groupRef}>
      {/* Enhanced base platform */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 128]} />
        <meshStandardMaterial 
          color={isDark ? '#0A0E1A' : '#1a1a1a'} 
          metalness={0.4} 
          roughness={0.6} 
        />
      </mesh>

      {/* Enhanced grid */}
      <gridHelper 
        args={[8, 16, isDark ? '#00FF88' : '#10B981', isDark ? '#0D4D3D' : '#2a2a2a']} 
        position={[0, -1.9, 0]} 
      />

      {/* Render enhanced nested stacks */}
      {tasks.map((task, index) => renderTask(task, 0, -1, index))}

      {/* Enhanced particle field */}
      <ParticleField isProcessing={isProcessing} isDark={isDark} />
      
      {/* Camera controller */}
      <CameraController isProcessing={isProcessing} />
    </group>
  );
};

// Main component with enhanced features
const NestedStackVisualizer: React.FC<NestedStackVisualizerProps> = (props) => {
  const isDark = document.documentElement.classList.contains('dark');
  
  return (
    <div className={`w-full h-full min-h-[400px] stack-canvas bg-card rounded-xl transition-all duration-300 ${
      isDark ? 'accent-glow-strong' : 'shadow-lg'
    }`}>
      <Canvas
        camera={{ position: [0, 1, 6], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        shadows
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={isDark ? 0.4 : 0.5} />
        <pointLight 
          position={[10, 10, 10]} 
          intensity={isDark ? 1.0 : 0.8} 
          color={isDark ? '#00FF88' : '#ffffff'} 
          castShadow
        />
        <pointLight 
          position={[-10, -5, -10]} 
          intensity={isDark ? 0.6 : 0.4} 
          color={isDark ? '#00D9FF' : '#10B981'} 
        />
        <pointLight 
          position={[0, 8, 0]} 
          intensity={isDark ? 0.7 : 0.5} 
          color={isDark ? '#00FF88' : '#ffffff'} 
        />
        
        {/* Enhanced fog for depth */}
        <fog attach="fog" args={[isDark ? '#0A0E1A' : '#f5f5f5', 5, 20]} />
        
        {/* Main scene */}
        <EnhancedNestedStackScene {...props} />
      </Canvas>
    </div>
  );
};

export default NestedStackVisualizer;
