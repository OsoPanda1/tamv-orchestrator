import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { taskSchema, type TaskFormData } from '@/lib/schemas';
import { useCreateTask, useUpdateTask } from '@/hooks/useMutations';
import { useModules } from '@/hooks/useDatabase';
import { TASK_STATUS, TASK_PRIORITY } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: {
    id: string;
    title: string;
    module_id?: string | null;
    status: string;
    priority: string;
    assignee?: string | null;
  } | null;
}

export function TaskModal({ open, onOpenChange, editData }: TaskModalProps) {
  const isEdit = !!editData;
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const { data: modules } = useModules();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: editData ? {
      title: editData.title,
      module_id: editData.module_id || undefined,
      status: editData.status as TaskFormData['status'],
      priority: editData.priority as TaskFormData['priority'],
      assignee: editData.assignee || undefined,
    } : {
      title: '',
      module_id: undefined,
      status: 'todo',
      priority: 'medium',
      assignee: undefined,
    },
  });

  const moduleId = watch('module_id');
  const status = watch('status');
  const priority = watch('priority');

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (isEdit && editData) {
        await updateMutation.mutateAsync({ id: editData.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      reset();
      onOpenChange(false);
    } catch {
      // Error handled by mutation
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Implementar autenticación OAuth"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Módulo</Label>
            <Select 
              value={moduleId || 'none'} 
              onValueChange={(v) => setValue('module_id', v === 'none' ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sin módulo asignado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin módulo</SelectItem>
                {modules?.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={status} onValueChange={(v) => setValue('status', v as TaskFormData['status'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_STATUS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select value={priority} onValueChange={(v) => setValue('priority', v as TaskFormData['priority'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_PRIORITY).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
