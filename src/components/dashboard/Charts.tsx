import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { TAMV_LAYERS, LayerId } from '@/lib/constants';

interface ProgressHistoryItem {
  layer: LayerId;
  progress: number;
  recorded_at: string;
}

interface ChartsProps {
  progressHistory: ProgressHistoryItem[];
  taskDistribution: { status: string; count: number }[];
  deploymentStats: { environment: string; success: number; failed: number; pending: number }[];
}

const LAYER_COLORS: Record<LayerId, string> = {
  identity: '#a855f7',
  communication: '#3b82f6',
  information: '#22c55e',
  intelligence: '#00d4ff',
  economy: '#eab308',
  governance: '#ec4899',
  documentation: '#f97316',
};

const STATUS_COLORS = {
  todo: '#6b7280',
  in_progress: '#00d4ff',
  review: '#eab308',
  done: '#22c55e',
};

export function ProgressChart({ progressHistory }: { progressHistory: ProgressHistoryItem[] }) {
  // Transform data for chart
  const chartData = progressHistory.reduce((acc, item) => {
    const date = new Date(item.recorded_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing[item.layer] = item.progress;
    } else {
      acc.push({ date, [item.layer]: item.progress });
    }
    return acc;
  }, [] as any[]);

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground">Progreso Histórico</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            {TAMV_LAYERS.map((layer) => (
              <Area
                key={layer.id}
                type="monotone"
                dataKey={layer.id}
                stackId="1"
                stroke={LAYER_COLORS[layer.id]}
                fill={LAYER_COLORS[layer.id]}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {TAMV_LAYERS.map((layer) => (
          <div key={layer.id} className="flex items-center gap-1.5 text-xs">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: LAYER_COLORS[layer.id] }}
            />
            <span className="text-muted-foreground">{layer.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TaskDistributionChart({ taskDistribution }: { taskDistribution: { status: string; count: number }[] }) {
  const statusLabels: Record<string, string> = {
    todo: 'Por hacer',
    in_progress: 'En progreso',
    review: 'Revisión',
    done: 'Completado',
  };

  const data = taskDistribution.map(item => ({
    name: statusLabels[item.status] || item.status,
    value: item.count,
    color: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || '#6b7280',
  }));

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <PieIcon className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground">Distribución de Tareas</h3>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeploymentChart({ deploymentStats }: { deploymentStats: { environment: string; success: number; failed: number; pending: number }[] }) {
  const envLabels: Record<string, string> = {
    staging: 'Staging',
    production: 'Producción',
  };

  const data = deploymentStats.map(item => ({
    name: envLabels[item.environment] || item.environment,
    Exitosos: item.success,
    Fallidos: item.failed,
    Pendientes: item.pending,
  }));

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground">Métricas de Despliegue</h3>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="Exitosos" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Fallidos" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Pendientes" fill="#eab308" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
