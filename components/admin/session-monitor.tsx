"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clock, LogOut, Monitor, Smartphone, Laptop, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

interface SessionData {
  id: string
  user: string
  email: string
  device: "desktop" | "mobile" | "tablet"
  ip: string
  location: string
  lastActivity: string
  status: "active" | "inactive"
}

export function SessionMonitor() {
  const { toast } = useToast()
  const [sessions, setSessions] = useState<SessionData[]>([
    {
      id: "1",
      user: "João Silva",
      email: "joao.silva@empresa.com",
      device: "desktop",
      ip: "192.168.1.100",
      location: "São Paulo, SP",
      lastActivity: "Agora mesmo",
      status: "active"
    },
    {
      id: "2",
      user: "Maria Oliveira",
      email: "maria.oliveira@empresa.com",
      device: "mobile",
      ip: "187.45.123.45",
      location: "Rio de Janeiro, RJ",
      lastActivity: "5 minutos atrás",
      status: "active"
    },
    {
      id: "3",
      user: "Carlos Santos",
      email: "carlos.santos@empresa.com",
      device: "desktop",
      ip: "200.179.54.12",
      location: "Porto Alegre, RS",
      lastActivity: "15 minutos atrás",
      status: "active"
    },
    {
      id: "4",
      user: "Ana Pereira",
      email: "ana.pereira@empresa.com",
      device: "tablet",
      ip: "201.33.45.78",
      location: "Florianópolis, SC",
      lastActivity: "2 horas atrás",
      status: "inactive"
    }
  ])

  const handleTerminateSession = (sessionId: string) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, status: "inactive" } 
        : session
    ))
    
    toast({
      title: "Sessão encerrada",
      description: "A sessão foi encerrada com sucesso",
      variant: "default",
    })
  }
  
  const getDeviceIcon = (device: string) => {
    switch(device) {
      case "desktop":
        return <Monitor className="h-4 w-4" />
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Laptop className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
      case "inactive":
        return <Badge variant="outline">Inativo</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Dispositivo</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Última Atividade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map(session => (
              <TableRow key={session.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{session.user}</p>
                      <p className="text-xs text-muted-foreground">{session.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(session.device)}
                    <div>
                      <p className="text-sm capitalize">{session.device}</p>
                      <p className="text-xs text-muted-foreground">{session.ip}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{session.location}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{session.lastActivity}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(session.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTerminateSession(session.id)}
                    disabled={session.status === "inactive"}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Encerrar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Histórico de Login</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">João Silva</p>
                <p className="text-xs text-muted-foreground">IP: 192.168.1.100</p>
              </div>
            </div>
            <div className="text-sm">
              <p>Hoje, 09:15</p>
              <p className="text-xs text-muted-foreground">São Paulo, SP</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Maria Oliveira</p>
                <p className="text-xs text-muted-foreground">IP: 187.45.123.45</p>
              </div>
            </div>
            <div className="text-sm">
              <p>Hoje, 08:45</p>
              <p className="text-xs text-muted-foreground">Rio de Janeiro, RJ</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Carlos Santos</p>
                <p className="text-xs text-muted-foreground">IP: 200.179.54.12</p>
              </div>
            </div>
            <div className="text-sm">
              <p>Hoje, 08:30</p>
              <p className="text-xs text-muted-foreground">Porto Alegre, RS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
