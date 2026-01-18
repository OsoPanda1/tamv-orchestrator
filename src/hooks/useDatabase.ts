import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayerId } from '@/lib/constants';

// Types based on database schema
export interface Repository {
  id: string;
  name: string;
  url: string;
  layer: LayerId;
  stack: string[];
  status: 'active' | 'development' | 'planning' | 'paused';
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  layer: LayerId;
  name: string;
  description: string | null;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  module_id: string | null;
  title: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee: string | null;
  created_at: string;
  updated_at: string;
}

export interface Deployment {
  id: string;
  repository_id: string | null;
  environment: 'staging' | 'production';
  version: string;
  status: 'success' | 'pending' | 'failed';
  notes: string | null;
  created_at: string;
}

export interface ProgressHistory {
  id: string;
  layer: LayerId;
  progress: number;
  recorded_at: string;
}

// Repositories
export function useRepositories() {
  return useQuery({
    queryKey: ['repositories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repositories')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Repository[];
    },
  });
}

// Modules
export function useModules() {
  return useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('layer', { ascending: true });
      if (error) throw error;
      return data as Module[];
    },
  });
}

// Tasks
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('priority', { ascending: true });
      if (error) throw error;
      return data as Task[];
    },
  });
}

// Deployments
export function useDeployments() {
  return useQuery({
    queryKey: ['deployments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deployments')
        .select('*, repositories(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as (Deployment & { repositories: { name: string } | null })[];
    },
  });
}

// Progress History
export function useProgressHistory() {
  return useQuery({
    queryKey: ['progress_history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress_history')
        .select('*')
        .order('recorded_at', { ascending: true });
      if (error) throw error;
      return data as ProgressHistory[];
    },
  });
}

// Calculate layer progress from modules
export function getLayerProgress(modules: Module[], layer: LayerId): number {
  const layerModules = modules.filter(m => m.layer === layer);
  if (layerModules.length === 0) return 0;
  return Math.round(layerModules.reduce((acc, m) => acc + m.progress, 0) / layerModules.length);
}

// Calculate overall progress
export function getOverallProgress(modules: Module[]): number {
  if (modules.length === 0) return 0;
  return Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length);
}

// Get task distribution
export function getTaskDistribution(tasks: Task[]) {
  const distribution = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(distribution).map(([status, count]) => ({
    status,
    count,
  }));
}

// Get deployment stats
export function getDeploymentStats(deployments: Deployment[]) {
  const stats: Record<string, { success: number; failed: number; pending: number }> = {
    staging: { success: 0, failed: 0, pending: 0 },
    production: { success: 0, failed: 0, pending: 0 },
  };

  deployments.forEach(d => {
    if (stats[d.environment]) {
      stats[d.environment][d.status]++;
    }
  });

  return Object.entries(stats).map(([environment, counts]) => ({
    environment,
    ...counts,
  }));
}
