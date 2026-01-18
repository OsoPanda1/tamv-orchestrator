import { CheckCircle2, Circle, Clock, MoreHorizontal } from 'lucide-react';
import { mockTasks, mockModules } from '@/lib/mock-data';
import { TASK_PRIORITY, TASK_STATUS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function TasksOverview() {
  const getModuleName = (moduleId: string) => {
    return mockModules.find(m => m.id === moduleId)?.name || 'Desconocido';
  };

  const priorityTasks = [...mockTasks]
    .filter(t => t.status !== 'done')
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Tareas Prioritarias</h3>
        <button className="p-1 hover:bg-muted rounded transition-colors">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-2">
        {priorityTasks.map((task) => {
          const priorityConfig = TASK_PRIORITY[task.priority];
          const statusConfig = TASK_STATUS[task.status];
          
          return (
            <div 
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
            >
              <button className="mt-0.5">
                {task.status === 'done' ? (
                  <CheckCircle2 className="w-4 h-4 text-status-active" />
                ) : task.status === 'in_progress' ? (
                  <Clock className="w-4 h-4 text-primary animate-pulse" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground line-clamp-1">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    {getModuleName(task.moduleId)}
                  </span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium",
                    `bg-${priorityConfig.color}/10 text-${priorityConfig.color}`
                  )}
                  style={{
                    backgroundColor: `hsl(var(--${priorityConfig.color}) / 0.1)`,
                    color: `hsl(var(--${priorityConfig.color}))`
                  }}
                  >
                    {priorityConfig.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors">
        Ver todas las tareas
      </button>
    </div>
  );
}
