"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { useToast } from "@/hooks/use-toast"

interface ClientesReport {
  total_clientes: number
  novos_clientes_mes: number
  clientes_ativos: number
  ticket_medio: number
  clientes_por_regiao: {
    regiao: string
    quantidade: number
    percentual: number
  }[]
  melhores_clientes: {
    nome: string
    total_compras: number
    valor_total: number
    ultima_compra: string
  }[]
  segmentacao: {
    segmento: string
    quantidade: number
    valor_total: number
  }[]
}

export default function RelatorioClientesPage() {
  const [dados, setDados] = useState<ClientesReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch('/api/relatorios/clientes')
        if (!response.ok) {
          throw new Error('Falha ao carregar relatório de clientes')
        }
        const data = await response.json()
        setDados(data)
      } catch (error) {
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar o relatório de clientes',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDados()
  }, [toast])

  const regiaoChartData = {
    labels: dados?.clientes_por_regiao.map(r => r.regiao) || [],
    datasets: [
      {
        data: dados?.clientes_por_regiao.map(r => r.quantidade) || [],
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

  const segmentacaoChartData = {
    labels: dados?.segmentacao.map(s => s.segmento) || [],
    datasets: [
      {
        label: 'Quantidade de Clientes',
        data: dados?.segmentacao.map(s => s.quantidade) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Valor Total (R$)',
        data: dados?.segmentacao.map(s => s.valor_total) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Relatório de Clientes</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Total de Clientes</h3>
              <p className="text-2xl font-bold text-blue-600">
                {dados?.total_clientes || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Novos Clientes (Mês)</h3>
              <p className="text-2xl font-bold text-green-600">
                {dados?.novos_clientes_mes || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Clientes Ativos</h3>
              <p className="text-2xl font-bold text-purple-600">
                {dados?.clientes_ativos || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Ticket Médio</h3>
              <p className="text-2xl font-bold text-orange-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(dados?.ticket_medio || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Distribuição por Região</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Carregando...</p>
                </div>
              ) : (
                <div>
                  <PieChart data={regiaoChartData} />
                  <div className="mt-4 space-y-2">
                    {dados?.clientes_por_regiao.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.regiao}</span>
                        <span className="text-blue-600">
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
              <h3 className="text-lg font-medium mb-4">Segmentação de Clientes</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Carregando...</p>
                </div>
              ) : (
                <BarChart data={segmentacaoChartData} />
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Melhores Clientes</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total de Compras</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Última Compra</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : dados?.melhores_clientes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Nenhum dado encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    dados?.melhores_clientes.map((cliente, index) => (
                      <TableRow key={index}>
                        <TableCell>{cliente.nome}</TableCell>
                        <TableCell>{cliente.total_compras}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(cliente.valor_total)}
                        </TableCell>
                        <TableCell>
                          {new Date(cliente.ultima_compra).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}