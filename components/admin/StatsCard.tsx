import type { LucideIcon } from "lucide-react"
import { Divide as DefaultIcon } from "lucide-react" 
import { cn } from '@/lib/utils';
import { fmt } from "@/lib/number"

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'default',
  className 
}: StatsCardProps) {
  const colorClasses = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
  };

  return (
    <div className={cn("stats-card", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{fmt(Number(value ?? 0))}</p>
          {change && (
            <p className={cn(
              "text-xs mt-1 flex items-center gap-1",
              change.isPositive ? "text-green-400" : "text-red-400"
            )}>
              <span>{change.isPositive ? '↗' : '↘'}</span>
              {change.value}
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          color === 'primary' ? 'bg-primary/10' : 'bg-muted/50'
        )}>
          <Icon className={cn("w-6 h-6", colorClasses[color])} />
        </div>
      </div>
    </div>
  );
}