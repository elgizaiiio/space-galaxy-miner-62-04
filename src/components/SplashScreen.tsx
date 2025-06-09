
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import SpaceLogo3D from './SpaceLogo3D';

const StarField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      // Create stars in a sphere around the camera
      const radius = Math.random() * 50 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random colors with space theme
      const colorIntensity = Math.random() * 0.5 + 0.5;
      colors[i * 3] = colorIntensity; // Red
      colors[i * 3 + 1] = colorIntensity * 0.8; // Green
      colors[i * 3 + 2] = 1; // Blue
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Move stars towards the camera (z-axis)
        positions[i + 2] += 0.5;
        
        // Reset star position when it gets too close
        if (positions[i + 2] > 5) {
          const radius = Math.random() * 50 + 40;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          positions[i] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i + 2] = -radius * Math.cos(phi);
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </Points>
  );
};

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // Show splash for 4 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Fallback UI in case of Canvas errors
  if (hasError) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            $SPACE
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-white/80 text-sm font-medium">Loading Space...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <React.Suspense fallback={
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center">
          <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            $SPACE
          </div>
        </div>
      }>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          onCreated={({ gl }) => {
            // Ensure WebGL context is properly initialized
            gl.setClearColor('#000000');
          }}
          onError={(error) => {
            console.error('Canvas error:', error);
            setHasError(true);
          }}
        >
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#ec4899" />
          <StarField />
          <group position={[0, 0, 0]}>
            <SpaceLogo3D text="$SPACE" size={0.8} />
          </group>
        </Canvas>
      </React.Suspense>
      
      {/* Loading indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-white/80 text-sm font-medium">Loading Space...</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
