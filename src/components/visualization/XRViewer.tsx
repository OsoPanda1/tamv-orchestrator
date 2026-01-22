import { useState, useEffect, useRef } from 'react';
import { Glasses, Maximize2, RotateCw, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XRViewerProps {
  className?: string;
  mode?: '2d' | '3d' | 'vr' | 'xr' | '4d';
}

export function XRViewer({ className, mode: initialMode = '3d' }: XRViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState(initialMode);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let time = 0;

    const project3D = (x: number, y: number, z: number) => {
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const cosZ = Math.cos(rotation.z);
      const sinZ = Math.sin(rotation.z);

      // Rotation matrices
      let tempY = y * cosX - z * sinX;
      let tempZ = y * sinX + z * cosX;
      y = tempY;
      z = tempZ;

      let tempX = x * cosY + z * sinY;
      tempZ = -x * sinY + z * cosY;
      x = tempX;
      z = tempZ;

      tempX = x * cosZ - y * sinZ;
      tempY = x * sinZ + y * cosZ;
      x = tempX;
      y = tempY;

      // Perspective projection
      const perspective = 400;
      const scale = perspective / (perspective + z);
      
      return {
        x: 150 + x * scale,
        y: 150 + y * scale,
        scale,
        z,
      };
    };

    const draw = () => {
      time += 0.02;
      ctx.clearRect(0, 0, 300, 300);

      // Grid floor
      ctx.strokeStyle = 'rgba(100, 220, 220, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = -5; i <= 5; i++) {
        const p1 = project3D(i * 20, 60, -100);
        const p2 = project3D(i * 20, 60, 100);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project3D(-100, 60, i * 20);
        const p4 = project3D(100, 60, i * 20);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // Central structure - TAMV Logo 3D
      const cubeSize = 40;
      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
      ].map(v => v.map(c => c * cubeSize));

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];

      const projected = vertices.map(v => project3D(v[0], v[1], v[2]));

      // Draw edges
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, `rgba(100, 220, 220, ${0.3 + p1.scale * 0.3})`);
        gradient.addColorStop(1, `rgba(100, 220, 220, ${0.3 + p2.scale * 0.3})`);
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw vertices
      projected.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 220, 220, ${0.5 + p.scale * 0.5})`;
        ctx.fill();
      });

      // Inner orb
      const orbGradient = ctx.createRadialGradient(150, 150, 0, 150, 150, 50);
      orbGradient.addColorStop(0, 'rgba(100, 220, 220, 0.8)');
      orbGradient.addColorStop(0.5, 'rgba(200, 160, 100, 0.3)');
      orbGradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(150, 150, 30 + Math.sin(time) * 5, 0, Math.PI * 2);
      ctx.fillStyle = orbGradient;
      ctx.fill();

      // Floating particles
      for (let i = 0; i < 20; i++) {
        const angle = (time * 0.5 + i * 0.5);
        const radius = 70 + Math.sin(time + i) * 20;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.3;
        const z = Math.sin(angle) * radius;
        
        const p = project3D(x, y, z);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 160, 100, ${0.3 + p.scale * 0.5})`;
        ctx.fill();
      }

      // Auto-rotate
      if (!isDragging) {
        setRotation(prev => ({
          ...prev,
          y: prev.y + 0.005,
        }));
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [rotation, isDragging]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setRotation(prev => ({
      ...prev,
      y: prev.y + e.movementX * 0.01,
      x: prev.x + e.movementY * 0.01,
    }));
  };

  const modes = ['2d', '3d', 'vr', 'xr', '4d'] as const;

  return (
    <div className={cn('glass-panel p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Glasses className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">XR Viewer</h3>
        </div>
        
        <div className="flex items-center gap-1">
          {modes.map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'px-2 py-0.5 text-[10px] uppercase rounded transition-colors',
                mode === m 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative rounded-lg overflow-hidden bg-background/50 border border-border">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="w-full cursor-grab active:cursor-grabbing"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
        />
        
        {/* Mode indicator */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-background/80 rounded text-[10px] font-mono text-primary">
          {mode.toUpperCase()} MODE
        </div>

        {/* Controls */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <button 
            className="p-1.5 bg-background/80 rounded hover:bg-background"
            onClick={() => setRotation({ x: 0, y: 0, z: 0 })}
          >
            <RotateCw className="w-3 h-3 text-muted-foreground" />
          </button>
          <button className="p-1.5 bg-background/80 rounded hover:bg-background">
            <Maximize2 className="w-3 h-3 text-muted-foreground" />
          </button>
          <button className="p-1.5 bg-background/80 rounded hover:bg-background">
            <Layers className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <span className="text-muted-foreground">FPS</span>
          <p className="font-mono text-status-active">60</p>
        </div>
        <div>
          <span className="text-muted-foreground">Render</span>
          <p className="font-mono text-primary">HyperQ</p>
        </div>
        <div>
          <span className="text-muted-foreground">Quantum</span>
          <p className="font-mono text-secondary">Active</p>
        </div>
      </div>
    </div>
  );
}
