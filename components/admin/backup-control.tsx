"use client"

import { useState } from "react"
import { Download, Upload, CheckCircle2, Clock, AlertCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface BackupData {
  id: string
  name: string
  date: string
  size: string
  status: "completed" | "in_progress" | "failed"
}

export function BackupControl() {
  const [backups, setBackups] = useState<BackupData[]>([
    {
      id: "1",
      name: "Backup Completo",
      date: "24/03/2025 01:30",
      size: "1.2 GB",
      status: "completed"
    },
    {
      id: "2",
      name: "Backup Banco de Dados",
      date: "17/03/2025 01:30",
      size: "850 MB",
      status: "completed"
    },
    {
      id: "3",
      name: "Backup Arquivos",
      date: "10/03/2025 01:30",
      size: "350 MB",
      status: "completed"
    },
  ])
  
  const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [backupProgress, setBackupProgress] = useState(0)
  const [isBackupInProgress, setIsBackupInProgress] = useState(false)
  const { toast } = useToast()

  const handleCreateBackup = () => {
    if (isBackupInProgress) return;
    
    setIsBackupInProgress(true)
    setBackupProgress(0)
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackupInProgress(false)
          
          // Adicionar o novo backup à lista
          const newBackup: BackupData = {
            id: (backups.length + 1).toString(),
            name: "Backup Completo",
            date: new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            size: "1.2 GB",
            status: "completed"
          }
          
          setBackups([newBackup, ...backups])
          
          toast({
            title: "Backup concluído",
            description: "O backup foi realizado com sucesso",
            variant: "default",
          })
          
          return 100
        }
        const increment = Math.random() * 10
        return Math.min(prev + increment, 100)
      })
    }, 500)
  }
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }
  
  const handleDeleteBackup = (id: string) => {
    setBackups(backups.filter(backup => backup.id !== id))
    toast({
      title: "Backup removido",
      description: "O backup foi removido com sucesso",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
        <div>
          <h3 className="font-medium">Backup Manual</h3>
          <p className="text-sm text-muted-foreground">Crie um backup completo do sistema</p>
        </div>
        <Button 
          onClick={handleCreateBackup} 
          disabled={isBackupInProgress}
          className="gap-2"
        >
          {isBackupInProgress ? (
            <>
              <Clock className="h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Criar Backup
            </>
          )}
        </Button>
      </div>
      
      {isBackupInProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso do backup</span>
            <span>{Math.round(backupProgress)}%</span>
          </div>
          <Progress value={backupProgress} className="h-2" />
        </div>
      )}
      
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-medium">Configurações de Backup Automático</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-backup" className="flex flex-col">
            <span>Backup Automático</span>
            <span className="font-normal text-sm text-muted-foreground">Realizar backups automaticamente</span>
          </Label>
          <Switch 
            id="auto-backup" 
            checked={isAutoBackupEnabled}
            onCheckedChange={setIsAutoBackupEnabled}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="backup-frequency">Frequência</Label>
          <Select 
            value={backupFrequency}
            onValueChange={setBackupFrequency}
            disabled={!isAutoBackupEnabled}
          >
            <SelectTrigger id="backup-frequency">
              <SelectValue placeholder="Selecione a frequência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diariamente</SelectItem>
              <SelectItem value="weekly">Semanalmente</SelectItem>
              <SelectItem value="biweekly">Quinzenalmente</SelectItem>
              <SelectItem value="monthly">Mensalmente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-4">Backups Anteriores</h3>
        
        <div className="space-y-3">
          {backups.map(backup => (
            <div key={backup.id} className="bg-muted p-3 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(backup.status)}
                <div>
                  <p className="font-medium">{backup.name}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                    <span>{backup.date}</span>
                    <span>{backup.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteBackup(backup.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
