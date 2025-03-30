"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { LineChart } from "@/components/charts/line-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { useToast } from "@/hooks/use-toast"

interface FinanceiroReport {
  receitas_totais: number
  despesas_totais: number
  lucro_liquido: number
  evolucao_mensal: {
    mes: string
    receitas: number
    despesas: number
    lucro: number
  }[]
  distribuicao_receitas: {
    categoria: string
    valor: number
    percentual: number
  }[]
  distribuicao_despesas: {
    categoria: string
    valor: number
    percentual: number
  }[]
}

export default function RelatorioFinanceiroPage() {
  const [dados, setDados] = useState<FinanceiroReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch('/api/relatorios/financeiro')
        if (!response.ok) {
          throw new Error('Falha ao carregar relatório financeiro')
        }
        const data = await response.json()
        setDados(data)
      } catch (error) {
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar o relatório financeiro',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDados()
  }, [toast])

  const evolucaoChartData = {
    labels: dados?.evolucao_mensal.map(d => d.mes) || [],
    datasets: [
      {
        label: 'Receitas',
        data: dados?.evolucao_mensal.map(d => d.receitas) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
      },
      {
        label: 'Despesas',
        data: dados?.evolucao_mensal.map(d => d.despesas) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      },
      {
        label: 'Lucro',
        data: dados?.evolucao_mensal.map(d => d.lucro) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
    ],
  }

  const receitasChartData = {
    labels: dados?.distribuicao_receitas.map(d => d.categoria) || [],
    datasets: [
      {
        data: dados?.distribuicao_receitas.map(d => d.valor) || [],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  }

  const despesasChartData = {
    labels: dados?.distribuicao_despesas.map(d => d.categoria) || [],
    datasets: [
      {
        data: dados?.distribuicao_despesas.map(d => d.valor) || [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
      },
    ],
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Relatório Financeiro</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Receitas Totais</h3>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(dados?.receitas_totais || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Despesas Totais</h3>
              <p className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(dados?.despesas_totais || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Lucro Líquido</h3>
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(dados?.lucro_liquido || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Evolução Mensal</h3>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p>Carregando...</p>
              </div>
            ) : (
              <LineChart data={evolucaoChartData} />
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Distribuição de Receitas</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Carregando...</p>
                </div>
              ) : (
                <div>
                  <PieChart data={receitasChartData} />
                  <div className="mt-4 space-y-2">
                    {dados?.distribuicao_receitas.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.categoria}</span>
                        <span className="text-green-600">
                          {item.percentual.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Distribuição de Despesas</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Carregando...</p>
                </div>
              ) : (
                <div>
                  <PieChart data={despesasChartData} />
                  <div className="mt-4 space-y-2">
                    {dados?.distribuicao_despesas.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.categoria}</span>
                        <span className="text-red-600">
                          {item.percentual.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}