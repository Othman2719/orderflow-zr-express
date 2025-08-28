import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "destructive";
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  variant = "default" 
}: StatsCardProps) {
  const variantStyles = {
    default: "border-border",
    success: "border-success/20 bg-success/5",
    warning: "border-warning/20 bg-warning/5", 
    destructive: "border-destructive/20 bg-destructive/5"
  };

  const iconStyles = {
    default: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    destructive: "text-destructive bg-destructive/10"
  };

  return (
    <Card className={cn("shadow-card", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-bold text-foreground">{value}</span>
              {trend && (
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  trend.isPositive 
                    ? "text-success bg-success/10" 
                    : "text-destructive bg-destructive/10"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}