"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, HardDrive, Cpu, ServerCrash } from "lucide-react"

export function SystemHealth() {
  const [cpuUsage, setCpuUsage] = useState(42)
  const [memoryUsage, setMemoryUsage] = useState(68)
  const [diskUsage, setDiskUsage] = useState(62)
  const [serverHealth, setServerHealth] = useState<"healthy" | "degraded" | "critical">("healthy")
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("Agora mesmo")
  
  // Em uma implementação real, esses dados viriam de uma API
  useEffect(() => {
    const timer = setInterval(() => {
      // Simular leves variações nos valores
      setCpuUsage(prev => Math.min(Math.max(prev + Math.random() * 6 - 3, 10), 90))
      setMemoryUsage(prev => Math.min(Math.max(prev + Math.random() * 4 - 2, 20), 85))
      setDiskUsage(prev => Math.min(Math.max(prev + Math.random() * 0.4 - 0.2, 30), 95))
      
      // Atualizar timestamp
      setLastUpdateTime("Agora mesmo")
      
      // Ocasionalmente mudar o status do servidor para simular eventos
      const random = Math.random()
      if (random > 0.95) {
        setServerHealth("critical")
      } else if (random > 0.85) {
        setServerHealth("degraded")
      } else {
        setServerHealth("healthy")
      }
    }, 15000)
    
    return () => clearInterval(timer)
  }, [])
  
  const getStatusColor = (percentage: number) => {
    if (percentage > 80) return "text-red-500"
    if (percentage > 60) return "text-amber-500"
    return "text-green-500"
  }
  
  const getServerStatusBadge = () => {
    switch (serverHealth) {
      case "healthy":
        return <Badge className="bg-green-500 hover:bg-green-500">Saudável</Badge>
      case "degraded":
        return <Badge className="bg-amber-500 hover:bg-amber-500">Degradado</Badge>
      case "critical":
        return <Badge className="bg-red-500 hover:bg-red-500">Crítico</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <ServerCrash className={`h-5 w-5 mr-2 ${
            serverHealth === "healthy" ? "text-green-500" : 
            serverHealth === "degraded" ? "text-amber-500" : "text-red-500"
          }`} />
          <span className="font-medium">Status do Servidor</span>
        </div>
        {getServerStatusBadge()}
      </div>
    
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <Cpu className="h-4 w-4 mr-2" />
              <span>CPU</span>
            </div>
            <span className={getStatusColor(cpuUsage)}>{cpuUsage.toFixed(1)}%</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Progress value={cpuUsage} className="h-2" 
                  indicatorClassName={
                    cpuUsage > 80 ? "bg-red-500" : 
                    cpuUsage > 60 ? "bg-amber-500" : 
                    "bg-green-500"
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Uso da CPU: {cpuUsage.toFixed(1)}%</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              <span>Memória</span>
            </div>
            <span className={getStatusColor(memoryUsage)}>{memoryUsage.toFixed(1)}%</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Progress value={memoryUsage} className="h-2" 
                  indicatorClassName={
                    memoryUsage > 80 ? "bg-red-500" : 
                    memoryUsage > 60 ? "bg-amber-500" : 
                    "bg-green-500"
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Uso de memória: {memoryUsage.toFixed(1)}%</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              <span>Disco</span>
            </div>
            <span className={getStatusColor(diskUsage)}>{diskUsage.toFixed(1)}%</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Progress value={diskUsage} className="h-2" 
                  indicatorClassName={
                    diskUsage > 80 ? "bg-red-500" : 
                    diskUsage > 60 ? "bg-amber-500" : 
                    "bg-green-500"
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Uso de disco: {diskUsage.toFixed(1)}%</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="flex items-center text-xs text-muted-foreground mt-2 pt-2 border-t">
        <Clock className="h-3 w-3 mr-1" />
        <span>Última atualização: {lastUpdateTime}</span>
      </div>
    </div>
  )
}
