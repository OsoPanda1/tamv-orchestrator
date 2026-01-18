import { 
  Fingerprint, 
  MessageSquare, 
  Database, 
  Brain, 
  Coins, 
  Scale, 
  FileText 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  Fingerprint,
  MessageSquare,
  Database,
  Brain,
  Coins,
  Scale,
  FileText,
};

interface LayerProgressCardProps {
  layer: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  };
  progress: number;
  moduleCount: number;
  onClick?: () => void;
}

export function LayerProgressCard({ layer, progress, moduleCount, onClick }: LayerProgressCardProps) {
  const Icon = iconMap[layer.icon as keyof typeof iconMap];

  return (
    <button
      onClick={onClick}
      className="stat-card text-left w-full hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `hsl(var(--${layer.color}) / 0.15)` }}
        >
          <Icon 
            className="w-5 h-5" 
            style={{ color: `hsl(var(--${layer.color}))` }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm lg:text-base">{layer.name}</h3>
          <p className="text-xs text-muted-foreground">{moduleCount} módulos</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground text-xs lg:text-sm">Progreso</span>
          <span 
            className="font-mono font-medium text-xs lg:text-sm"
            style={{ color: `hsl(var(--${layer.color}))` }}
          >
            {progress}%
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${progress}%`,
              background: `hsl(var(--${layer.color}))`
            }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground line-clamp-1 hidden sm:block">
          {layer.description}
        </p>
      </div>
    </button>
  );
}
