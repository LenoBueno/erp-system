"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { FileText, Calendar, ArrowUpDown, TrendingUp } from "lucide-react"

export default function EstatisticasPage() {
  const [periodoVendas, setPeriodoVendas] = useState("6m")
  const [periodoClientes, setPeriodoClientes] = useState("12m")
  const [comparacaoAno, setComparacaoAno] = useState("atual")

  // Dados simulados para vendas por período
  const vendasPorPeriodo = {
    "3m": [
      { name: "Abr", value: 45000 },
      { name: "Mai", value: 52000 },
      { name: "Jun", value: 58000 },
    ],
    "6m": [
      { name: "Jan", value: 38000 },
      { name: "Fev", value: 42000 },
      { name: "Mar", value: 40000 },
      { name: "Abr", value: 45000 },
      { name: "Mai", value: 52000 },
      { name: "Jun", value: 58000 },
    ],
    "12m": [
      { name: "Jul/22", value: 35000 },
      { name: "Ago/22", value: 37000 },
      { name: "Set/22", value: 33000 },
      { name: "Out/22", value: 39000 },
      { name: "Nov/22", value: 42000 },
      { name: "Dez/22", value: 48000 },
      { name: "Jan/23", value: 38000 },
      { name: "Fev/23", value: 42000 },
      { name: "Mar/23", value: 40000 },
      { name: "Abr/23", value: 45000 },
      { name: "Mai/23", value: 52000 },
      { name: "Jun/23", value: 58000 },
    ],
  }

  // Dados simulados para vendas por categoria
  const vendasPorCategoria = [
    { name: "Eletrônicos", value: 120000 },
    { name: "Móveis", value: 85000 },
    { name: "Decoração", value: 65000 },
    { name: "Utensílios", value: 45000 },
    { name: "Outros", value: 35000 },
  ]

  // Dados simulados para clientes por região
  const clientesPorRegiao = [
    { name: "Sudeste", value: 450 },
    { name: "Sul", value: 280 },
    { name: "Nordeste", value: 220 },
    { name: "Centro-Oeste", value: 180 },
    { name: "Norte", value: 120 },
  ]

  // Dados simulados para comparação de vendas ano atual vs anterior
  const comparacaoVendas = {
    atual: [
      { name: "Jan", atual: 38000, anterior: 32000 },
      { name: "Fev", atual: 42000, anterior: 35000 },
      { name: "Mar", atual: 40000, anterior: 38000 },
      { name: "Abr", atual: 45000, anterior: 36000 },
      { name: "Mai", atual: 52000, anterior: 40000 },
      { name: "Jun", atual: 58000, anterior: 45000 },
    ],
    anterior: [
      { name: "Jul", atual: 55000, anterior: 42000 },
      { name: "Ago", atual: 53000, anterior: 44000 },
      { name: "Set", atual: 58000, anterior: 40000 },
      { name: "Out", atual: 62000, anterior: 48000 },
      { name: "Nov", atual: 68000, anterior: 52000 },
      { name: "Dez", atual: 75000, anterior: 60000 },
    ],
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Estatísticas</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Período
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Exportar Relatório
            </Button>
          </div>
        </div>

        <Tabs defaultValue="vendas">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vendas">Vendas</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="vendas" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Análise de Vendas</h2>
              <Select value={periodoVendas} onValueChange={setPeriodoVendas}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Últimos 3 meses</SelectItem>
                  <SelectItem value="6m">Últimos 6 meses</SelectItem>
                  <SelectItem value="12m">Últimos 12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Vendas por Período</CardTitle>
                <CardDescription>Análise de vendas ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={vendasPorPeriodo[periodoVendas as keyof typeof vendasPorPeriodo]}
                  xKey="name"
                  yKey="value"
                  height={350}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Categoria</CardTitle>
                  <CardDescription>Distribuição de vendas por categoria de produto</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart data={vendasPorCategoria} height={300} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Comparação Anual</CardTitle>
                      <CardDescription>Ano atual vs. ano anterior</CardDescription>
                    </div>
                    <Select value={comparacaoAno} onValueChange={setComparacaoAno}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="atual">1º Semestre</SelectItem>
                        <SelectItem value="anterior">2º Semestre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={comparacaoVendas[comparacaoAno as keyof typeof comparacaoVendas].map((item) => ({
                      name: item.name,
                      value: item.atual,
                      anterior: item.anterior,
                    }))}
                    xKey="name"
                    yKey="value"
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Desempenho</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Ticket Médio</h3>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">R$ 850,00</p>
                    <p className="text-sm text-green-500 mt-1">+12% vs mês anterior</p>
                  </div>

                  <div className="flex flex-col p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Taxa de Conversão</h3>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">23,5%</p>
                    <p className="text-sm text-green-500 mt-1">+3,2% vs mês anterior</p>
                  </div>

                  <div className="flex flex-col p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Vendas por Vendedor</h3>
                      <ArrowUpDown className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">R$ 32.450,00</p>
                    <p className="text-sm text-amber-500 mt-1">-0,5% vs mês anterior</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="produtos" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>Top 10 produtos por volume de vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { name: "Smartphone XYZ", value: 120 },
                    { name: "Notebook Pro", value: 95 },
                    { name: "Smart TV 55\"", value: 82 },
                    { name: "Fone Bluetooth", value: 78 },
                    { name: "Tablet Ultra", value: 65 },
                    { name: "Monitor 27\"", value: 58 },
                    { name: "Câmera Digital", value: 45 },
                    { name: "Impressora Laser", value: 42 },
                    { name: "Mouse Gamer", value: 38 },
                    { name: "Teclado Mecânico", value: 35 },
                  ]}
                  xKey="name"
                  yKey="value"
                  height={350}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Estoque</CardTitle>
                  <CardDescription>Produtos por categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart
                    data={[
                      { name: "Eletrônicos", value: 450 },
                      { name: "Móveis", value: 320 },
                      { name: "Decoração", value: 280 },
                      { name: "Utensílios", value: 220 },
                      { name: "Outros", value: 180 },
                    ]}
                    height={300}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Giro de Estoque</CardTitle>
                  <CardDescription>Taxa de rotatividade por categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={[
                      { name: "Eletrônicos", value: 4.8 },
                      { name: "Móveis", value: 2.3 },
                      { name: "Decoração", value: 3.1 },
                      { name: "Utensílios", value: 3.7 },
                      { name: "Outros", value: 2.5 },
                    ]}
                    xKey="name"
                    yKey="value"
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clientes" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Análise de Clientes</h2>
              <Select value={periodoClientes} onValueChange={setPeriodoClientes}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Últimos 3 meses</SelectItem>
                  <SelectItem value="6m">Últimos 6 meses</SelectItem>
                  <SelectItem value="12m">Últimos 12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Novos Clientes</CardTitle>
                  <CardDescription>Aquisição de clientes ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart
                    data={[
                      { name: "Jan", value: 45 },
                      { name: "Fev", value: 52 },
                      { name: "Mar", value: 48 },
                      { name: "Abr", value: 58 },
                      { name: "Mai", value: 62 },
                      { name: "Jun", value: 70 },
                    ]}
                    xKey="name"
                    yKey="value"
                    height={300}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Clientes por Região</CardTitle>
                  <CardDescription>Distribuição geográfica de clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart data={clientesPorRegiao} height={300} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Valor Médio de Compra por Segmento</CardTitle>
                <CardDescription>Análise de ticket médio por tipo de cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { name: "Varejo", value: 850 },
                    { name: "Atacado", value: 3200 },
                    { name: "Corporativo", value: 5800 },
                    { name: "E-commerce", value: 720 },
                    { name: "Parceiros", value: 2400 },
                  ]}
                  xKey="name"
                  yKey="value"
                  height={350}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Receitas vs Despesas</CardTitle>
                <CardDescription>Comparativo mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { name: "Jan", receitas: 58000, despesas: 42000 },
                    { name: "Fev", receitas: 62000, despesas: 45000 },
                    { name: "Mar", receitas: 60000, despesas: 43000 },
                    { name: "Abr", receitas: 65000, despesas: 46000 },
                    { name: "Mai", receitas: 72000, despesas: 48000 },
                    { name: "Jun", receitas: 78000, despesas: 52000 },
                  ].map((item) => ({
                    name: item.name,
                    value: item.receitas - item.despesas,
                  }))}
                  xKey="name"
                  yKey="value"
                  height={350}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Margem de Lucro</CardTitle>
                  <CardDescription>Percentual por categoria de produto</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={[
                      { name: "Eletrônicos", value: 32 },
                      { name: "Móveis", value: 45 },
                      { name: "Decoração", value: 52 },
                      { name: "Utensílios", value: 38 },
                      { name: "Outros", value: 42 },
                    ]}
                    xKey="name"
                    yKey="value"
                    height={300}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Despesas</CardTitle>
                  <CardDescription>Principais categorias de despesas</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart
                    data={[
                      { name: "Pessoal", value: 45000 },
                      { name: "Operacional", value: 32000 },
                      { name: "Marketing", value: 18000 },
                      { name: "Impostos", value: 25000 },
                      { name: "Outros", value: 12000 },
                    ]}
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}