import { GitCommit, Rocket, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { mockDeployments } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const statusConfig = {
  success: { icon: CheckCircle, color: 'text-status-active', bg: 'bg-status-active/10' },
  pending: { icon: Clock, color: 'text-status-pending', bg: 'bg-status-pending/10' },
  failed: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

export function RecentActivity() {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Actividad Reciente</h3>
        <Rocket className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {mockDeployments.map((deployment) => {
          const config = statusConfig[deployment.status];
          const StatusIcon = config.icon;

          return (
            <div 
              key={deployment.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className={cn("p-1.5 rounded-lg", config.bg)}>
                <StatusIcon className={cn("w-3.5 h-3.5", config.color)} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {deployment.repository}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {deployment.version}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded",
                    deployment.environment === 'production' 
                      ? "bg-status-active/10 text-status-active" 
                      : "bg-primary/10 text-primary"
                  )}>
                    {deployment.environment}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatTime(deployment.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
