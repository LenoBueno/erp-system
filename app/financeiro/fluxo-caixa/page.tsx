"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { LineChart } from "@/components/charts/line-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { useToast } from "@/hooks/use-toast"

interface FluxoCaixa {
  data: string
  receitas: number
  despesas: number
  saldo: number
}

export default function FluxoCaixaPage() {
  const [dados, setDados] = useState<FluxoCaixa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch('/api/financeiro/fluxo-caixa')
        if (!response.ok) {
          throw new Error('Falha ao carregar dados do fluxo de caixa')
        }
        const data = await response.json()
        setDados(data)
      } catch (error) {
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar os dados do fluxo de caixa',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDados()
  }, [toast])

  const chartData = {
    labels: dados.map(d => new Date(d.data).toLocaleDateString('pt-BR')),
    datasets: [
      {
        label: 'Receitas',
        data: dados.map(d => d.receitas),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
      },
      {
        label: 'Despesas',
        data: dados.map(d => d.despesas),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      },
      {
        label: 'Saldo',
        data: dados.map(d => d.saldo),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
    ],
  }

  const barChartData = {
    labels: ['Receitas', 'Despesas', 'Saldo'],
    datasets: [
      {
        data: [
          dados.reduce((acc, curr) => acc + curr.receitas, 0),
          dados.reduce((acc, curr) => acc + curr.despesas, 0),
          dados.reduce((acc, curr) => acc + curr.saldo, 0),
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
      },
    ],
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Fluxo de Caixa</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Total Receitas</h3>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(dados.reduce((acc, curr) => acc + curr.receitas, 0))}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Total Despesas</h3>
              <p className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(dados.reduce((acc, curr) => acc + curr.despesas, 0))}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Saldo Total</h3>
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(dados.reduce((acc, curr) => acc + curr.saldo, 0))}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Evolução do Fluxo de Caixa</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Carregando...</p>
                </div>
              ) : (
                <LineChart data={chartData} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Resumo Geral</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Carregando...</p>
                </div>
              ) : (
                <BarChart data={barChartData} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}