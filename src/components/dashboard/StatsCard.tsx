import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary';
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: StatsCardProps) {
  return (
    <div className={cn(
      "stat-card group",
      variant === 'primary' && "border-primary/30",
      variant === 'secondary' && "border-secondary/30"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "p-2 rounded-lg",
          variant === 'default' && "bg-muted",
          variant === 'primary' && "bg-primary/10",
          variant === 'secondary' && "bg-secondary/10"
        )}>
          <Icon className={cn(
            "w-4 h-4",
            variant === 'default' && "text-muted-foreground",
            variant === 'primary' && "text-primary",
            variant === 'secondary' && "text-secondary"
          )} />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium",
            trend.positive ? "text-status-active" : "text-destructive"
          )}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
