"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  RefreshCw,
  Server,
  Clock,
  HelpCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SystemInfo() {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)
  
  const [systemInfo] = useState({
    version: "3.5.2",
    newVersionAvailable: "3.6.0",
    lastUpdated: "15/03/2025",
    dbVersion: "PostgreSQL 15.2",
    nodeVersion: "18.15.0",
    os: "Linux Ubuntu 22.04 LTS",
    storageUsed: "5.2 GB / 20 GB",
    uptime: "15 dias, 7 horas",
    maintainer: "ERP Solutions LTDA",
    license: "Comercial (5 usuários)"
  })
  
  const [newFeatures] = useState([
    "Melhorias de desempenho no módulo financeiro",
    "Nova interface de usuário para o painel administrativo",
    "Suporte a múltiplos certificados digitais",
    "Integração com novos marketplaces",
    "Correções de bugs e melhorias de segurança"
  ])
  
  const handleUpdate = () => {
    if (isUpdating) return;
    
    setIsUpdating(true)
    setUpdateProgress(0)
    
    toast({
      title: "Atualização iniciada",
      description: "O sistema será atualizado para a versão 3.6.0",
      variant: "default",
    })
    
    const interval = setInterval(() => {
      setUpdateProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUpdating(false)
          
          toast({
            title: "Atualização concluída",
            description: "O sistema foi atualizado com sucesso para a versão 3.6.0",
            variant: "default",
          })
          
          return 100
        }
        const increment = Math.random() * 15
        return Math.min(prev + increment, 100)
      })
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted p-4 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Versão do Sistema: {systemInfo.version}</h3>
            {systemInfo.newVersionAvailable && (
              <Badge className="bg-amber-500 hover:bg-amber-600">
                Nova versão disponível: {systemInfo.newVersionAvailable}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Última atualização: {systemInfo.lastUpdated}
          </p>
        </div>
        
        {systemInfo.newVersionAvailable && (
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating}
            className="whitespace-nowrap"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Atualizar Sistema
              </>
            )}
          </Button>
        )}
      </div>
      
      {isUpdating && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso da atualização</span>
            <span>{Math.round(updateProgress)}%</span>
          </div>
          <Progress value={updateProgress} className="h-2" />
        </div>
      )}
      
      {systemInfo.newVersionAvailable && (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted p-3 font-medium">
            Novidades da Versão {systemInfo.newVersionAvailable}
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {newFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-4">Informações do Sistema</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span>Banco de Dados</span>
              </div>
              <span className="font-medium">{systemInfo.dbVersion}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span>Versão Node.js</span>
              </div>
              <span className="font-medium">{systemInfo.nodeVersion}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span>Sistema Operacional</span>
              </div>
              <span className="font-medium">{systemInfo.os}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span>Armazenamento</span>
              </div>
              <span className="font-medium">{systemInfo.storageUsed}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Tempo de Atividade</span>
              </div>
              <span className="font-medium">{systemInfo.uptime}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span>Mantenedor</span>
              </div>
              <span className="font-medium">{systemInfo.maintainer}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span>Licença</span>
              </div>
              <span className="font-medium">{systemInfo.license}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-4">Histórico de Atualizações</h3>
        
        <div className="space-y-3">
          <div className="border-l-2 border-green-500 pl-3 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Versão 3.5.2</span>
              <Badge variant="outline" className="text-xs">Atual</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Lançada em 15/03/2025</p>
            <ul className="mt-2 space-y-1">
              <li className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Correção de bugs na geração de relatórios</span>
              </li>
              <li className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Melhorias de desempenho no módulo de estoque</span>
              </li>
            </ul>
          </div>
          
          <div className="border-l-2 border-gray-300 pl-3 pb-4">
            <div className="font-medium">Versão 3.5.1</div>
            <p className="text-sm text-muted-foreground">Lançada em 01/03/2025</p>
            <ul className="mt-2 space-y-1">
              <li className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Correções de bugs no módulo fiscal</span>
              </li>
              <li className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Atualização das alíquotas de impostos</span>
              </li>
              <li className="text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <span>Correção de vulnerabilidade de segurança</span>
              </li>
            </ul>
          </div>
          
          <div className="border-l-2 border-gray-300 pl-3">
            <div className="font-medium">Versão 3.5.0</div>
            <p className="text-sm text-muted-foreground">Lançada em 15/02/2025</p>
            <ul className="mt-2 space-y-1">
              <li className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Novo módulo de integração com marketplaces</span>
              </li>
              <li className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Melhorias na interface do usuário</span>
              </li>
              <li className="text-sm flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Suporte à múltiplos certificados digitais</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button variant="outline" size="sm">
            Ver histórico completo
          </Button>
        </div>
      </div>
    </div>
  )
}
