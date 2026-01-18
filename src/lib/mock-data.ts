import { LayerId } from './constants';

export interface Repository {
  id: string;
  name: string;
  url: string;
  layer: LayerId;
  stack: string[];
  status: 'active' | 'development' | 'planning' | 'paused';
  description: string;
}

export interface Module {
  id: string;
  layer: LayerId;
  name: string;
  progress: number;
  description: string;
}

export interface Task {
  id: string;
  moduleId: string;
  title: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee?: string;
}

export interface Deployment {
  id: string;
  environment: 'staging' | 'production';
  version: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
  repository: string;
}

export const mockRepositories: Repository[] = [
  {
    id: '1',
    name: 'isabella-core',
    url: 'https://github.com/OsoPanda1/isabella-core',
    layer: 'intelligence',
    stack: ['Python', 'FastAPI', 'LangChain'],
    status: 'active',
    description: 'Núcleo de Isabella AI - Pipeline principal de procesamiento',
  },
  {
    id: '2',
    name: 'bookpi',
    url: 'https://github.com/OsoPanda1/bookpi',
    layer: 'intelligence',
    stack: ['TypeScript', 'Supabase'],
    status: 'development',
    description: 'Registro cognitivo inmutable - Ledger de conocimiento',
  },
  {
    id: '3',
    name: 'tamvai-api',
    url: 'https://github.com/OsoPanda1/tamvai-api',
    layer: 'intelligence',
    stack: ['TypeScript', 'Express', 'OpenAI'],
    status: 'active',
    description: 'API unificada de inteligencia TAMV',
  },
  {
    id: '4',
    name: 'msr-contracts',
    url: 'https://github.com/OsoPanda1/msr-contracts',
    layer: 'economy',
    stack: ['Solidity', 'Hardhat'],
    status: 'development',
    description: 'Contratos inteligentes MSR blockchain',
  },
  {
    id: '5',
    name: 'utamv-token',
    url: 'https://github.com/OsoPanda1/utamv-token',
    layer: 'economy',
    stack: ['Solidity', 'TypeScript'],
    status: 'planning',
    description: 'Token UTAMV - Economía del ecosistema',
  },
  {
    id: '6',
    name: 'telegram-bot',
    url: 'https://github.com/OsoPanda1/telegram-bot',
    layer: 'communication',
    stack: ['Python', 'Telethon'],
    status: 'active',
    description: 'Bot principal de comunicación Telegram',
  },
  {
    id: '7',
    name: 'did-service',
    url: 'https://github.com/OsoPanda1/did-service',
    layer: 'identity',
    stack: ['TypeScript', 'DID'],
    status: 'planning',
    description: 'Servicio de identidad descentralizada',
  },
  {
    id: '8',
    name: 'rsshub-tamv',
    url: 'https://github.com/OsoPanda1/rsshub-tamv',
    layer: 'information',
    stack: ['Node.js', 'RSS'],
    status: 'development',
    description: 'Agregador de información TAMV',
  },
];

export const mockModules: Module[] = [
  { id: '1', layer: 'identity', name: 'DID Core', progress: 25, description: 'Identidad descentralizada' },
  { id: '2', layer: 'identity', name: 'Membresías', progress: 10, description: 'Sistema de membresías' },
  { id: '3', layer: 'communication', name: 'Telegram Bot', progress: 75, description: 'Bot de Telegram' },
  { id: '4', layer: 'communication', name: 'Federation', progress: 15, description: 'Mensajería federada' },
  { id: '5', layer: 'information', name: 'RSSHub', progress: 40, description: 'Agregador RSS' },
  { id: '6', layer: 'information', name: 'Ingestion', progress: 30, description: 'Pipeline de ingesta' },
  { id: '7', layer: 'intelligence', name: 'Isabella Core', progress: 60, description: 'IA principal' },
  { id: '8', layer: 'intelligence', name: 'BookPI', progress: 45, description: 'Registro cognitivo' },
  { id: '9', layer: 'intelligence', name: 'MiniAIs', progress: 35, description: 'IAs especializadas' },
  { id: '10', layer: 'intelligence', name: 'Filter Core', progress: 50, description: 'Filtro emocional' },
  { id: '11', layer: 'economy', name: 'MSR Contracts', progress: 55, description: 'Contratos blockchain' },
  { id: '12', layer: 'economy', name: 'UTAMV', progress: 20, description: 'Token económico' },
  { id: '13', layer: 'economy', name: 'Lotería', progress: 30, description: 'Sistema de lotería' },
  { id: '14', layer: 'governance', name: 'Protocolos', progress: 40, description: 'Reglas del sistema' },
  { id: '15', layer: 'governance', name: 'Playbooks', progress: 35, description: 'Guías operativas' },
  { id: '16', layer: 'documentation', name: 'Whitepapers', progress: 65, description: 'Documentación técnica' },
  { id: '17', layer: 'documentation', name: 'API Docs', progress: 50, description: 'Documentación API' },
];

export const mockTasks: Task[] = [
  { id: '1', moduleId: '7', title: 'Implementar pipeline completo Isabella', status: 'in_progress', priority: 'critical' },
  { id: '2', moduleId: '11', title: 'Auditar contratos MSR', status: 'todo', priority: 'critical' },
  { id: '3', moduleId: '3', title: 'Integrar comandos avanzados bot', status: 'review', priority: 'high' },
  { id: '4', moduleId: '8', title: 'Definir schema BookPI', status: 'in_progress', priority: 'high' },
  { id: '5', moduleId: '12', title: 'Diseñar tokenomics UTAMV', status: 'todo', priority: 'high' },
  { id: '6', moduleId: '5', title: 'Configurar feeds RSS', status: 'done', priority: 'medium' },
  { id: '7', moduleId: '16', title: 'Escribir whitepaper técnico', status: 'in_progress', priority: 'medium' },
  { id: '8', moduleId: '10', title: 'Entrenar modelo emocional', status: 'todo', priority: 'medium' },
];

export const mockDeployments: Deployment[] = [
  { id: '1', environment: 'production', version: 'v1.2.0', status: 'success', timestamp: '2026-01-18T10:30:00Z', repository: 'tamvai-api' },
  { id: '2', environment: 'staging', version: 'v1.3.0-beta', status: 'pending', timestamp: '2026-01-18T14:00:00Z', repository: 'isabella-core' },
  { id: '3', environment: 'production', version: 'v0.8.5', status: 'success', timestamp: '2026-01-17T16:45:00Z', repository: 'telegram-bot' },
  { id: '4', environment: 'staging', version: 'v0.2.0', status: 'failed', timestamp: '2026-01-17T09:15:00Z', repository: 'msr-contracts' },
];

export function getLayerProgress(layer: LayerId): number {
  const layerModules = mockModules.filter(m => m.layer === layer);
  if (layerModules.length === 0) return 0;
  return Math.round(layerModules.reduce((acc, m) => acc + m.progress, 0) / layerModules.length);
}

export function getOverallProgress(): number {
  if (mockModules.length === 0) return 0;
  return Math.round(mockModules.reduce((acc, m) => acc + m.progress, 0) / mockModules.length);
}
