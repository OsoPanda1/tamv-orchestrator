import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { RepositoryFormData, ModuleFormData, TaskFormData, DeploymentFormData } from '@/lib/schemas';
import type { Database } from '@/integrations/supabase/types';

type RepositoryInsert = Database['public']['Tables']['repositories']['Insert'];
type ModuleInsert = Database['public']['Tables']['modules']['Insert'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type DeploymentInsert = Database['public']['Tables']['deployments']['Insert'];

// Repository mutations
export function useCreateRepository() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: RepositoryFormData) => {
      const insertData: RepositoryInsert = {
        name: data.name,
        url: data.url,
        layer: data.layer,
        description: data.description || null,
        status: data.status,
        stack: data.stack || [],
      };
      
      const { error, data: result } = await supabase
        .from('repositories')
        .insert([insertData])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      toast.success('Repositorio creado exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al crear repositorio: ${error.message}`);
    },
  });
}

export function useUpdateRepository() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RepositoryFormData> }) => {
      const { error, data: result } = await supabase
        .from('repositories')
        .update({
          ...(data.name && { name: data.name }),
          ...(data.url && { url: data.url }),
          ...(data.layer && { layer: data.layer }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.status && { status: data.status }),
          ...(data.stack && { stack: data.stack }),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      toast.success('Repositorio actualizado');
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });
}

export function useDeleteRepository() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('repositories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      toast.success('Repositorio eliminado');
    },
    onError: (error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });
}

// Module mutations
export function useCreateModule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ModuleFormData) => {
      const insertData: ModuleInsert = {
        name: data.name,
        layer: data.layer,
        description: data.description || null,
        progress: data.progress,
      };
      
      const { error, data: result } = await supabase
        .from('modules')
        .insert([insertData])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast.success('Módulo creado exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al crear módulo: ${error.message}`);
    },
  });
}

export function useUpdateModule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ModuleFormData> }) => {
      const { error, data: result } = await supabase
        .from('modules')
        .update({
          ...(data.name && { name: data.name }),
          ...(data.layer && { layer: data.layer }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.progress !== undefined && { progress: data.progress }),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast.success('Módulo actualizado');
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast.success('Módulo eliminado');
    },
    onError: (error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });
}

// Task mutations
export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TaskFormData) => {
      const insertData: TaskInsert = {
        title: data.title,
        module_id: data.module_id || null,
        status: data.status,
        priority: data.priority,
        assignee: data.assignee || null,
      };
      
      const { error, data: result } = await supabase
        .from('tasks')
        .insert([insertData])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarea creada exitosamente');
    },
    onError: (error) => {
      toast.error(`Error al crear tarea: ${error.message}`);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TaskFormData> }) => {
      const { error, data: result } = await supabase
        .from('tasks')
        .update({
          ...(data.title && { title: data.title }),
          ...(data.module_id !== undefined && { module_id: data.module_id }),
          ...(data.status && { status: data.status }),
          ...(data.priority && { priority: data.priority }),
          ...(data.assignee !== undefined && { assignee: data.assignee }),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarea actualizada');
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarea eliminada');
    },
    onError: (error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });
}

// Deployment mutations
export function useCreateDeployment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: DeploymentFormData) => {
      const insertData: DeploymentInsert = {
        repository_id: data.repository_id,
        environment: data.environment,
        version: data.version,
        notes: data.notes || null,
        status: data.status,
      };
      
      const { error, data: result } = await supabase
        .from('deployments')
        .insert([insertData])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
      toast.success('Despliegue registrado');
    },
    onError: (error) => {
      toast.error(`Error al crear despliegue: ${error.message}`);
    },
  });
}

export function useUpdateDeployment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DeploymentFormData> }) => {
      const { error, data: result } = await supabase
        .from('deployments')
        .update({
          ...(data.repository_id && { repository_id: data.repository_id }),
          ...(data.environment && { environment: data.environment }),
          ...(data.version && { version: data.version }),
          ...(data.notes !== undefined && { notes: data.notes }),
          ...(data.status && { status: data.status }),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
      toast.success('Despliegue actualizado');
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });
}
