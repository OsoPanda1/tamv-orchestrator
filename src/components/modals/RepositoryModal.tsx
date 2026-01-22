import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { repositorySchema, type RepositoryFormData } from '@/lib/schemas';
import { useCreateRepository, useUpdateRepository } from '@/hooks/useMutations';
import { TAMV_LAYERS, REPO_STATUS } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

interface RepositoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: {
    id: string;
    name: string;
    url: string;
    description?: string | null;
    layer: string;
    status: string;
    stack?: string[];
  } | null;
}

export function RepositoryModal({ open, onOpenChange, editData }: RepositoryModalProps) {
  const isEdit = !!editData;
  const createMutation = useCreateRepository();
  const updateMutation = useUpdateRepository();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RepositoryFormData>({
    resolver: zodResolver(repositorySchema),
    defaultValues: editData ? {
      name: editData.name,
      url: editData.url,
      description: editData.description || '',
      layer: editData.layer as RepositoryFormData['layer'],
      status: editData.status as RepositoryFormData['status'],
      stack: editData.stack || [],
    } : {
      name: '',
      url: '',
      description: '',
      layer: 'identity',
      status: 'planning',
      stack: [],
    },
  });

  const layer = watch('layer');
  const status = watch('status');

  const onSubmit = async (data: RepositoryFormData) => {
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
          <DialogTitle>{isEdit ? 'Editar Repositorio' : 'Nuevo Repositorio'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="tamv-core"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              {...register('url')}
              placeholder="https://github.com/OsoPanda1/tamv-core"
            />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descripción del repositorio..."
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Capa *</Label>
              <Select value={layer} onValueChange={(v) => setValue('layer', v as RepositoryFormData['layer'])}>
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
              <Label>Estado</Label>
              <Select value={status} onValueChange={(v) => setValue('status', v as RepositoryFormData['status'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(REPO_STATUS).map(([key, value]) => (
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
