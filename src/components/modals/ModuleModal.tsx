import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { moduleSchema, type ModuleFormData } from '@/lib/schemas';
import { useCreateModule, useUpdateModule } from '@/hooks/useMutations';
import { TAMV_LAYERS } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

interface ModuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: {
    id: string;
    name: string;
    description?: string | null;
    layer: string;
    progress: number;
  } | null;
}

export function ModuleModal({ open, onOpenChange, editData }: ModuleModalProps) {
  const isEdit = !!editData;
  const createMutation = useCreateModule();
  const updateMutation = useUpdateModule();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: editData ? {
      name: editData.name,
      description: editData.description || '',
      layer: editData.layer as ModuleFormData['layer'],
      progress: editData.progress,
    } : {
      name: '',
      description: '',
      layer: 'identity',
      progress: 0,
    },
  });

  const layer = watch('layer');
  const progress = watch('progress');

  const onSubmit = async (data: ModuleFormData) => {
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
          <DialogTitle>{isEdit ? 'Editar Módulo' : 'Nuevo Módulo'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Isabella Core"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descripción del módulo..."
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Capa *</Label>
            <Select value={layer} onValueChange={(v) => setValue('layer', v as ModuleFormData['layer'])}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar capa" />
              </SelectTrigger>
              <SelectContent>
                {TAMV_LAYERS.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.layer && (
              <p className="text-xs text-destructive">{errors.layer.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Progreso</Label>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Slider
              value={[progress]}
              onValueChange={([v]) => setValue('progress', v)}
              max={100}
              step={5}
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
