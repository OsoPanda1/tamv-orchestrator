import { ReactNode, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

export function HolographicCard({ 
  children, 
  className, 
  glowColor = 'primary',
  intensity = 1 
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setTransform({
      rotateY: (x - 0.5) * 20 * intensity,
      rotateX: (0.5 - y) * 20 * intensity,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-xl transition-all duration-300',
        'bg-gradient-to-br from-background/80 to-background/40',
        'backdrop-blur-xl border border-border/50',
        isHovered && 'border-primary/50',
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Holographic overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `
            linear-gradient(
              ${135 + transform.rotateY * 2}deg,
              transparent 0%,
              hsl(var(--${glowColor}) / 0.1) 25%,
              hsl(var(--secondary) / 0.15) 50%,
              hsl(var(--${glowColor}) / 0.1) 75%,
              transparent 100%
            )
          `,
        }}
      />
      
      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )`,
        }}
      />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
      <div className="absolute top-0 right-0 w-8 h-8">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-primary/50 to-transparent" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 w-8 h-8">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-px h-full bg-gradient-to-t from-primary/50 to-transparent" />
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8">
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-primary/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-primary/50 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Glow effect on hover */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            boxShadow: `
              inset 0 0 30px hsl(var(--${glowColor}) / 0.1),
              0 0 40px hsl(var(--${glowColor}) / 0.2)
            `,
          }}
        />
      )}
    </div>
  );
}
