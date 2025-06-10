
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
      for (let i = 0; i < 800; i++) {
        starsRef.current.push({
          id: i,
          x: (Math.random() - 0.5) * 2000,
          y: (Math.random() - 0.5) * 2000,
          z: Math.random() * 1000,
          speed: 0.5 + Math.random() * 2
        });
      }
    };
    initStars();

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      starsRef.current.forEach((star, index) => {
        // Move star towards camera
        star.z -= star.speed * 3;

        // Reset star if it's too close
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.z = 1000;
          star.speed = 0.5 + Math.random() * 2;
        }

        // Project 3D position to 2D
        const x = (star.x / star.z) * 200 + centerX;
        const y = (star.y / star.z) * 200 + centerY;

        // Calculate star properties
        const size = (1 - star.z / 1000) * 3;
        const opacity = 1 - star.z / 1000;

        // Skip if star is outside canvas
        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return;

        // Draw star trail
        const prevZ = star.z + star.speed * 3;
        const prevX = (star.x / prevZ) * 200 + centerX;
        const prevY = (star.y / prevZ) * 200 + centerY;

        // Create gradient for trail effect
        const gradient = ctx.createLinearGradient(prevX, prevY, x, y);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Draw bright star point
        const brightness = Math.random() > 0.8 ? 1 : opacity;
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Add occasional colored stars
        if (Math.random() > 0.95) {
          const colors = ['#ec4899', '#06b6d4', '#8b5cf6', '#f59e0b'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Auto complete after 5 seconds
    const timer = setTimeout(() => {
      handleComplete();
    }, 5000);

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
        style={{ background: 'radial-gradient(ellipse at center, #0c0a1f 0%, #000000 100%)' }}
      />

      {/* Central Logo/Text */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 animate-pulse">
            $SPACE
          </h1>
          <p className="text-xl text-white/80 mt-4 animate-fade-in">
            Mining the Future
          </p>
        </div>

        {/* Pulsing orb effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 animate-pulse blur-xl"></div>
          <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 animate-ping"></div>
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={handleComplete}
        className="absolute top-8 right-8 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
      >
        Skip
      </button>

      {/* Tap to continue hint */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white text-center animate-pulse">
        <p className="text-sm opacity-75">Tap anywhere to continue</p>
        <div className="mt-2 flex justify-center">
          <div className="w-6 h-1 bg-white/40 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Particle overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-80"></div>
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
