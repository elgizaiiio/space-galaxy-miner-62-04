
import React, { useState, useEffect, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

interface Star {
  id: number;
  x: number;
  y: number;
  z: number;
  speed: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showFadeOut, setShowFadeOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize stars
    const initStars = () => {
      starsRef.current = [];
      for (let i = 0; i < 500; i++) {
        starsRef.current.push({
          id: i,
          x: (Math.random() - 0.5) * 2000,
          y: (Math.random() - 0.5) * 2000,
          z: Math.random() * 1000,
          speed: 1 + Math.random() * 3
        });
      }
    };
    initStars();

    // Animation loop
    const animate = () => {
      // Clear canvas with black background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      starsRef.current.forEach((star) => {
        // Move star towards camera
        star.z -= star.speed * 2;

        // Reset star if it's too close
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.z = 1000;
          star.speed = 1 + Math.random() * 3;
        }

        // Project 3D position to 2D
        const x = (star.x / star.z) * 300 + centerX;
        const y = (star.y / star.z) * 300 + centerY;

        // Calculate star properties
        const size = (1 - star.z / 1000) * 2;
        const opacity = 1 - star.z / 1000;

        // Skip if star is outside canvas
        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return;

        // Draw white star
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Auto complete after 3 seconds
    const timer = setTimeout(() => {
      handleComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleComplete = () => {
    setShowFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 cursor-pointer ${
        showFadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleComplete}
    >
      {/* Animated Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Skip button */}
      <button
        onClick={handleComplete}
        className="absolute top-8 right-8 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition-all duration-300"
      >
        Skip
      </button>
    </div>
  );
};

export default SplashScreen;
