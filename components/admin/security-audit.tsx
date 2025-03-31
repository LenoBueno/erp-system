"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, RefreshCw, AlertTriangle, Info, Lock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface SecurityIssue {
  id: string
  type: "high" | "medium" | "low"
  title: string
  description: string
  solution: string
}

export function SecurityAudit() {
  const [lastScanDate, setLastScanDate] = useState("30/03/2025 14:30")
  const [securityScore, setSecurityScore] = useState(83)
  const [isScanRunning, setIsScanRunning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const { toast } = useToast()
  
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([
    {
      id: "1",
      type: "high",
      title: "Senhas fracas detectadas",
      description: "3 usuários estão usando senhas consideradas fracas ou fáceis de adivinhar.",
      solution: "Solicite que os usuários afetados alterem suas senhas seguindo as diretrizes de segurança."
    },
    {
      id: "2",
      type: "medium",
      title: "Certificado digital próximo ao vencimento",
      description: "O certificado digital A1 expirará em 15 dias.",
      solution: "Renove o certificado digital antes do vencimento para evitar interrupções nas operações fiscais."
    },
    {
      id: "3",
      type: "low",
      title: "Backup automático desativado",
      description: "O backup automático do sistema está desativado há 7 dias.",
      solution: "Ative o backup automático nas configurações do sistema para proteção contra perda de dados."
    }
  ])
  
  const startSecurityScan = () => {
    if (isScanRunning) return;
    
    setIsScanRunning(true)
    setScanProgress(0)
    
    toast({
      title: "Verificação de segurança iniciada",
      description: "Este processo pode levar alguns minutos",
      variant: "default",
    })
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanRunning(false)
          setLastScanDate(new Date().toLocaleDateString("pt-BR") + " " + 
            new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))
          
          toast({
            title: "Verificação de segurança concluída",
            description: "Foram encontradas 3 vulnerabilidades",
            variant: "default",
          })
          
          // Gerar um novo score aleatório entre 75 e 95
          setSecurityScore(Math.floor(Math.random() * 20) + 75)
          
          return 100
        }
        const increment = Math.random() * 15
        return Math.min(prev + increment, 100)
      })
    }, 800)
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }
  
  const getTypeBadge = (type: string) => {
    switch(type) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600">Alto</Badge>
      case "medium":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Médio</Badge>
      case "low":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Baixo</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <span className={`text-xl font-bold ${getScoreColor(securityScore)}`}>{securityScore}</span>
          </div>
          <div>
            <h3 className="font-medium">Pontuação de Segurança</h3>
            <p className="text-sm text-muted-foreground">Última verificação: {lastScanDate}</p>
          </div>
        </div>
        
        <Button onClick={startSecurityScan} disabled={isScanRunning} className="whitespace-nowrap">
          {isScanRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Verificar Agora
            </>
          )}
        </Button>
      </div>
      
      {isScanRunning && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso da verificação</span>
            <span>{Math.round(scanProgress)}%</span>
          </div>
          <Progress value={scanProgress} className="h-2" />
        </div>
      )}
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-4">Vulnerabilidades Detectadas</h3>
        
        <div className="space-y-4">
          {securityIssues.map(issue => (
            <div key={issue.id} className="border rounded-md overflow-hidden">
              <div className="flex items-center justify-between bg-muted p-3">
                <div className="flex items-center gap-2">
                  {issue.type === "high" ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : issue.type === "medium" ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Info className="h-5 w-5 text-blue-500" />
                  )}
                  <span className="font-medium">{issue.title}</span>
                </div>
                {getTypeBadge(issue.type)}
              </div>
              <div className="p-3 space-y-3">
                <p className="text-sm">{issue.description}</p>
                <div className="bg-muted p-2 rounded-md text-sm">
                  <span className="font-medium flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    Solução Recomendada:
                  </span>
                  <p className="mt-1">{issue.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4" />
            Política de Senhas
          </h4>
          <div className="text-sm space-y-1">
            <p>Comprimento mínimo: <span className="font-medium">8 caracteres</span></p>
            <p>Complexidade: <span className="font-medium">Média</span></p>
            <p>Expiração: <span className="font-medium">90 dias</span></p>
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4" />
            Configurações de Segurança
          </h4>
          <div className="text-sm space-y-1">
            <p>2FA Habilitado: <span className="font-medium text-amber-500">Não</span></p>
            <p>Bloqueio após falhas: <span className="font-medium text-green-500">5 tentativas</span></p>
            <p>Log de atividades: <span className="font-medium text-green-500">Ativado</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
