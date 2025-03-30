"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

interface ProdutosReport {
  total_produtos: number
  valor_total_estoque: number
  produtos_baixo_estoque: number
  categorias: {
    nome: string
    quantidade: number
    valor_total: number
  }[]
  produtos_mais_vendidos: {
    nome: string
    quantidade: number
    valor_total: number
    categoria: string
  }[]
}

export default function RelatorioProdutosPage() {
  const [dados, setDados] = useState<ProdutosReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch('/api/relatorios/produtos')
        if (!response.ok) {
          throw new Error('Falha ao carregar relatório de produtos')
        }
        const data = await response.json()
        setDados(data)
      } catch (error) {
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar o relatório de produtos',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDados()
  }, [toast])

  const categoriasChartData = {
    labels: dados?.categorias.map(c => c.nome) || [],
    datasets: [
      {
        label: 'Quantidade por Categoria',
        data: dados?.categorias.map(c => c.quantidade) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  }

  const valorCategoriasChartData = {
    labels: dados?.categorias.map(c => c.nome) || [],
    datasets: [
      {
        data: dados?.categorias.map(c => c.valor_total) || [],
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
        <h1 className="text-2xl font-bold">Relatório de Produtos</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Total de Produtos</h3>
              <p className="text-2xl font-bold text-blue-600">
                {dados?.total_produtos || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Valor Total em Estoque</h3>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(dados?.valor_total_estoque || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Produtos com Baixo Estoque</h3>
              <p className="text-2xl font-bold text-red-600">
                {dados?.produtos_baixo_estoque || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Quantidade por Categoria</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Carregando...</p>
                </div>
              ) : (
                <BarChart data={categoriasChartData} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Valor por Categoria</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Carregando...</p>
                </div>
              ) : (
                <PieChart data={valorCategoriasChartData} />
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Produtos Mais Vendidos</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Quantidade Vendida</TableHead>
                    <TableHead>Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : dados?.produtos_mais_vendidos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Nenhum dado encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    dados?.produtos_mais_vendidos.map((produto, index) => (
                      <TableRow key={index}>
                        <TableCell>{produto.nome}</TableCell>
                        <TableCell>{produto.categoria}</TableCell>
                        <TableCell>{produto.quantidade}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(produto.valor_total)}
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