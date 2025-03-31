"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart, 
  ArrowUpRight, 
  ShieldCheck, 
  Server, 
  HardDrive, 
  Webhook, 
  FileText,
  Users,
  Info,
  Bell,
  Clock,
  FileHeart,
  AlertTriangle,
  Activity
} from "lucide-react"

// Importar todos os componentes administrativos do arquivo de índice
import {
  DashboardWidget,
  ActivityLog,
  SystemHealth,
  BackupControl,
  SecurityAudit,
  SessionMonitor,
  IntegrationHub,
  AdvancedReports,
  FiscalCompliance,
  SystemInfo
} from "@/components/admin"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Painel do Administrador</h1>
          <Button variant="destructive" size="sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Modo Administrador
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              Integrações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Status do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SystemHealth />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-amber-500" />
                    Alertas Críticos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-50 text-amber-800 rounded-md border border-amber-200 flex items-start">
                      <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Certificado Digital</p>
                        <p className="text-sm">Certificado A1 expira em 15 dias</p>
                      </div>
                    </div>
                    <div className="p-3 bg-red-50 text-red-800 rounded-md border border-red-200 flex items-start">
                      <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Backup do Sistema</p>
                        <p className="text-sm">Último backup realizado há 7 dias</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-500" />
                    Atividades Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityLog limit={5} />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardWidget 
                title="Usuários Ativos" 
                value="12" 
                change="+2" 
                icon={<Users className="h-5 w-5 text-green-500" />} 
                description="Total de usuários ativos no último dia"
              />
              
              <DashboardWidget 
                title="Uso de Armazenamento" 
                value="62%" 
                change="+5%" 
                icon={<HardDrive className="h-5 w-5 text-blue-500" />} 
                description="Espaço de armazenamento utilizado"
              />
              
              <DashboardWidget 
                title="Integrações Ativas" 
                value="8/10" 
                change="0" 
                icon={<Webhook className="h-5 w-5 text-purple-500" />} 
                description="APIs e sistemas externos conectados"
              />
              
              <DashboardWidget 
                title="Saúde do Sistema" 
                value="96%" 
                change="-1%" 
                icon={<FileHeart className="h-5 w-5 text-red-500" />} 
                description="Baseado em performance e disponibilidade"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Fiscal Compliance</CardTitle>
                <CardDescription>Status de conformidade fiscal e obrigações pendentes</CardDescription>
              </CardHeader>
              <CardContent>
                <FiscalCompliance />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Auditoria de Segurança</CardTitle>
                  <CardDescription>Análise de segurança e ameaças detectadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <SecurityAudit />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monitoramento de Sessões</CardTitle>
                  <CardDescription>Sessões ativas e histórico de acessos</CardDescription>
                </CardHeader>
                <CardContent>
                  <SessionMonitor />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Sistema</CardTitle>
                <CardDescription>Detalhes sobre a versão do sistema e atualizações disponíveis</CardDescription>
              </CardHeader>
              <CardContent>
                <SystemInfo />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Saúde do Sistema</CardTitle>
                  <CardDescription>Monitoramento de recursos e desempenho</CardDescription>
                </CardHeader>
                <CardContent>
                  <SystemHealth />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Backup e Restauração</CardTitle>
                  <CardDescription>Gerenciamento de backups do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <BackupControl />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Gerenciais Avançados</CardTitle>
                <CardDescription>Relatórios personalizados com dados consolidados</CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedReports />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Central de Integrações</CardTitle>
                <CardDescription>Gerenciamento de APIs e sistemas externos</CardDescription>
              </CardHeader>
              <CardContent>
                <IntegrationHub />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
