"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, ShoppingBag, Package, ArrowUp, ArrowDown, AlertCircle, Bell, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalSales: number
  totalCustomers: number
  totalOrders: number
  totalProducts: number
  salesGrowth: number
  customersGrowth: number
  ordersGrowth: number
  productsGrowth: number
  recentSales: {
    date: string
    amount: number
  }[]
  productCategories: {
    category: string
    count: number
  }[]
  monthlySales: {
    month: string
    sales: number
  }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        if (!response.ok) {
          throw new Error("Falha ao carregar dados do dashboard")
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar dashboard",
          description: "Não foi possível carregar os dados do dashboard",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Carregando dados do dashboard...</p>
        </div>
      </MainLayout>
    )
  }

  if (!stats) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Não foi possível carregar os dados do dashboard</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendas Totais</p>
                <h3 className="text-2xl font-bold">R$ {stats.totalSales.toLocaleString("pt-BR")}</h3>
                <div className="flex items-center mt-1">
                  {stats.salesGrowth > 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-500">{stats.salesGrowth}% em relação ao mês anterior</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-xs text-red-500">
                        {Math.abs(stats.salesGrowth)}% em relação ao mês anterior
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
                <div className="flex items-center mt-1">
                  {stats.customersGrowth > 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-500">
                        {stats.customersGrowth}% em relação ao mês anterior
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-xs text-red-500">
                        {Math.abs(stats.customersGrowth)}% em relação ao mês anterior
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                <div className="flex items-center mt-1">
                  {stats.ordersGrowth > 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-500">{stats.ordersGrowth}% em relação ao mês anterior</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-xs text-red-500">
                        {Math.abs(stats.ordersGrowth)}% em relação ao mês anterior
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Produtos</p>
                <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
                <div className="flex items-center mt-1">
                  {stats.productsGrowth > 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-500">{stats.productsGrowth}% em relação ao mês anterior</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-xs text-red-500">
                        {Math.abs(stats.productsGrowth)}% em relação ao mês anterior
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Alertas */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Estoque Mínimo</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-yellow-600" />
                        <span>Notebook Dell Inspiron 15</span>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                        Estoque: 2
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-red-600" />
                        <span>Teclado Mecânico Logitech</span>
                      </div>
                      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
                        Estoque: 0
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-yellow-600" />
                        <span>Monitor Dell 24"</span>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                        Estoque: 3
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Faturas Vencidas</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-red-600" />
                          <span>Fatura #2023-156</span>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">Empresa ABC Ltda</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">R$ 7.500,00</div>
                        <div className="text-sm text-red-600">Vencida há 15 dias</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-red-600" />
                          <span>Fatura #2023-142</span>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">Indústria 123</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">R$ 4.200,00</div>
                        <div className="text-sm text-red-600">Vencida há 8 dias</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">Ver todos os alertas</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Pedidos Recentes</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-blue-600" />
                          <span>Pedido #2023-089</span>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">Distribuidora JKL</div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                        Concluído
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-blue-600" />
                          <span>Pedido #2023-090</span>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">Comércio XYZ S.A.</div>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">
                        Em Processamento
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Notas Fiscais</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span>NF-e #1234</span>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">Empresa ABC Ltda</div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                        Emitida
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span>NF-e #1235</span>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">Serviços Tech</div>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                        Pendente
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">Ver todas as notificações</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendas Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={stats.monthlySales.map((item) => ({
                  name: item.month,
                  value: item.sales,
                }))}
                xKey="name"
                yKey="value"
                height={300}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produtos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={stats.productCategories.map((item) => ({
                  name: item.category,
                  value: item.count,
                }))}
                height={300}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={stats.recentSales.map((item) => ({
                name: item.date,
                value: item.amount,
              }))}
              xKey="name"
              yKey="value"
              height={300}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

