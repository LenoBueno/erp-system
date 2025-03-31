"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Activity, 
  Database, 
  Shield, 
  FileBarChart, 
  Webhook, 
  Settings, 
  AlertTriangle, 
  Users,
  Info,
  Bell,
  Clock,
  FileHeart,
  Server
} from "lucide-react"
import { DashboardWidget } from "@/components/admin/dashboard-widget"
import { ActivityLog } from "@/components/admin/activity-log"
import { SystemHealth } from "@/components/admin/system-health"
import { BackupControl } from "@/components/admin/backup-control"
import { SecurityAudit } from "@/components/admin/security-audit"
import { SessionMonitor } from "@/components/admin/session-monitor"
import { IntegrationHub } from "@/components/admin/integration-hub"
import { SystemInfo } from "@/components/admin/system-info"
import { ReportDashboard } from "@/components/admin/report-dashboard"

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
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                icon={<Database className="h-5 w-5 text-blue-500" />} 
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
                <CardTitle className="text-xl flex items-center">
                  <Server className="h-5 w-5 mr-2 text-indigo-500" />
                  Registro de Atividades
                </CardTitle>
                <CardDescription>Histórico completo de ações no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityLog limit={10} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-red-500" />
                    Auditoria de Segurança
                  </CardTitle>
                  <CardDescription>Análise de segurança e ameaças detectadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <SecurityAudit />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    Monitoramento de Sessões
                  </CardTitle>
                  <CardDescription>Sessões ativas e histórico de acessos</CardDescription>
                </CardHeader>
                <CardContent>
                  <SessionMonitor />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Database className="h-5 w-5 mr-2 text-green-500" />
                    Backup do Sistema
                  </CardTitle>
                  <CardDescription>Gerenciamento de backups e restauração</CardDescription>
                </CardHeader>
                <CardContent>
                  <BackupControl />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-500" />
                    Informações do Sistema
                  </CardTitle>
                  <CardDescription>Versão, atualizações e status</CardDescription>
                </CardHeader>
                <CardContent>
                  <SystemInfo />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-amber-500" />
                  Monitoramento de Performance
                </CardTitle>
                <CardDescription>Detalhes sobre o desempenho do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <SystemHealth />
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">Comandos de Manutenção</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="outline" size="sm" className="w-full">Limpar Cache</Button>
                      <Button variant="outline" size="sm" className="w-full">Otimizar Banco de Dados</Button>
                      <Button variant="outline" size="sm" className="w-full">Verificar Integridade</Button>
                      <Button variant="outline" size="sm" className="w-full">Reiniciar Serviços</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <FileBarChart className="h-5 w-5 mr-2 text-indigo-500" />
                  Relatórios Administrativos
                </CardTitle>
                <CardDescription>Geração de relatórios para todos os módulos do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportDashboard />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Webhook className="h-5 w-5 mr-2 text-purple-500" />
                  Central de Integrações
                </CardTitle>
                <CardDescription>Gerencie conexões com sistemas e serviços externos</CardDescription>
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
