"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Webhook, 
  BarChart, 
  ShoppingCart, 
  Package, 
  Info, 
  FileText, 
  AlertTriangle, 
  RefreshCw,
  PlusCircle,
  ExternalLink
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Integration {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "error"
  type: "ecommerce" | "erp" | "accounting" | "marketplace" | "logistics" | "payment"
  lastSync: string
}

export function IntegrationHub() {
  const { toast } = useToast()
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "1",
      name: "Mercado Livre",
      description: "Integração com marketplace Mercado Livre",
      status: "active",
      type: "marketplace",
      lastSync: "Hoje, 10:15"
    },
    {
      id: "2",
      name: "Shopify",
      description: "Loja virtual Shopify",
      status: "active",
      type: "ecommerce",
      lastSync: "Hoje, 09:30"
    },
    {
      id: "3",
      name: "Contabilidade Online",
      description: "Sistema contábil externo",
      status: "inactive",
      type: "accounting",
      lastSync: "25/03/2025"
    },
    {
      id: "4",
      name: "Transportadora XYZ",
      description: "Integração com sistema de logística",
      status: "error",
      type: "logistics",
      lastSync: "Falha: 26/03/2025"
    },
    {
      id: "5",
      name: "PagSeguro",
      description: "Gateway de pagamento",
      status: "active",
      type: "payment",
      lastSync: "Hoje, 08:45"
    }
  ])
  
  const [syncingId, setSyncingId] = useState<string | null>(null)
  
  const toggleIntegrationStatus = (id: string) => {
    setIntegrations(integrations.map(integration => {
      if (integration.id === id) {
        const newStatus = integration.status === "active" ? "inactive" : "active"
        
        toast({
          title: `Integração ${newStatus === "active" ? "ativada" : "desativada"}`,
          description: `${integration.name} foi ${newStatus === "active" ? "ativada" : "desativada"} com sucesso`,
          variant: "default",
        })
        
        return {
          ...integration,
          status: newStatus,
          lastSync: newStatus === "active" ? "Agora mesmo" : integration.lastSync
        }
      }
      return integration
    }))
  }
  
  const syncIntegration = (id: string) => {
    if (syncingId) return;
    
    setSyncingId(id)
    
    // Simular sincronização
    setTimeout(() => {
      setIntegrations(integrations.map(integration => {
        if (integration.id === id) {
          toast({
            title: "Sincronização concluída",
            description: `${integration.name} foi sincronizado com sucesso`,
            variant: "default",
          })
          
          return {
            ...integration,
            status: "active",
            lastSync: "Agora mesmo"
          }
        }
        return integration
      }))
      
      setSyncingId(null)
    }, 2000)
  }
  
  const getIntegrationIcon = (type: string) => {
    switch(type) {
      case "ecommerce":
        return <ShoppingCart className="h-5 w-5 text-purple-500" />
      case "marketplace":
        return <ShoppingCart className="h-5 w-5 text-amber-500" />
      case "accounting":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "logistics":
        return <Package className="h-5 w-5 text-green-500" />
      case "payment":
        return <BarChart className="h-5 w-5 text-red-500" />
      default:
        return <Webhook className="h-5 w-5 text-gray-500" />
    }
  }
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
      case "inactive":
        return <Badge variant="outline">Inativo</Badge>
      case "error":
        return <Badge className="bg-red-500 hover:bg-red-600">Erro</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Integrações Disponíveis</h3>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Integração
        </Button>
      </div>
      
      <div className="space-y-4">
        {integrations.map(integration => (
          <div key={integration.id} className="border rounded-md overflow-hidden">
            <div className="flex items-center justify-between bg-muted p-4">
              <div className="flex items-center gap-3">
                {getIntegrationIcon(integration.type)}
                <div>
                  <h4 className="font-medium flex items-center">
                    {integration.name}
                    {integration.status === "error" && (
                      <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </div>
              </div>
              {getStatusBadge(integration.status)}
            </div>
            
            <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span>
                  Última sincronização: <span className="font-medium">{integration.lastSync}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={integration.status === "active"}
                    onCheckedChange={() => toggleIntegrationStatus(integration.id)}
                    disabled={syncingId === integration.id}
                  />
                  <span className="text-sm">
                    {integration.status === "active" ? "Ativado" : "Desativado"}
                  </span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={integration.status === "inactive" || syncingId !== null}
                  onClick={() => syncIntegration(integration.id)}
                >
                  {syncingId === integration.id ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sincronizar
                    </>
                  )}
                </Button>
                
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </div>
            
            {integration.status === "error" && (
              <div className="px-4 pb-4">
                <div className="p-3 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm">
                  <span className="font-medium">Erro de sincronização:</span> Não foi possível conectar 
                  ao servidor da integração. Verifique as credenciais e tente novamente.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md">
        <h4 className="font-medium flex items-center gap-2 mb-2">
          <Info className="h-5 w-5" />
          Sobre as Integrações
        </h4>
        <p className="text-sm">
          As integrações permitem que o sistema se conecte a serviços externos como marketplaces, 
          e-commerces, sistemas contábeis e outras ferramentas. Mantenha suas integrações ativas e 
          sincronizadas para garantir que os dados estejam sempre atualizados em todos os sistemas.
        </p>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">API do Sistema</h3>
        <div className="bg-muted p-4 rounded-md">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium">Status da API</p>
            <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Requisições hoje</span>
              <span className="font-medium">1,234</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de erro</span>
              <span className="font-medium">0.2%</span>
            </div>
            <div className="flex justify-between">
              <span>Chaves de API ativas</span>
              <span className="font-medium">3</span>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Gerenciar Chaves de API
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
