import { useState } from 'react';
import { GitBranch, ExternalLink, Plus, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRepositories, Repository } from '@/hooks/useDatabase';
import { TAMV_LAYERS, REPO_STATUS, LayerId } from '@/lib/constants';
import { User } from '@supabase/supabase-js';

interface RepositoriesViewProps {
  user?: User | null;
  onLogout?: () => void;
}

export function RepositoriesView({ user, onLogout }: RepositoriesViewProps) {
  const [search, setSearch] = useState('');
  const [filterLayer, setFilterLayer] = useState<LayerId | 'all'>('all');
  const { data: repositories, isLoading } = useRepositories();

  const filteredRepos = (repositories || []).filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(search.toLowerCase()) ||
                          (repo.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesLayer = filterLayer === 'all' || repo.layer === filterLayer;
    return matchesSearch && matchesLayer;
  });

  const getLayerInfo = (layerId: LayerId) => {
    return TAMV_LAYERS.find(l => l.id === layerId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Repositorios" 
        subtitle="Gestión de código del ecosistema TAMV"
        user={user}
        onLogout={onLogout}
      />

      <main className="p-4 lg:p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full sm:w-auto flex-col sm:flex-row">
            <Input 
              placeholder="Buscar repositorios..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:max-w-xs command-input"
            />
            <select 
              value={filterLayer}
              onChange={(e) => setFilterLayer(e.target.value as LayerId | 'all')}
              className="px-3 py-2 rounded-lg bg-muted border border-border text-sm command-input"
            >
              <option value="all">Todas las capas</option>
              {TAMV_LAYERS.map(layer => (
                <option key={layer.id} value={layer.id}>{layer.name}</option>
              ))}
            </select>
          </div>
          <Button className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Repositorio</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
        </div>

        {/* Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => {
            const layer = getLayerInfo(repo.layer);
            const status = REPO_STATUS[repo.status];

            return (
              <div 
                key={repo.id}
                className="glass-panel p-4 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                      <GitBranch className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {repo.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span 
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{ 
                            backgroundColor: `hsl(var(--${layer?.color}) / 0.15)`,
                            color: `hsl(var(--${layer?.color}))`
                          }}
                        >
                          {layer?.name}
                        </span>
                        <span 
                          className="pulse-dot"
                          style={{ backgroundColor: `hsl(var(--${status.color}))` }}
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a 
                    href={repo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {repo.description}
                </p>

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
            );
          })}
        </div>

        {filteredRepos.length === 0 && (
          <div className="text-center py-12">
            <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron repositorios</p>
          </div>
        )}
      </main>
    </div>
  );
}
