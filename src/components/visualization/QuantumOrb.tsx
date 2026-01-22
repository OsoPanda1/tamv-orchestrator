import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface QuantumOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  intensity?: number;
  className?: string;
  interactive?: boolean;
}

export function QuantumOrb({ 
  size = 'md', 
  intensity = 1, 
  className,
  interactive = true 
}: QuantumOrbProps) {
  const orbRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96',
  };

  useEffect(() => {
    if (!interactive || !orbRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = orbRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    };

    orbRef.current.addEventListener('mousemove', handleMouseMove);
    return () => orbRef.current?.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  const gradientStyle = {
    background: `
      radial-gradient(
        ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%,
        hsl(var(--primary) / ${0.8 * intensity}),
        hsl(var(--secondary) / ${0.6 * intensity}),
        hsl(var(--layer-intelligence) / ${0.4 * intensity}),
        transparent 70%
      )
    `,
  };

  return (
    <div
      ref={orbRef}
      className={cn(
        'relative rounded-full cursor-pointer transition-transform duration-300',
        sizeMap[size],
        isHovered && 'scale-110',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Core orb */}
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={gradientStyle}
      />
      
      {/* Inner glow */}
      <div 
        className="absolute inset-4 rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(var(--primary) / 0.9), transparent 60%)`,
          filter: `blur(${8 * intensity}px)`,
        }}
      />
      
      {/* Quantum particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary"
          style={{
            top: `${50 + 35 * Math.sin((Date.now() / 1000 + i) * 0.5)}%`,
            left: `${50 + 35 * Math.cos((Date.now() / 1000 + i) * 0.7)}%`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.6 + 0.4 * Math.sin(Date.now() / 500 + i),
            animation: `quantum-float ${2 + i * 0.3}s ease-in-out infinite`,
          }}
        />
      ))}
      
      {/* Outer rings */}
      <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin-slow" />
      <div 
        className="absolute -inset-2 rounded-full border border-secondary/10" 
        style={{ animation: 'spin 20s linear infinite reverse' }}
      />
      <div 
        className="absolute -inset-4 rounded-full border border-primary/5" 
        style={{ animation: 'spin 30s linear infinite' }}
      />
    </div>
  );
}
