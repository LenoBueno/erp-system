"use client"

import { useState } from "react"
import { 
  Clock, 
  Shield, 
  UserPlus, 
  FilePenLine, 
  Trash2, 
  LogIn, 
  FileText 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ActivityLogProps {
  limit?: number
}

type ActivityType = 
  | "login" 
  | "user_create" 
  | "user_edit" 
  | "user_delete" 
  | "security" 
  | "document" 
  | "system"

interface Activity {
  id: number
  type: ActivityType
  message: string
  user: string
  timestamp: string
  severity?: "low" | "medium" | "high"
}

export function ActivityLog({ limit = 10 }: ActivityLogProps) {
  // Em uma implementação real, isso viria de uma API
  const [activities] = useState<Activity[]>([
    {
      id: 1,
      type: "login",
      message: "Login no sistema",
      user: "joao.silva@empresa.com",
      timestamp: "Hoje, 10:23",
    },
    {
      id: 2,
      type: "user_create",
      message: "Novo usuário criado: Pedro Santos",
      user: "joao.silva@empresa.com",
      timestamp: "Hoje, 09:45",
    },
    {
      id: 3,
      type: "security",
      message: "Tentativa de login falha (3x)",
      user: "maria.oliveira@empresa.com",
      timestamp: "Ontem, 17:30",
      severity: "medium"
    },
    {
      id: 4,
      type: "document",
      message: "NFe #12345 emitida com sucesso",
      user: "carlos.santos@empresa.com",
      timestamp: "Ontem, 16:12",
    },
    {
      id: 5,
      type: "user_edit",
      message: "Perfil de usuário atualizado: Maria Oliveira",
      user: "joao.silva@empresa.com",
      timestamp: "Ontem, 15:05",
    },
    {
      id: 6,
      type: "security",
      message: "Acesso de IP não reconhecido",
      user: "sistema",
      timestamp: "23/03/2025, 08:17",
      severity: "high"
    },
    {
      id: 7,
      type: "system",
      message: "Backup automático realizado",
      user: "sistema",
      timestamp: "22/03/2025, 23:00",
    },
    {
      id: 8,
      type: "user_delete",
      message: "Usuário removido: Roberto Costa",
      user: "joao.silva@empresa.com",
      timestamp: "22/03/2025, 14:23",
    },
    {
      id: 9,
      type: "document",
      message: "Relatório mensal gerado",
      user: "ana.pereira@empresa.com",
      timestamp: "21/03/2025, 10:48",
    },
    {
      id: 10,
      type: "login",
      message: "Login no sistema",
      user: "carlos.santos@empresa.com",
      timestamp: "21/03/2025, 08:30",
    },
    {
      id: 11,
      type: "security",
      message: "Senha alterada",
      user: "maria.oliveira@empresa.com",
      timestamp: "20/03/2025, 16:42",
    },
    {
      id: 12,
      type: "system",
      message: "Atualização do sistema instalada",
      user: "sistema",
      timestamp: "20/03/2025, 01:15",
    },
  ]);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4" />;
      case "user_create":
        return <UserPlus className="h-4 w-4" />;
      case "user_edit":
        return <FilePenLine className="h-4 w-4" />;
      case "user_delete":
        return <Trash2 className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "system":
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityClass = (type: ActivityType, severity?: string) => {
    if (severity === "high") return "bg-red-100 text-red-800 border-red-200";
    if (severity === "medium") return "bg-amber-100 text-amber-800 border-amber-200";
    
    switch (type) {
      case "security":
        return "bg-blue-50 text-blue-800 border-blue-100";
      case "user_create":
      case "user_edit":
      case "user_delete":
        return "bg-purple-50 text-purple-800 border-purple-100";
      case "document":
        return "bg-green-50 text-green-800 border-green-100";
      default:
        return "bg-gray-50 text-gray-800 border-gray-100";
    }
  };

  return (
    <div className="space-y-3">
      {activities.slice(0, limit).map((activity) => (
        <div 
          key={activity.id}
          className={cn(
            "p-3 rounded-md border text-sm flex items-start",
            getActivityClass(activity.type, activity.severity)
          )}
        >
          <div className="mr-3 mt-0.5">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1">
            <p className="font-medium">{activity.message}</p>
            <div className="flex justify-between mt-1 text-xs opacity-80">
              <span>{activity.user}</span>
              <span>{activity.timestamp}</span>
            </div>
          </div>
        </div>
      ))}
      
      {activities.length > limit && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" size="sm">
            Ver todas as atividades
          </Button>
        </div>
      )}
    </div>
  )
}
