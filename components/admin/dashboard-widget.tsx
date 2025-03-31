"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface DashboardWidgetProps {
  title: string
  value: string
  change?: string
  icon: ReactNode
  description?: string
}

export function DashboardWidget({ 
  title, 
  value, 
  change, 
  icon, 
  description 
}: DashboardWidgetProps) {
  // Determinar se a mudança é positiva, negativa ou neutra
  const isPositive = change && change.startsWith("+")
  const isNegative = change && change.startsWith("-")
  const isNeutral = change && change === "0"

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {change && (
                <span className={cn(
                  "text-sm font-medium",
                  isPositive && "text-green-600",
                  isNegative && "text-red-600",
                  isNeutral && "text-muted-foreground"
                )}>
                  {change}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="bg-muted p-3 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
