import { Activity, GitBranch, ListTodo, Layers, TrendingUp } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { LayerProgressCard } from '@/components/dashboard/LayerProgressCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { TasksOverview } from '@/components/dashboard/TasksOverview';
import { ArchitectureDiagram } from '@/components/dashboard/ArchitectureDiagram';
import { TAMV_LAYERS, LayerId } from '@/lib/constants';
import { mockRepositories, mockTasks, mockModules, getOverallProgress } from '@/lib/mock-data';

interface DashboardViewProps {
  onLayerClick: (layer: LayerId) => void;
}

export function DashboardView({ onLayerClick }: DashboardViewProps) {
  const activeTasks = mockTasks.filter(t => t.status !== 'done').length;
  const activeRepos = mockRepositories.filter(r => r.status === 'active').length;
  const overallProgress = getOverallProgress();

  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle="Vista general del ecosistema TAMV" 
      />

      <main className="p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Progreso General"
            value={`${overallProgress}%`}
            subtitle="Hacia producción"
            icon={TrendingUp}
            variant="primary"
            trend={{ value: 5, positive: true }}
          />
          <StatsCard 
            title="Repositorios Activos"
            value={activeRepos}
            subtitle={`de ${mockRepositories.length} totales`}
            icon={GitBranch}
          />
          <StatsCard 
            title="Tareas Pendientes"
            value={activeTasks}
            subtitle="En todas las capas"
            icon={ListTodo}
          />
          <StatsCard 
            title="Módulos"
            value={mockModules.length}
            subtitle="En 7 capas"
            icon={Layers}
          />
        </div>

        {/* Layer Progress Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Capas del Ecosistema
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TAMV_LAYERS.map((layer) => (
              <LayerProgressCard 
                key={layer.id} 
                layer={layer} 
                onClick={() => onLayerClick(layer.id)}
              />
            ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
          <div className="lg:col-span-1">
            <TasksOverview />
          </div>
          <div className="lg:col-span-1">
            <ArchitectureDiagram />
          </div>
        </div>
      </main>
    </div>
  );
}
