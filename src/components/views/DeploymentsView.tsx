import { Rocket, CheckCircle, Clock, AlertCircle, RefreshCw, Play } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { mockDeployments } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const statusConfig = {
  success: { 
    icon: CheckCircle, 
    color: 'text-status-active', 
    bg: 'bg-status-active/10',
    label: 'Exitoso'
  },
  pending: { 
    icon: Clock, 
    color: 'text-status-pending', 
    bg: 'bg-status-pending/10',
    label: 'En proceso'
  },
  failed: { 
    icon: AlertCircle, 
    color: 'text-destructive', 
    bg: 'bg-destructive/10',
    label: 'Fallido'
  },
};

export function DeploymentsView() {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Despliegues" 
        subtitle="Control de versiones y entornos" 
      />

      <main className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button className="gap-2">
            <Play className="w-4 h-4" />
            Nuevo Despliegue
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualizar Estado
          </Button>
        </div>

        {/* Deployments Table */}
        <div className="glass-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Repositorio</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Versión</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Entorno</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mockDeployments.map((deployment) => {
                const config = statusConfig[deployment.status];
                const StatusIcon = config.icon;

                return (
                  <tr 
                    key={deployment.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">
                          {deployment.repository}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                        {deployment.version}
                      </code>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded font-medium",
                        deployment.environment === 'production' 
                          ? "bg-status-active/10 text-status-active" 
                          : "bg-primary/10 text-primary"
                      )}>
                        {deployment.environment === 'production' ? 'Producción' : 'Staging'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={cn("w-4 h-4", config.color)} />
                        <span className={cn("text-sm", config.color)}>
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(deployment.timestamp)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          Ver logs
                        </Button>
                        {deployment.status === 'failed' && (
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive">
                            Reintentar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
