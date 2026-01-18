import { ArrowLeft, Loader2 } from 'lucide-react';
import { 
  Fingerprint, 
  MessageSquare, 
  Database, 
  Brain, 
  Coins, 
  Scale, 
  FileText 
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { TAMV_LAYERS, LayerId } from '@/lib/constants';
import { useModules, useRepositories, useTasks, getLayerProgress } from '@/hooks/useDatabase';
import { User } from '@supabase/supabase-js';

const iconMap = {
  Fingerprint,
  MessageSquare,
  Database,
  Brain,
  Coins,
  Scale,
  FileText,
};

interface LayerDetailViewProps {
  layerId: LayerId;
  onBack: () => void;
  user?: User | null;
  onLogout?: () => void;
}

export function LayerDetailView({ layerId, onBack, user, onLogout }: LayerDetailViewProps) {
  const { data: allModules, isLoading: modulesLoading } = useModules();
  const { data: allRepositories, isLoading: reposLoading } = useRepositories();
  const { data: allTasks, isLoading: tasksLoading } = useTasks();

  const layer = TAMV_LAYERS.find(l => l.id === layerId)!;
  const Icon = iconMap[layer.icon as keyof typeof iconMap];

  const isLoading = modulesLoading || reposLoading || tasksLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const modules = (allModules || []).filter(m => m.layer === layerId);
  const repositories = (allRepositories || []).filter(r => r.layer === layerId);
  const progress = allModules ? getLayerProgress(allModules, layerId) : 0;

  // Get tasks for this layer's modules
  const moduleIds = modules.map(m => m.id);
  const tasks = (allTasks || []).filter(t => t.module_id && moduleIds.includes(t.module_id));

  return (
    <div className="min-h-screen">
      <Header 
        title={layer.name} 
        subtitle={layer.description}
        user={user}
        onLogout={onLogout}
      />

      <main className="p-4 lg:p-6 space-y-6">
        {/* Back Button */}
        <div>
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>

        {/* Layer Header Card */}
        <div 
          className="glass-panel p-4 lg:p-6 border-l-4"
          style={{ borderLeftColor: `hsl(var(--${layer.color}))` }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="p-3 rounded-xl hidden sm:flex"
              style={{ backgroundColor: `hsl(var(--${layer.color}) / 0.15)` }}
            >
              <Icon 
                className="w-8 h-8" 
                style={{ color: `hsl(var(--${layer.color}))` }}
              />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-foreground">{layer.name}</h2>
              <p className="text-muted-foreground text-sm lg:text-base">{layer.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-6">
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-xl lg:text-2xl font-bold text-foreground">{progress}%</p>
              <p className="text-xs text-muted-foreground">Progreso</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-xl lg:text-2xl font-bold text-foreground">{modules.length}</p>
              <p className="text-xs text-muted-foreground">Módulos</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-xl lg:text-2xl font-bold text-foreground">{repositories.length}</p>
              <p className="text-xs text-muted-foreground">Repositorios</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-xl lg:text-2xl font-bold text-foreground">{tasks.length}</p>
              <p className="text-xs text-muted-foreground">Tareas</p>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Módulos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <div key={module.id} className="glass-panel p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{module.name}</h4>
                  <span 
                    className="text-sm font-mono font-medium"
                    style={{ color: `hsl(var(--${layer.color}))` }}
                  >
                    {module.progress}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${module.progress}%`,
                      background: `hsl(var(--${layer.color}))`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {modules.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No hay módulos en esta capa
            </p>
          )}
        </div>

        {/* Repositories */}
        {repositories.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Repositorios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repositories.map((repo) => (
                <div key={repo.id} className="glass-panel p-4">
                  <h4 className="font-medium text-foreground mb-1">{repo.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{repo.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {repo.stack.map((tech) => (
                      <span 
                        key={tech}
                        className="text-[10px] px-2 py-1 rounded bg-muted text-muted-foreground font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
