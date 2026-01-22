import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { deploymentSchema, type DeploymentFormData } from '@/lib/schemas';
import { useCreateDeployment, useUpdateDeployment } from '@/hooks/useMutations';
import { useRepositories } from '@/hooks/useDatabase';
import { Loader2 } from 'lucide-react';

interface DeploymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: {
    id: string;
    repository_id?: string | null;
    environment: string;
    version: string;
    notes?: string | null;
    status: string;
  } | null;
}

export function DeploymentModal({ open, onOpenChange, editData }: DeploymentModalProps) {
  const isEdit = !!editData;
  const createMutation = useCreateDeployment();
  const updateMutation = useUpdateDeployment();
  const { data: repositories } = useRepositories();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DeploymentFormData>({
    resolver: zodResolver(deploymentSchema),
    defaultValues: editData ? {
      repository_id: editData.repository_id || '',
      environment: editData.environment as DeploymentFormData['environment'],
      version: editData.version,
      notes: editData.notes || '',
      status: editData.status as DeploymentFormData['status'],
    } : {
      repository_id: '',
      environment: 'staging',
      version: 'v1.0.0',
      notes: '',
      status: 'pending',
    },
  });

  const repositoryId = watch('repository_id');
  const environment = watch('environment');
  const status = watch('status');

  const onSubmit = async (data: DeploymentFormData) => {
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
          <DialogTitle>{isEdit ? 'Editar Despliegue' : 'Nuevo Despliegue'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Repositorio *</Label>
            <Select value={repositoryId} onValueChange={(v) => setValue('repository_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar repositorio" />
              </SelectTrigger>
              <SelectContent>
                {repositories?.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.repository_id && (
              <p className="text-xs text-destructive">{errors.repository_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">Versión *</Label>
              <Input
                id="version"
                {...register('version')}
                placeholder="v1.0.0"
              />
              {errors.version && (
                <p className="text-xs text-destructive">{errors.version.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Entorno *</Label>
              <Select value={environment} onValueChange={(v) => setValue('environment', v as DeploymentFormData['environment'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar entorno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={status} onValueChange={(v) => setValue('status', v as DeploymentFormData['status'])}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="success">Exitoso</SelectItem>
                <SelectItem value="failed">Fallido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Notas del despliegue..."
              rows={3}
            />
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
