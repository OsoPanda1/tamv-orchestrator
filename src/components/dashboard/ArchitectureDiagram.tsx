import { Hexagon } from 'lucide-react';

export function ArchitectureDiagram() {
  const layers = [
    { name: 'User', color: 'var(--foreground)' },
    { name: 'Gateway', color: 'hsl(var(--primary))' },
    { name: 'Filter', color: 'hsl(var(--layer-intelligence))' },
    { name: 'Router', color: 'hsl(var(--layer-intelligence))' },
    { name: 'MiniAIs', color: 'hsl(var(--layer-intelligence))' },
    { name: 'Isabella', color: 'hsl(var(--layer-intelligence))' },
    { name: 'BookPI', color: 'hsl(var(--layer-documentation))' },
    { name: 'MSR', color: 'hsl(var(--layer-economy))' },
  ];

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <Hexagon className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground">Pipeline Isabella</h3>
      </div>

      <div className="flex flex-col items-center gap-1">
        {layers.map((layer, index) => (
          <div key={layer.name} className="flex items-center gap-2 w-full">
            <div 
              className="flex-1 py-2 px-3 rounded text-center text-xs font-medium transition-all hover:scale-105"
              style={{ 
                backgroundColor: `${layer.color}15`,
                borderLeft: `3px solid ${layer.color}`,
                color: layer.color
              }}
            >
              {layer.name}
            </div>
            {index < layers.length - 1 && (
              <div className="w-4 flex justify-center">
                <div className="w-0.5 h-4 bg-border" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div className="text-center">
            <span className="text-muted-foreground">Latencia</span>
            <p className="text-primary font-mono">~120ms</p>
          </div>
          <div className="text-center">
            <span className="text-muted-foreground">Uptime</span>
            <p className="text-status-active font-mono">99.9%</p>
          </div>
          <div className="text-center">
            <span className="text-muted-foreground">Requests</span>
            <p className="text-secondary font-mono">1.2k/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
