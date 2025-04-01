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
  Package,
  Filter
} from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function AdvancedReports() {
  const [selectedReportType, setSelectedReportType] = useState("sales")
  const [dateRange, setDateRange] = useState("month")
  const [groupBy, setGroupBy] = useState("product")
  
  const reportTypes = [
    { id: "sales", name: "Vendas", icon: <ShoppingCart className="h-4 w-4" /> },
    { id: "finance", name: "Financeiro", icon: <DollarSign className="h-4 w-4" /> },
    { id: "inventory", name: "Estoque", icon: <Package className="h-4 w-4" /> },
    { id: "customers", name: "Clientes", icon: <Users className="h-4 w-4" /> },
    { id: "fiscal", name: "Fiscal", icon: <FileText className="h-4 w-4" /> }
  ]
  
  const dateRanges = [
    { id: "today", name: "Hoje" },
    { id: "yesterday", name: "Ontem" },
    { id: "week", name: "Esta Semana" },
    { id: "last_week", name: "Semana Passada" },
    { id: "month", name: "Este Mês" },
    { id: "last_month", name: "Mês Passado" },
    { id: "quarter", name: "Este Trimestre" },
    { id: "year", name: "Este Ano" },
    { id: "custom", name: "Personalizado" }
  ]
  
  const groupByOptions = {
    sales: [
      { id: "product", name: "Produto" },
      { id: "category", name: "Categoria" },
      { id: "customer", name: "Cliente" },
      { id: "seller", name: "Vendedor" },
      { id: "date", name: "Data" }
    ],
    finance: [
      { id: "category", name: "Categoria" },
      { id: "account", name: "Conta" },
      { id: "date", name: "Data" }
    ],
    inventory: [
      { id: "product", name: "Produto" },
      { id: "category", name: "Categoria" },
      { id: "supplier", name: "Fornecedor" },
      { id: "movement", name: "Movimentação" }
    ],
    customers: [
      { id: "city", name: "Cidade" },
      { id: "state", name: "Estado" },
      { id: "segment", name: "Segmento" },
      { id: "status", name: "Status" }
    ],
    fiscal: [
      { id: "document", name: "Documento" },
      { id: "operation", name: "Operação" },
      { id: "tax", name: "Imposto" },
      { id: "date", name: "Data" }
    ]
  }
  
  const handleGenerateReport = () => {
    // Aqui implementaria a geração do relatório
    console.log(`Gerando relatório de ${selectedReportType} agrupado por ${groupBy} para o período ${dateRange}`)
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-medium mb-4">Gerador de Relatórios Avançados</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <div className="flex flex-wrap gap-2">
                {reportTypes.map(type => (
                  <Button
                    key={type.id}
                    variant={selectedReportType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedReportType(type.id)
                      setGroupBy(groupByOptions[type.id as keyof typeof groupByOptions][0].id)
                    }}
                    className="flex items-center gap-2"
                  >
                    {type.icon}
                    {type.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map(range => (
                    <SelectItem key={range.id} value={range.id}>
                      {range.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {dateRange === "custom" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Inicial</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Data Final</Label>
                  <Input type="date" />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Agrupar Por</Label>
              <Select 
                value={groupBy} 
                onValueChange={setGroupBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o agrupamento" />
                </SelectTrigger>
                <SelectContent>
                  {groupByOptions[selectedReportType as keyof typeof groupByOptions].map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Filtros</Label>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Filtros Avançados</span>
                    <Button variant="ghost" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Adicionar Filtro
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Checkbox id="filter-active" />
                      <Label htmlFor="filter-active" className="text-sm">
                        Apenas itens ativos
                      </Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Checkbox id="filter-positive" />
                      <Label htmlFor="filter-positive" className="text-sm">
                        Apenas valores positivos
                      </Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Checkbox id="filter-complete" />
                      <Label htmlFor="filter-complete" className="text-sm">
                        Apenas operações concluídas
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2">
              <Label>Formato de Saída</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleGenerateReport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-4">Relatórios Salvos</h3>
        
        <div className="space-y-3">
          <div className="border rounded-md p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Vendas por Produto - Mensal</h4>
              </div>
              <p className="text-sm text-muted-foreground">Última execução: 25/03/2025</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Fluxo de Caixa - Trimestral</h4>
              </div>
              <p className="text-sm text-muted-foreground">Última execução: 20/03/2025</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Inventário - Valorização</h4>
              </div>
              <p className="text-sm text-muted-foreground">Última execução: 15/03/2025</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
