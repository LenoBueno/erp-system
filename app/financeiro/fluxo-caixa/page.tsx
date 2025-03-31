"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartFactory } from "@/components/charts/chart-factory"
import { DataTable } from "@/components/ui/data-table"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CashFlowData } from "@/lib/types"
import { Download, Filter, PlusCircle, ArrowUp, ArrowDown, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Dados mockados para demonstração
const mockCashFlowData: CashFlowData[] = [
  {
    date: new Date("2023-04-01"),
    description: "Venda #12345",
    category: "Vendas",
    type: "income",
    amount: 1500.00,
    payment_method: "PIX",
    status: "completed"
  },
  {
    date: new Date("2023-04-02"),
    description: "Pagamento de fornecedor",
    category: "Fornecedores",
    type: "expense",
    amount: 750.00,
    payment_method: "Transferência",
    status: "completed"
  },
  {
    date: new Date("2023-04-03"),
    description: "Venda #12346",
    category: "Vendas",
    type: "income",
    amount: 2300.00,
    payment_method: "Cartão de Crédito",
    status: "completed"
  },
  {
    date: new Date("2023-04-05"),
    description: "Pagamento de aluguel",
    category: "Custos Fixos",
    type: "expense",
    amount: 3500.00,
    payment_method: "Boleto",
    status: "completed"
  },
  {
    date: new Date("2023-04-08"),
    description: "Pagamento de energia",
    category: "Custos Fixos",
    type: "expense",
    amount: 430.00,
    payment_method: "Boleto",
    status: "completed"
  },
  {
    date: new Date("2023-04-10"),
    description: "Venda #12347",
    category: "Vendas",
    type: "income",
    amount: 980.00,
    payment_method: "Dinheiro",
    status: "completed"
  },
  {
    date: new Date("2023-04-15"),
    description: "Venda #12348",
    category: "Vendas",
    type: "income",
    amount: 3200.00,
    payment_method: "PIX",
    status: "completed"
  },
  {
    date: new Date("2023-04-20"),
    description: "Pagamento de funcionários",
    category: "Pessoal",
    type: "expense",
    amount: 8500.00,
    payment_method: "Transferência",
    status: "completed"
  },
  {
    date: new Date("2023-04-25"),
    description: "Despesa com marketing",
    category: "Marketing",
    type: "expense",
    amount: 1200.00,
    payment_method: "Cartão de Crédito",
    status: "completed"
  },
  {
    date: new Date("2023-04-28"),
    description: "Venda #12349",
    category: "Vendas",
    type: "income",
    amount: 4500.00,
    payment_method: "Transferência",
    status: "completed"
  },
  {
    date: new Date("2023-04-30"),
    description: "Pagamento de impostos",
    category: "Impostos",
    type: "expense",
    amount: 2800.00,
    payment_method: "Boleto",
    status: "pending"
  }
];

interface DailyCashFlow {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

interface CategorySummary {
  category: string;
  income: number;
  expense: number;
}

export default function FluxoCaixaPage() {
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([])
  const [filteredData, setFilteredData] = useState<CashFlowData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Em um ambiente real, isso seria uma chamada para a API
        // const response = await fetch('/api/financeiro/fluxo-caixa')
        // if (!response.ok) {
        //   throw new Error('Falha ao carregar dados do fluxo de caixa')
        // }
        // const data = await response.json()
        
        // Usando dados mockados para demonstração
        const data = mockCashFlowData
        setCashFlowData(data)
        setFilteredData(data)
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

  useEffect(() => {
    // Filtragem de dados com base nos critérios selecionados
    const result = cashFlowData.filter(item => {
      const matchesSearch = !searchTerm || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !typeFilter || item.type === typeFilter;
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      const matchesStatus = !statusFilter || item.status === statusFilter;
      
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
    
    setFilteredData(result);
  }, [cashFlowData, searchTerm, typeFilter, categoryFilter, statusFilter]);

  // Cálculos de totais
  const totalIncome = filteredData
    .filter(item => item.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalExpense = filteredData
    .filter(item => item.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalBalance = totalIncome - totalExpense;

  // Preparação de dados para gráficos
  const dailyCashFlow: DailyCashFlow[] = [];
  const categorySummary: CategorySummary[] = [];
  
  // Processamento de dados para o fluxo de caixa diário
  const dateMap = new Map<string, DailyCashFlow>();
  
  filteredData.forEach(item => {
    const dateStr = item.date.toISOString().split('T')[0];
    
    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, {
        date: dateStr,
        income: 0,
        expense: 0,
        balance: 0
      });
    }
    
    const dailyData = dateMap.get(dateStr)!;
    
    if (item.type === "income") {
      dailyData.income += item.amount;
    } else {
      dailyData.expense += item.amount;
    }
    
    dailyData.balance = dailyData.income - dailyData.expense;
  });
  
  dateMap.forEach(value => dailyCashFlow.push(value));
  dailyCashFlow.sort((a, b) => a.date.localeCompare(b.date));

  // Processamento de dados por categoria
  const categoryMap = new Map<string, CategorySummary>();
  
  filteredData.forEach(item => {
    if (!categoryMap.has(item.category)) {
      categoryMap.set(item.category, {
        category: item.category,
        income: 0,
        expense: 0
      });
    }
    
    const categoryData = categoryMap.get(item.category)!;
    
    if (item.type === "income") {
      categoryData.income += item.amount;
    } else {
      categoryData.expense += item.amount;
    }
  });
  
  categoryMap.forEach(value => categorySummary.push(value));

  // Configuração das colunas do DataTable
  const columns = [
    {
      key: "date",
      header: "Data",
      formatter: (value: Date) => value.toLocaleDateString('pt-BR'),
      sortable: true
    },
    {
      key: "description",
      header: "Descrição",
      sortable: true
    },
    {
      key: "category",
      header: "Categoria",
      sortable: true
    },
    {
      key: "type",
      header: "Tipo",
      formatter: (value: string) => (
        <Badge className={value === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {value === "income" ? "Receita" : "Despesa"}
        </Badge>
      ),
      sortable: true
    },
    {
      key: "amount",
      header: "Valor",
      formatter: (value: number, row: CashFlowData) => (
        <span className={row.type === "income" ? "text-green-600" : "text-red-600"}>
          {formatCurrency(value)}
        </span>
      ),
      sortable: true
    },
    {
      key: "status",
      header: "Status",
      formatter: (value: string) => (
        <Badge className={
          value === "completed" 
            ? "bg-green-100 text-green-800" 
            : value === "pending" 
              ? "bg-yellow-100 text-yellow-800" 
              : "bg-red-100 text-red-800"
        }>
          {value === "completed" ? "Concluído" : value === "pending" ? "Pendente" : "Cancelado"}
        </Badge>
      ),
      sortable: true
    }
  ];

  // Ações para cada item da tabela
  const actions = [
    {
      label: "Detalhes",
      onClick: (item: CashFlowData) => {
        alert(`Visualizando detalhes de: ${item.description}`);
      }
    },
    {
      label: "Editar",
      onClick: (item: CashFlowData) => {
        alert(`Editando transação: ${item.description}`);
      }
    }
  ];

  // Lista de categorias únicas para o filtro
  const categories = Array.from(new Set(cashFlowData.map(item => item.category)));

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Fluxo de Caixa</h1>
            <p className="text-muted-foreground">Acompanhe e gerencie receitas e despesas</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Receitas</p>
                <h3 className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</h3>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">
                    {((totalIncome / (totalIncome + totalExpense || 1)) * 100).toFixed(1)}% do total
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <ArrowUp className="h-6 w-6 text-green-700" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Despesas</p>
                <h3 className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</h3>
                <div className="flex items-center mt-1">
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-xs text-red-500">
                    {((totalExpense / (totalIncome + totalExpense || 1)) * 100).toFixed(1)}% do total
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <ArrowDown className="h-6 w-6 text-red-700" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Total</p>
                <h3 className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(totalBalance)}
                </h3>
                <div className="flex items-center mt-1">
                  {totalBalance >= 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-xs text-blue-500">Saldo positivo</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-xs text-red-500">Saldo negativo</span>
                    </>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Lista de Transações</TabsTrigger>
            <TabsTrigger value="chart">Gráficos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                  <div className="w-full md:w-1/3">
                    <Input
                      type="text"
                      placeholder="Buscar por descrição, categoria..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="w-full md:w-1/5">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os tipos</SelectItem>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full md:w-1/5">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas as categorias</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full md:w-1/5">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os status</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="canceled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DataTable
                  data={filteredData}
                  columns={columns}
                  actions={actions}
                  pagination={{
                    pageSize: 10,
                    currentPage: 1,
                    totalItems: filteredData.length,
                    onPageChange: (page) => {
                      console.log(`Mudando para página ${page}`);
                      // Implementação da paginação real seria aqui
                    },
                  }}
                  emptyMessage="Nenhuma transação encontrada"
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chart">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Fluxo de Caixa</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartFactory
                    type="line"
                    data={{
                      labels: dailyCashFlow.map(item => {
                        const date = new Date(item.date);
                        return date.toLocaleDateString('pt-BR');
                      }),
                      datasets: [
                        {
                          label: "Receitas",
                          data: dailyCashFlow.map(item => item.income),
                          borderColor: "rgb(34, 197, 94)",
                          backgroundColor: "rgba(34, 197, 94, 0.1)",
                          borderWidth: 2,
                          fill: false
                        },
                        {
                          label: "Despesas",
                          data: dailyCashFlow.map(item => item.expense),
                          borderColor: "rgb(239, 68, 68)",
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          borderWidth: 2,
                          fill: false
                        },
                        {
                          label: "Saldo",
                          data: dailyCashFlow.map(item => item.balance),
                          borderColor: "rgb(59, 130, 246)",
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          borderWidth: 2,
                          fill: true
                        }
                      ]
                    }}
                    options={{
                      height: 300,
                      valuePrefix: "R$",
                      showLegend: true,
                      showGrid: true
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Receitas vs Despesas por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartFactory
                    type="bar"
                    data={{
                      labels: categorySummary.map(item => item.category),
                      datasets: [
                        {
                          label: "Receitas",
                          data: categorySummary.map(item => item.income),
                          backgroundColor: "rgba(34, 197, 94, 0.7)",
                          borderColor: "rgb(34, 197, 94)",
                          borderWidth: 1
                        },
                        {
                          label: "Despesas",
                          data: categorySummary.map(item => item.expense),
                          backgroundColor: "rgba(239, 68, 68, 0.7)",
                          borderColor: "rgb(239, 68, 68)",
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      height: 300,
                      valuePrefix: "R$",
                      showLegend: true,
                      showGrid: true
                    }}
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