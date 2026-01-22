import { useEffect, useRef, useState } from 'react';
import { FEDERATED_SERVICES } from '@/lib/quantum-config';
import { cn } from '@/lib/utils';

interface NodeData {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'online' | 'syncing' | 'offline';
  load: number;
  connections: string[];
}

export function FederationNetwork({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Initialize nodes in a circular pattern
    const centerX = 200;
    const centerY = 200;
    const radius = 140;
    
    const initialNodes: NodeData[] = FEDERATED_SERVICES.map((service, i) => {
      const angle = (i / FEDERATED_SERVICES.length) * Math.PI * 2 - Math.PI / 2;
      return {
        id: service.id,
        name: service.name,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        status: Math.random() > 0.1 ? 'online' : 'syncing',
        load: Math.random() * 100,
        connections: FEDERATED_SERVICES
          .filter((_, j) => j !== i && Math.random() > 0.3)
          .map(s => s.id),
      };
    });
    
    setNodes(initialNodes);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext('2d')!;
    let time = 0;

    const draw = () => {
      time += 0.02;
      ctx.clearRect(0, 0, 400, 400);

      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const target = nodes.find(n => n.id === connId);
          if (!target) return;

          const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
          gradient.addColorStop(0, 'rgba(100, 220, 220, 0.3)');
          gradient.addColorStop(0.5, 'rgba(100, 220, 220, 0.6)');
          gradient.addColorStop(1, 'rgba(100, 220, 220, 0.3)');

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Animated particle on connection
          const particlePos = (Math.sin(time * 2) + 1) / 2;
          const px = node.x + (target.x - node.x) * particlePos;
          const py = node.y + (target.y - node.y) * particlePos;
          
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(100, 220, 220, 0.8)';
          ctx.fill();
        });
      });

      // Draw center core
      const coreGradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 40);
      coreGradient.addColorStop(0, 'rgba(100, 220, 220, 0.8)');
      coreGradient.addColorStop(0.5, 'rgba(100, 220, 220, 0.3)');
      coreGradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(200, 200, 40 + Math.sin(time) * 5, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Draw nodes
      nodes.forEach(node => {
        const isSelected = node.id === selectedNode;
        const baseRadius = isSelected ? 18 : 14;
        const pulseRadius = baseRadius + Math.sin(time * 3) * 2;

        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, pulseRadius * 2
        );
        
        const color = node.status === 'online' 
          ? '100, 220, 180' 
          : node.status === 'syncing' 
            ? '220, 180, 100' 
            : '220, 100, 100';
            
        glowGradient.addColorStop(0, `rgba(${color}, 0.8)`);
        glowGradient.addColorStop(0.5, `rgba(${color}, 0.2)`);
        glowGradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius * 2, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.9)`;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Load indicator arc
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius + 4, -Math.PI / 2, -Math.PI / 2 + (node.load / 100) * Math.PI * 2);
        ctx.strokeStyle = `rgba(${color}, 0.6)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [nodes, selectedNode]);

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-full"
        onClick={(e) => {
          const rect = canvasRef.current!.getBoundingClientRect();
          const x = (e.clientX - rect.left) * (400 / rect.width);
          const y = (e.clientY - rect.top) * (400 / rect.height);
          
          const clicked = nodes.find(n => 
            Math.sqrt((n.x - x) ** 2 + (n.y - y) ** 2) < 20
          );
          setSelectedNode(clicked?.id || null);
        }}
      />
      
      {/* Node labels */}
      <div className="absolute inset-0 pointer-events-none">
        {nodes.map(node => (
          <div
            key={node.id}
            className={cn(
              'absolute text-[10px] font-mono transform -translate-x-1/2 whitespace-nowrap',
              node.id === selectedNode ? 'text-primary' : 'text-muted-foreground'
            )}
            style={{
              left: `${(node.x / 400) * 100}%`,
              top: `${((node.y + 25) / 400) * 100}%`,
            }}
          >
            {node.name}
          </div>
        ))}
      </div>
      
      {/* Selected node info */}
      {selectedNode && (
        <div className="absolute bottom-2 left-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border text-xs">
          {(() => {
            const node = nodes.find(n => n.id === selectedNode);
            if (!node) return null;
            return (
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{node.name}</span>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-[10px]',
                    node.status === 'online' && 'bg-status-active/20 text-status-active',
                    node.status === 'syncing' && 'bg-status-pending/20 text-status-pending',
                    node.status === 'offline' && 'bg-destructive/20 text-destructive'
                  )}>
                    {node.status}
                  </span>
                  <span className="text-muted-foreground">
                    Load: {node.load.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
