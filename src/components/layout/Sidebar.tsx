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
  Hexagon,
  Menu,
  Network
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TAMV_LAYERS, LayerId } from '@/lib/constants';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

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
  layerProgress?: Record<LayerId, number>;
}

function SidebarContent({ 
  activeView, 
  onViewChange, 
  activeLayer, 
  onLayerChange, 
  layerProgress,
  collapsed,
  setCollapsed,
  onClose 
}: SidebarProps & { 
  collapsed: boolean; 
  setCollapsed: (v: boolean) => void;
  onClose?: () => void;
}) {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'federated', label: 'Sistema Federado', icon: Network, highlight: true },
    { id: 'repositories', label: 'Repositorios', icon: GitBranch },
    { id: 'tasks', label: 'Tareas', icon: ListTodo },
    { id: 'deployments', label: 'Despliegues', icon: Rocket },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    onViewChange(id);
    onLayerChange(null);
    onClose?.();
  };

  const handleLayerClick = (layerId: LayerId) => {
    onLayerChange(layerId);
    onViewChange('layer');
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full">
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
          className="p-1 rounded hover:bg-muted transition-colors hidden lg:block"
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
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "sidebar-item w-full",
                activeView === item.id && !activeLayer && "active",
                'highlight' in item && item.highlight && activeView !== item.id && "border border-primary/30 bg-primary/5"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 flex-shrink-0",
                'highlight' in item && item.highlight && "text-primary"
              )} />
              {!collapsed && (
                <span className={cn(
                  "text-sm",
                  'highlight' in item && item.highlight && "text-primary font-medium"
                )}>
                  {item.label}
                </span>
              )}
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
            const progress = layerProgress?.[layer.id] || 0;
            
            return (
              <button
                key={layer.id}
                onClick={() => handleLayerClick(layer.id)}
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
              v1.0.0 • OsoPanda1
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-background/80 backdrop-blur-sm border border-border"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border">
          <SidebarContent 
            {...props} 
            collapsed={false} 
            setCollapsed={() => {}} 
            onClose={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border flex-col transition-all duration-300 z-40 hidden lg:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent 
          {...props} 
          collapsed={collapsed} 
          setCollapsed={setCollapsed}
        />
      </aside>
    </>
  );
}
