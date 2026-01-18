import { useState } from 'react';
import { ListTodo, Plus, CheckCircle2, Circle, Clock, MoreVertical } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { mockTasks, mockModules, Task } from '@/lib/mock-data';
import { TASK_PRIORITY, TASK_STATUS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type TaskStatus = Task['status'];

export function TasksView() {
  const [tasks] = useState(mockTasks);

  const columns: { status: TaskStatus; title: string }[] = [
    { status: 'todo', title: 'Por Hacer' },
    { status: 'in_progress', title: 'En Progreso' },
    { status: 'review', title: 'En Revisión' },
    { status: 'done', title: 'Completado' },
  ];

  const getModuleName = (moduleId: string) => {
    return mockModules.find(m => m.id === moduleId)?.name || 'Desconocido';
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(t => t.status === status);
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'done': return CheckCircle2;
      case 'in_progress': return Clock;
      default: return Circle;
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Tareas" 
        subtitle="Gestión de tareas técnicas del ecosistema" 
      />

      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {tasks.length} tareas totales
            </span>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva Tarea
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.status);
            const statusConfig = TASK_STATUS[column.status];
            const StatusIcon = getStatusIcon(column.status);

            return (
              <div key={column.status} className="flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <StatusIcon 
                      className="w-4 h-4"
                      style={{ color: `hsl(var(--${statusConfig.color}))` }}
                    />
                    <h3 className="font-medium text-foreground">{column.title}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 min-h-[200px] p-2 rounded-lg bg-muted/20 border border-border/50">
                  {columnTasks.map((task) => {
                    const priorityConfig = TASK_PRIORITY[task.priority];

                    return (
                      <div 
                        key={task.id}
                        className="glass-panel p-3 hover:border-primary/30 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span 
                            className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            style={{
                              backgroundColor: `hsl(var(--${priorityConfig.color}) / 0.15)`,
                              color: `hsl(var(--${priorityConfig.color}))`
                            }}
                          >
                            {priorityConfig.label}
                          </span>
                          <button className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                        
                        <p className="text-sm text-foreground mb-2 line-clamp-2">
                          {task.title}
                        </p>
                        
                        <span className="text-[10px] text-muted-foreground">
                          {getModuleName(task.moduleId)}
                        </span>
                      </div>
                    );
                  })}

                  {columnTasks.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
                      Sin tareas
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
