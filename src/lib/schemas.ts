import { z } from 'zod';

// Repository schemas
export const repositorySchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'El nombre es requerido')
    .max(100, 'Máximo 100 caracteres'),
  url: z.string()
    .trim()
    .url('URL inválida')
    .max(500, 'URL muy larga'),
  description: z.string()
    .trim()
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .nullable(),
  layer: z.enum(['identity', 'communication', 'information', 'intelligence', 'economy', 'governance', 'documentation'], {
    required_error: 'Selecciona una capa',
  }),
  status: z.enum(['active', 'development', 'planning', 'paused']).default('planning'),
  stack: z.array(z.string()).optional().default([]),
});

export type RepositoryFormData = z.infer<typeof repositorySchema>;

// Module schemas
export const moduleSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'El nombre es requerido')
    .max(100, 'Máximo 100 caracteres'),
  description: z.string()
    .trim()
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .nullable(),
  layer: z.enum(['identity', 'communication', 'information', 'intelligence', 'economy', 'governance', 'documentation'], {
    required_error: 'Selecciona una capa',
  }),
  progress: z.number()
    .min(0, 'Mínimo 0')
    .max(100, 'Máximo 100')
    .default(0),
});

export type ModuleFormData = z.infer<typeof moduleSchema>;

// Task schemas
export const taskSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'El título es requerido')
    .max(200, 'Máximo 200 caracteres'),
  module_id: z.string().uuid().optional().nullable(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).default('todo'),
  priority: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  assignee: z.string().uuid().optional().nullable(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

// Deployment schemas
export const deploymentSchema = z.object({
  repository_id: z.string().uuid({ message: 'Selecciona un repositorio' }),
  environment: z.enum(['staging', 'production'], {
    required_error: 'Selecciona un entorno',
  }),
  version: z.string()
    .trim()
    .min(1, 'La versión es requerida')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^v?\d+\.\d+\.\d+/, 'Formato: v1.0.0'),
  notes: z.string()
    .trim()
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .nullable(),
  status: z.enum(['success', 'pending', 'failed']).default('pending'),
});

export type DeploymentFormData = z.infer<typeof deploymentSchema>;

// Config schemas
export const configSchema = z.object({
  key: z.string()
    .trim()
    .min(1, 'La clave es requerida')
    .max(100, 'Máximo 100 caracteres')
    .regex(/^[A-Z_][A-Z0-9_]*$/, 'Usa MAYUSCULAS_CON_GUIONES'),
  value: z.string()
    .trim()
    .min(1, 'El valor es requerido')
    .max(1000, 'Máximo 1000 caracteres'),
  environment: z.string().default('all'),
  is_secret: z.boolean().default(false),
});

export type ConfigFormData = z.infer<typeof configSchema>;
