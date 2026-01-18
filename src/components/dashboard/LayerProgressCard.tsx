import { 
  Fingerprint, 
  MessageSquare, 
  Database, 
  Brain, 
  Coins, 
  Scale, 
  FileText 
} from 'lucide-react';
import { TAMV_LAYERS, LayerId } from '@/lib/constants';
import { getLayerProgress, mockModules } from '@/lib/mock-data';
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
  layer: typeof TAMV_LAYERS[number];
  onClick?: () => void;
}

export function LayerProgressCard({ layer, onClick }: LayerProgressCardProps) {
  const Icon = iconMap[layer.icon as keyof typeof iconMap];
  const progress = getLayerProgress(layer.id);
  const moduleCount = mockModules.filter(m => m.layer === layer.id).length;

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
          <h3 className="font-semibold text-foreground">{layer.name}</h3>
          <p className="text-xs text-muted-foreground">{moduleCount} módulos</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progreso</span>
          <span 
            className="font-mono font-medium"
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
        <p className="text-[10px] text-muted-foreground line-clamp-1">
          {layer.description}
        </p>
      </div>
    </button>
  );
}
