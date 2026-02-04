import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleProps {
  count: number;
  color?: string;
  speed?: number;
  direction?: 'up' | 'right' | 'horizontal';
}

const Particles: React.FC<ParticleProps> = ({ 
  count, 
  color = '#10B981',
  speed = 1,
  direction = 'right'
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 4;
      pos[i3 + 1] = (Math.random() - 0.5) * 4;
      pos[i3 + 2] = (Math.random() - 0.5) * 2;
      
      vel[i3] = direction === 'horizontal' || direction === 'right' ? (Math.random() * 0.02 + 0.01) * speed : 0;
      vel[i3 + 1] = direction === 'up' ? (Math.random() * 0.02 + 0.01) * speed : 0;
      vel[i3 + 2] = 0;
    }
    
    return [pos, vel];
  }, [count, speed, direction]);

  useFrame(() => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      
      // Reset particles that go out of bounds
      if (positions[i3] > 2.5) positions[i3] = -2.5;
      if (positions[i3 + 1] > 2.5) positions[i3 + 1] = -2.5;
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
        size={0.03}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
};

interface ParticleFlowProps {
  isActive?: boolean;
  className?: string;
}

const ParticleFlow: React.FC<ParticleFlowProps> = ({ isActive = true, className = '' }) => {
  if (!isActive) return null;
  
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true }}>
        <Particles count={50} color="#10B981" speed={1.2} direction="right" />
        <Particles count={30} color="#34D399" speed={0.8} direction="right" />
      </Canvas>
    </div>
  );
};

export default ParticleFlow;
