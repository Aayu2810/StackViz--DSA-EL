import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface LayerNodeProps {
  position: [number, number, number];
  color: string;
  size: number;
  label?: string;
  isActive?: boolean;
}

const LayerNode: React.FC<LayerNodeProps> = ({ position, color, size, label, isActive }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isActive) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.3}
          metalness={0.1}
          emissive={isActive ? color : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </mesh>
      {label && (
        <Text
          position={[0.3, 0, 0]}
          fontSize={0.08}
          color="#888888"
          anchorX="left"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

const ConnectionLine: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}> = ({ start, end, color }) => {
  const lineRef = useRef<THREE.Line>(null!);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array([
      start[0], start[1], start[2],
      end[0], end[1], end[2],
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [start, end]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 });
  }, [color]);

  return <primitive object={new THREE.Line(geometry, material)} />;
};

const NeuralNetworkScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [activeLayer, setActiveLayer] = React.useState(0);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
    
    // Animate active layer
    setActiveLayer(Math.floor((state.clock.elapsedTime * 0.5) % 5));
  });

  const layers = [
    { name: 'Input', y: -2, nodes: 4, color: '#6EE7B7' },
    { name: 'Hidden 1', y: -1, nodes: 6, color: '#34D399' },
    { name: 'Hidden 2', y: 0, nodes: 8, color: '#10B981' },
    { name: 'Hidden 3', y: 1, nodes: 6, color: '#059669' },
    { name: 'Output', y: 2, nodes: 3, color: '#047857' },
  ];

  return (
    <group ref={groupRef}>
      {/* Render layers */}
      {layers.map((layer, layerIndex) => {
        const isActive = layerIndex === activeLayer;
        const nodeSpacing = 0.4;
        const startX = -((layer.nodes - 1) * nodeSpacing) / 2;

        return (
          <group key={layer.name}>
            {/* Layer label */}
            <Text
              position={[-2, layer.y, 0]}
              fontSize={0.12}
              color={isActive ? '#10B981' : '#666666'}
              anchorX="right"
            >
              {layer.name}
            </Text>
            
            {/* Nodes */}
            {Array.from({ length: layer.nodes }).map((_, nodeIndex) => (
              <LayerNode
                key={`${layer.name}-${nodeIndex}`}
                position={[startX + nodeIndex * nodeSpacing, layer.y, 0]}
                color={layer.color}
                size={0.08}
                isActive={isActive}
              />
            ))}

            {/* Connections to next layer */}
            {layerIndex < layers.length - 1 && (
              <>
                {Array.from({ length: layer.nodes }).map((_, nodeIndex) => {
                  const nextLayer = layers[layerIndex + 1];
                  const nextStartX = -((nextLayer.nodes - 1) * nodeSpacing) / 2;
                  
                  return Array.from({ length: nextLayer.nodes }).map((_, nextNodeIndex) => (
                    <ConnectionLine
                      key={`${layer.name}-${nodeIndex}-${nextNodeIndex}`}
                      start={[startX + nodeIndex * nodeSpacing, layer.y, 0]}
                      end={[nextStartX + nextNodeIndex * nodeSpacing, nextLayer.y, 0]}
                      color="#10B981"
                    />
                  ));
                })}
              </>
            )}
          </group>
        );
      })}

      {/* Data flow particles */}
      <DataFlowParticles />

      {/* Stack frame indicators */}
      {layers.map((layer, index) => (
        <group key={`frame-${index}`} position={[2.5, layer.y, 0]}>
          <mesh>
            <planeGeometry args={[0.8, 0.3]} />
            <meshBasicMaterial 
              color={index === activeLayer ? '#10B981' : '#1a1a1a'}
              transparent
              opacity={0.8}
            />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.1}
            color={index === activeLayer ? '#ffffff' : '#666666'}
          >
            Stack {index}
          </Text>
        </group>
      ))}
    </group>
  );
};

const DataFlowParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 50;
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 1] = -2.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      vel[i] = 0.02 + Math.random() * 0.02;
    }
    
    return [pos, vel];
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    
    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += velocities[i];
      
      if (posArray[i * 3 + 1] > 2.5) {
        posArray[i * 3 + 1] = -2.5;
        posArray[i * 3] = (Math.random() - 0.5) * 2;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#10B981"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

const NeuralNetworkVisualizer: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[400px] stack-canvas bg-card rounded-xl">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#10B981" />
        
        <NeuralNetworkScene />
        
        <fog attach="fog" args={['#0a0a0a', 6, 15]} />
      </Canvas>
    </div>
  );
};

export default NeuralNetworkVisualizer;
