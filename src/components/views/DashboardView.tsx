import { Activity, GitBranch, ListTodo, Layers, TrendingUp, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { LayerProgressCard } from '@/components/dashboard/LayerProgressCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { TasksOverview } from '@/components/dashboard/TasksOverview';
import { ArchitectureDiagram } from '@/components/dashboard/ArchitectureDiagram';
import { ProgressChart, TaskDistributionChart, DeploymentChart } from '@/components/dashboard/Charts';
import { TAMV_LAYERS, LayerId } from '@/lib/constants';
import { 
  useRepositories, 
  useModules, 
  useTasks, 
  useDeployments,
  useProgressHistory,
  getLayerProgress,
  getOverallProgress,
  getTaskDistribution,
  getDeploymentStats
} from '@/hooks/useDatabase';
import { User } from '@supabase/supabase-js';

interface DashboardViewProps {
  onLayerClick: (layer: LayerId) => void;
  user?: User | null;
  onLogout?: () => void;
}

export function DashboardView({ onLayerClick, user, onLogout }: DashboardViewProps) {
  const { data: repositories, isLoading: reposLoading } = useRepositories();
  const { data: modules, isLoading: modulesLoading } = useModules();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: deployments, isLoading: deploymentsLoading } = useDeployments();
  const { data: progressHistory, isLoading: historyLoading } = useProgressHistory();

  const isLoading = reposLoading || modulesLoading || tasksLoading || deploymentsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const activeTasks = tasks?.filter(t => t.status !== 'done').length || 0;
  const activeRepos = repositories?.filter(r => r.status === 'active').length || 0;
  const overallProgress = modules ? getOverallProgress(modules) : 0;
  const taskDistribution = tasks ? getTaskDistribution(tasks) : [];
  const deploymentStats = deployments ? getDeploymentStats(deployments) : [];

  // Calculate layer progress
  const layerProgress: Record<LayerId, number> = {} as Record<LayerId, number>;
  TAMV_LAYERS.forEach(layer => {
    layerProgress[layer.id] = modules ? getLayerProgress(modules, layer.id) : 0;
  });

  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle="Vista general del ecosistema TAMV"
        user={user}
        onLogout={onLogout}
      />

      <main className="p-4 lg:p-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <StatsCard 
            title="Progreso General"
            value={`${overallProgress}%`}
            subtitle="Hacia producción"
            icon={TrendingUp}
            variant="primary"
            trend={{ value: 5, positive: true }}
          />
          <StatsCard 
            title="Repos Activos"
            value={activeRepos}
            subtitle={`de ${repositories?.length || 0} totales`}
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
            value={modules?.length || 0}
            subtitle="En 7 capas"
            icon={Layers}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ProgressChart progressHistory={progressHistory || []} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <TaskDistributionChart taskDistribution={taskDistribution} />
            <DeploymentChart deploymentStats={deploymentStats} />
          </div>
        </div>

        {/* Layer Progress Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Capas del Ecosistema
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
            {TAMV_LAYERS.map((layer) => (
              <LayerProgressCard 
                key={layer.id} 
                layer={layer}
                progress={layerProgress[layer.id]}
                moduleCount={modules?.filter(m => m.layer === layer.id).length || 0}
                onClick={() => onLayerClick(layer.id)}
              />
            ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-1">
            <RecentActivity deployments={deployments || []} />
          </div>
          <div className="lg:col-span-1">
            <TasksOverview tasks={tasks || []} modules={modules || []} />
          </div>
          <div className="lg:col-span-1">
            <ArchitectureDiagram />
          </div>
        </div>
      </main>
    </div>
  );
}
