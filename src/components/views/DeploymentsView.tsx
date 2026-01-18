import { Rocket, CheckCircle, Clock, AlertCircle, RefreshCw, Play, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useDeployments } from '@/hooks/useDatabase';
import { cn } from '@/lib/utils';
import { User } from '@supabase/supabase-js';

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

interface DeploymentsViewProps {
  user?: User | null;
  onLogout?: () => void;
}

export function DeploymentsView({ user, onLogout }: DeploymentsViewProps) {
  const { data: deployments, isLoading } = useDeployments();

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Despliegues" 
        subtitle="Control de versiones y entornos"
        user={user}
        onLogout={onLogout}
      />

      <main className="p-4 lg:p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-3 flex-wrap">
          <Button className="gap-2">
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Despliegue</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualizar Estado</span>
            <span className="sm:hidden">Actualizar</span>
          </Button>
        </div>

        {/* Mobile Cards / Desktop Table */}
        <div className="lg:hidden space-y-3">
          {(deployments || []).map((deployment) => {
            const config = statusConfig[deployment.status];
            const StatusIcon = config.icon;

            return (
              <div key={deployment.id} className="glass-panel p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">
                      {deployment.repositories?.name || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusIcon className={cn("w-4 h-4", config.color)} />
                    <span className={cn("text-xs", config.color)}>
                      {config.label}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                    {deployment.version}
                  </code>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded font-medium",
                    deployment.environment === 'production' 
                      ? "bg-status-active/10 text-status-active" 
                      : "bg-primary/10 text-primary"
                  )}>
                    {deployment.environment === 'production' ? 'Prod' : 'Staging'}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {formatDate(deployment.created_at)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <div className="glass-panel overflow-hidden hidden lg:block">
          <div className="overflow-x-auto">
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
                {(deployments || []).map((deployment) => {
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
                            {deployment.repositories?.name || 'Unknown'}
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
                        {formatDate(deployment.created_at)}
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
        </div>

        {(deployments || []).length === 0 && (
          <div className="text-center py-12">
            <Rocket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Sin despliegues registrados</p>
          </div>
        )}
      </main>
    </div>
  );
}
