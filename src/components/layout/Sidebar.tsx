import { useState } from 'react';
import { 
  Fingerprint, 
  MessageSquare, 
  Database, 
  Brain, 
  Coins, 
  Scale, 
  FileText,
  LayoutDashboard,
  GitBranch,
  ListTodo,
  Rocket,
  Settings,
  ChevronLeft,
  ChevronRight,
  Hexagon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TAMV_LAYERS, LayerId } from '@/lib/constants';
import { getLayerProgress } from '@/lib/mock-data';

const iconMap = {
  Fingerprint,
  MessageSquare,
  Database,
  Brain,
  Coins,
  Scale,
  FileText,
};

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  activeLayer: LayerId | null;
  onLayerChange: (layer: LayerId | null) => void;
}

export function Sidebar({ activeView, onViewChange, activeLayer, onLayerChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'repositories', label: 'Repositorios', icon: GitBranch },
    { id: 'tasks', label: 'Tareas', icon: ListTodo },
    { id: 'deployments', label: 'Despliegues', icon: Rocket },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-border">
            <Hexagon className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="animate-slide-in">
              <h1 className="font-bold text-foreground text-sm">TAMV</h1>
              <p className="text-[10px] text-muted-foreground">Command Center</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="mb-4">
          {!collapsed && (
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-3">
              Principal
            </p>
          )}
          {mainNav.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                onLayerChange(null);
              }}
              className={cn(
                "sidebar-item w-full",
                activeView === item.id && !activeLayer && "active"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Layers */}
        <div className="pt-4 border-t border-sidebar-border">
          {!collapsed && (
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-3">
              Capas TAMV
            </p>
          )}
          {TAMV_LAYERS.map((layer) => {
            const Icon = iconMap[layer.icon as keyof typeof iconMap];
            const progress = getLayerProgress(layer.id);
            
            return (
              <button
                key={layer.id}
                onClick={() => {
                  onLayerChange(layer.id);
                  onViewChange('layer');
                }}
                className={cn(
                  "sidebar-item w-full group",
                  activeLayer === layer.id && "active"
                )}
              >
                <div className={cn("w-4 h-4 flex-shrink-0", `text-${layer.color}`)}>
                  <Icon className="w-4 h-4" />
                </div>
                {!collapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <span className="text-sm">{layer.name}</span>
                      <div className="progress-bar mt-1 h-1">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${progress}%`,
                            background: `hsl(var(--${layer.color}))` 
                          }} 
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{progress}%</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="glass-panel p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="pulse-dot bg-status-active" />
              <span className="text-xs text-muted-foreground">Sistema Activo</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">
              v0.1.0-alpha • OsoPanda1
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
