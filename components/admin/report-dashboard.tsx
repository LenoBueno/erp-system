"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  BarChart, 
  PieChart, 
  Download, 
  Calendar, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Package
} from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface ReportSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  formats: string[]
}

export function ReportDashboard() {
  const [activeTab, setActiveTab] = useState("finance")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  
  const reports: Record<string, ReportSection[]> = {
    finance: [
      {
        id: "income-statement",
        title: "Demonstrativo de Resultados",
        description: "Relatório detalhado de receitas, despesas e lucros por período",
        icon: <BarChart className="h-5 w-5 text-blue-500" />,
        formats: ["PDF", "Excel", "CSV"]
      },
      {
        id: "cash-flow",
        title: "Fluxo de Caixa",
        description: "Entradas e saídas de caixa diárias, semanais ou mensais",
        icon: <BarChart className="h-5 w-5 text-green-500" />,
        formats: ["PDF", "Excel"]
      },
      {
        id: "receivables",
        title: "Contas a Receber",
        description: "Status e previsão de recebimentos por cliente",
        icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
        formats: ["PDF", "Excel", "CSV"]
      },
      {
        id: "payables",
        title: "Contas a Pagar",
        description: "Status e previsão de pagamentos por fornecedor",
        icon: <DollarSign className="h-5 w-5 text-red-500" />,
        formats: ["PDF", "Excel", "CSV"]
      }
    ],
    sales: [
      {
        id: "sales-performance",
        title: "Desempenho de Vendas",
        description: "Análise de vendas por produto, categoria e vendedor",
        icon: <ShoppingCart className="h-5 w-5 text-purple-500" />,
        formats: ["PDF", "Excel", "CSV"]
      },
      {
        id: "sales-by-customer",
        title: "Vendas por Cliente",
        description: "Relatório detalhado de vendas agrupadas por cliente",
        icon: <Users className="h-5 w-5 text-indigo-500" />,
        formats: ["PDF", "Excel"]
      },
      {
        id: "sales-by-period",
        title: "Vendas por Período",
        description: "Análise comparativa de vendas em diferentes períodos",
        icon: <Calendar className="h-5 w-5 text-blue-500" />,
        formats: ["PDF", "Excel", "CSV"]
      }
    ],
    inventory: [
      {
        id: "inventory-status",
        title: "Status de Estoque",
        description: "Situação atual do estoque com alertas de níveis baixos",
        icon: <Package className="h-5 w-5 text-amber-500" />,
        formats: ["PDF", "Excel", "CSV"]
      },
      {
        id: "inventory-movement",
        title: "Movimentação de Estoque",
        description: "Registro de entradas e saídas de produtos no estoque",
        icon: <Package className="h-5 w-5 text-green-500" />,
        formats: ["PDF", "Excel"]
      },
      {
        id: "inventory-valuation",
        title: "Valorização de Estoque",
        description: "Valor total do estoque atual com detalhamento por produto",
        icon: <DollarSign className="h-5 w-5 text-blue-500" />,
        formats: ["PDF", "Excel"]
      }
    ],
    fiscal: [
      {
        id: "nfe-report",
        title: "Relatório de NFe",
        description: "Listagem de todas as notas fiscais emitidas no período",
        icon: <FileText className="h-5 w-5 text-blue-500" />,
        formats: ["PDF", "Excel", "CSV"]
      },
      {
        id: "tax-summary",
        title: "Resumo de Impostos",
        description: "Detalhamento de impostos por operação e totais por período",
        icon: <PieChart className="h-5 w-5 text-red-500" />,
        formats: ["PDF", "Excel"]
      }
    ]
  }
  
  const handleGenerateReport = (reportId: string) => {
    // Aqui implementaria a geração do relatório
    console.log(`Gerando relatório ${reportId} para o período ${selectedPeriod}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Relatórios Administrativos</h3>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mês</SelectItem>
            <SelectItem value="quarter">Este Trimestre</SelectItem>
            <SelectItem value="year">Este Ano</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="finance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="finance">Financeiro</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
          <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
        </TabsList>
        
        {Object.entries(reports).map(([category, items]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(report => (
                <Card key={report.id}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {report.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{report.title}</h4>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                          <div className="flex gap-2 mt-2">
                            {report.formats.map(format => (
                              <Badge 
                                key={format} 
                                variant="outline" 
                                className="text-xs font-normal"
                              >
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleGenerateReport(report.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Gerar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button variant="link">Ver todos os relatórios de {
                category === "finance" ? "Financeiro" :
                category === "sales" ? "Vendas" :
                category === "inventory" ? "Estoque" : "Fiscal"
              }</Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md">
        <h4 className="font-medium mb-2">Relatórios Programados</h4>
        <p className="text-sm">
          Você tem 3 relatórios configurados para geração automática:
        </p>
        <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
          <li>Desempenho de Vendas - Enviado toda segunda-feira às 08:00</li>
          <li>Fluxo de Caixa - Enviado todo dia 1º do mês às 07:00</li>
          <li>Status de Estoque - Enviado todo dia às 18:00</li>
        </ul>
        <Button size="sm" className="mt-3">Gerenciar Relatórios Programados</Button>
      </div>
    </div>
  )
}

// Componente Badge customizado
function Badge({ children, className, variant = "default" }: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline"
}) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
      variant === "default" ? "bg-primary/10 text-primary" : "border border-muted text-muted-foreground"
    } ${className || ""}`}>
      {children}
    </span>
  );
}
