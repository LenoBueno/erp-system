"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { DollarSign, Users, ShoppingBag, Package, ArrowUp, ArrowDown } from "lucide-react"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

