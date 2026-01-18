export const TAMV_LAYERS = [
  {
    id: 'identity',
    name: 'Identidad',
    description: 'Identidad soberana, DIDs, membresías',
    icon: 'Fingerprint',
    color: 'layer-identity',
  },
  {
    id: 'communication',
    name: 'Comunicación',
    description: 'Bots, Telegram-X, mensajería federada',
    icon: 'MessageSquare',
    color: 'layer-communication',
  },
  {
    id: 'information',
    name: 'Información',
    description: 'Ingesta, RSSHub, buscadores',
    icon: 'Database',
    color: 'layer-information',
  },
  {
    id: 'intelligence',
    name: 'Inteligencia',
    description: 'Isabella AI, BookPI, TAMVAI API, miniAIs',
    icon: 'Brain',
    color: 'layer-intelligence',
  },
  {
    id: 'economy',
    name: 'Economía',
    description: 'Monetización, UTAMV, lotería, MSR blockchain',
    icon: 'Coins',
    color: 'layer-economy',
  },
  {
    id: 'governance',
    name: 'Gobernanza',
    description: 'Protocolos, playbooks, reglas',
    icon: 'Scale',
    color: 'layer-governance',
  },
  {
    id: 'documentation',
    name: 'Documentación',
    description: 'Whitepapers, manifiestos, BookPI',
    icon: 'FileText',
    color: 'layer-documentation',
  },
] as const;

export type LayerId = typeof TAMV_LAYERS[number]['id'];

export const REPO_STATUS = {
  active: { label: 'Activo', color: 'status-active' },
  development: { label: 'Desarrollo', color: 'status-pending' },
  planning: { label: 'Planificación', color: 'muted-foreground' },
  paused: { label: 'Pausado', color: 'status-error' },
} as const;

export const TASK_PRIORITY = {
  critical: { label: 'Crítico', color: 'destructive' },
  high: { label: 'Alto', color: 'secondary' },
  medium: { label: 'Medio', color: 'primary' },
  low: { label: 'Bajo', color: 'muted-foreground' },
} as const;

export const TASK_STATUS = {
  todo: { label: 'Por hacer', color: 'muted-foreground' },
  in_progress: { label: 'En progreso', color: 'primary' },
  review: { label: 'Revisión', color: 'secondary' },
  done: { label: 'Completado', color: 'status-active' },
} as const;
