"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { LineChart } from "@/components/charts/line-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { useToast } from "@/hooks/use-toast"

interface VendasReport {
  data: string
  total_vendas: number
  quantidade_pedidos: number
  ticket_medio: number
  produtos_mais_vendidos: {
    nome: string
    quantidade: number
    valor_total: number
  }[]
}

export default function RelatorioVendasPage() {
  const [dados, setDados] = useState<VendasReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch('/api/relatorios/vendas')
        if (!response.ok) {
          throw new Error('Falha ao carregar relatório de vendas')
        }
        const data = await response.json()
        setDados(data)
      } catch (error) {
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar o relatório de vendas',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDados()
  }, [toast])

  const vendasChartData = {
    labels: dados.map(d => new Date(d.data).toLocaleDateString('pt-BR')),
    datasets: [
      {
        label: 'Total de Vendas',
        data: dados.map(d => d.total_vendas),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
    ],
  }

  const produtosChartData = {
    labels: dados[0]?.produtos_mais_vendidos.map(p => p.nome) || [],
    datasets: [
      {
        data: dados[0]?.produtos_mais_vendidos.map(p => p.valor_total) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
      },
    ],
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Relatório de Vendas</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Total de Vendas</h3>
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(dados.reduce((acc, curr) => acc + curr.total_vendas, 0))}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Quantidade de Pedidos</h3>
              <p className="text-2xl font-bold text-green-600">
                {dados.reduce((acc, curr) => acc + curr.quantidade_pedidos, 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Ticket Médio</h3>
              <p className="text-2xl font-bold text-purple-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(
                  dados.reduce((acc, curr) => acc + curr.ticket_medio, 0) / dados.length || 0
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Evolução das Vendas</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Carregando...</p>
                </div>
              ) : (
                <LineChart data={vendasChartData} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Produtos Mais Vendidos</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Carregando...</p>
                </div>
              ) : (
                <PieChart data={produtosChartData} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}