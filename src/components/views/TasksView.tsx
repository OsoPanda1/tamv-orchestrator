import { useState } from 'react';
import { ListTodo, Plus, CheckCircle2, Circle, Clock, MoreVertical, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useTasks, useModules, Task } from '@/hooks/useDatabase';
import { TASK_PRIORITY, TASK_STATUS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { User } from '@supabase/supabase-js';

type TaskStatus = Task['status'];

interface TasksViewProps {
  user?: User | null;
  onLogout?: () => void;
}

export function TasksView({ user, onLogout }: TasksViewProps) {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: modules, isLoading: modulesLoading } = useModules();

  const columns: { status: TaskStatus; title: string }[] = [
    { status: 'todo', title: 'Por Hacer' },
    { status: 'in_progress', title: 'En Progreso' },
    { status: 'review', title: 'Revisión' },
    { status: 'done', title: 'Completado' },
  ];

  const getModuleName = (moduleId: string | null) => {
    if (!moduleId) return 'Sin módulo';
    return modules?.find(m => m.id === moduleId)?.name || 'Desconocido';
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return (tasks || []).filter(t => t.status === status);
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'done': return CheckCircle2;
      case 'in_progress': return Clock;
      default: return Circle;
    }
  };

  if (tasksLoading || modulesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Tareas" 
        subtitle="Gestión de tareas técnicas del ecosistema"
        user={user}
        onLogout={onLogout}
      />

      <main className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {tasks?.length || 0} tareas totales
            </span>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Tarea</span>
            <span className="sm:hidden">Nueva</span>
          </Button>
        </div>

        {/* Kanban Board - Horizontal scroll on mobile */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="grid grid-cols-4 gap-4 min-w-[900px] lg:min-w-0">
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
                      <h3 className="font-medium text-foreground text-sm">{column.title}</h3>
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
                            {getModuleName(task.module_id)}
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
        </div>
      </main>
    </div>
  );
}
