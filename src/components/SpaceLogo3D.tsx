
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

const SpaceText = ({ text = '$SPACE', size = 1 }: { text?: string; size?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const materialProps = useMemo(() => ({
    color: '#ec4899',
    emissive: '#1e3a8a',
    emissiveIntensity: 0.2,
    metalness: 0.8,
    roughness: 0.2,
  }), []);

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <Center>
        <Text3D
          ref={meshRef}
          font="/fonts/helvetiker_bold.typeface.json"
          size={size}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          {text}
          <meshStandardMaterial {...materialProps} />
        </Text3D>
      </Center>
    </Float>
  );
};

const SpaceParticles = () => {
  const points = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.elapsedTime * 0.05;
      points.current.rotation.y = state.clock.elapsedTime * 0.075;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#ec4899"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.6}
      />
    </points>
  );
};

interface SpaceLogo3DProps {
  text?: string;
  size?: number;
}

const SpaceLogo3D: React.FC<SpaceLogo3DProps> = ({ 
  text = '$SPACE', 
  size = 1
}) => {
  return (
    <group>
      <SpaceParticles />
      <SpaceText text={text} size={size} />
    </group>
  );
};

export default SpaceLogo3D;
