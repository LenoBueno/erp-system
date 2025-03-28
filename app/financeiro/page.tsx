"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/charts"
import { DollarSign, ArrowUpRight, ArrowDownRight, Calendar, FileText, AlertCircle } from "lucide-react"

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState("visao-geral")

  // Dados simulados para o fluxo de caixa
  const fluxoCaixaData = [
    { name: "Jan", receitas: 45000, despesas: 32000 },
    { name: "Fev", receitas: 52000, despesas: 36000 },
    { name: "Mar", receitas: 49000, despesas: 33000 },
    { name: "Abr", receitas: 58000, despesas: 38000 },
    { name: "Mai", receitas: 55000, despesas: 35000 },
    { name: "Jun", receitas: 62000, despesas: 39000 },
  ]

  // Dados simulados para contas a receber
  const contasReceberData = [
    { id: 1, cliente: "Empresa ABC Ltda", valor: 5800, vencimento: "15/06/2023", status: "Pendente" },
    { id: 2, cliente: "Comércio XYZ S.A.", valor: 3200, vencimento: "22/06/2023", status: "Pendente" },
    { id: 3, cliente: "Indústria 123", valor: 7500, vencimento: "05/06/2023", status: "Atrasado" },
    { id: 4, cliente: "Distribuidora JKL", valor: 4200, vencimento: "30/05/2023", status: "Pago" },
    { id: 5, cliente: "Serviços Tech", valor: 2800, vencimento: "10/06/2023", status: "Pendente" },
  ]

  // Dados simulados para contas a pagar
  const contasPagarData = [
    { id: 1, fornecedor: "Distribuidora de Eletrônicos Ltda", valor: 3500, vencimento: "10/06/2023", status: "Pendente" },
    { id: 2, fornecedor: "Suprimentos Industriais S.A.", valor: 1800, vencimento: "15/06/2023", status: "Pendente" },
    { id: 3, fornecedor: "Tech Parts Importadora", valor: 4200, vencimento: "05/06/2023", status: "Atrasado" },
    { id: 4, fornecedor: "Serviços de Internet", valor: 1200, vencimento: "20/06/2023", status: "Pendente" },
    { id: 5, fornecedor: "Aluguel Comercial", valor: 5000, vencimento: "01/06/2023", status: "Pago" },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Relatórios
            </Button>
            <Button className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Nova Transação
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Contas a Receber</p>
                  <h3 className="text-2xl font-bold">R$ 23.500,00</h3>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Vencendo hoje:</span>
                  <span className="ml-2 font-medium">R$ 3.200,00</span>
                </div>
                <div>
                  <span className="text-red-500 font-medium">R$ 7.500,00 atrasados</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Contas a Pagar</p>
                  <h3 className="text-2xl font-bold">R$ 15.700,00</h3>
                </div>
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                  <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Vencendo hoje:</span>
                  <span className="ml-2 font-medium">R$ 1.200,00</span>
                </div>
                <div>
                  <span className="text-red-500 font-medium">R$ 4.200,00 atrasados</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Atual</p>
                  <h3 className="text-2xl font-bold">R$ 78.350,00</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Previsão para 30 dias:</span>
                  <span className="ml-2 font-medium">R$ 86.150,00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
                <TabsTrigger value="contas-receber">Contas a Receber</TabsTrigger>
                <TabsTrigger value="contas-pagar">Contas a Pagar</TabsTrigger>
                <TabsTrigger value="fluxo-caixa">Fluxo de Caixa</TabsTrigger>
                <TabsTrigger value="nfe">Notas Fiscais</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="visao-geral" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Fluxo de Caixa - Últimos 6 meses</h3>
                <LineChart
                  data={fluxoCaixaData.map((item) => ({
                    name: item.name,
                    receitas: item.receitas,
                    despesas: item.despesas,
                  }))}
                  xKey="name"
                  yKey="receitas"
                  height={300}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Alertas Financeiros</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 border rounded-md bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Faturas Vencidas</h4>
                        <p className="text-sm text-muted-foreground">Existem 2 faturas vencidas totalizando R$ 11.700,00</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-md bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Saldo Negativo Previsto</h4>
                        <p className="text-sm text-muted-foreground">Previsão de saldo negativo em 45 dias se todas as despesas forem mantidas</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Próximos Vencimentos</h3>
                  <div className="space-y-3">
                    {contasReceberData
                      .filter((conta) => conta.status === "Pendente")
                      .slice(0, 3)
                      .map((conta) => (
                        <div key={conta.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{conta.cliente}</p>
                            <p className="text-sm text-muted-foreground">Vencimento: {conta.vencimento}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                            <p className="text-sm text-green-600 dark:text-green-400">A receber</p>
                          </div>
                        </div>
                      ))}
                    {contasPagarData
                      .filter((conta) => conta.status === "Pendente")
                      .slice(0, 2)
                      .map((conta) => (
                        <div key={conta.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{conta.fornecedor}</p>
                            <p className="text-sm text-muted-foreground">Vencimento: {conta.vencimento}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                            <p className="text-sm text-red-600 dark:text-red-400">A pagar</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contas-receber" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Contas a Receber</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Exportar
                  </Button>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Nova Conta
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Cliente</th>
                        <th className="text-left p-3">Valor</th>
                        <th className="text-left p-3">Vencimento</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-right p-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contasReceberData.map((conta) => (
                        <tr key={conta.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">{conta.cliente}</td>
                          <td className="p-3">R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                          <td className="p-3">{conta.vencimento}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${conta.status === "Pago"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : conta.status === "Atrasado"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                }`}
                            >
                              {conta.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              Detalhes
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              Receber
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contas-pagar" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Contas a Pagar</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Exportar
                  </Button>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Nova Despesa
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Fornecedor</th>
                        <th className="text-left p-3">Valor</th>
                        <th className="text-left p-3">Vencimento</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-right p-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contasPagarData.map((conta) => (
                        <tr key={conta.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">{conta.fornecedor}</td>
                          <td className="p-3">R$ {conta.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                          <td className="p-3">{conta.vencimento}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${conta.status === "Pago"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : conta.status === "Atrasado"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                }`}
                            >
                              {conta.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              Detalhes
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              Pagar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fluxo-caixa" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Fluxo de Caixa</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Período
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <BarChart
                    data={fluxoCaixaData.map((item) => ({
                      name: item.name,
                      value: item.receitas - item.despesas,
                    }))}
                    xKey="name"
                    yKey="value"
                    height={300}
                  />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Receitas Mensais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      data={fluxoCaixaData.map((item) => ({
                        name: item.name,
                        value: item.receitas,
                      }))}
                      xKey="name"
                      yKey="value"
                      height={250}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Despesas Mensais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      data={fluxoCaixaData.map((item) => ({
                        name: item.name,
                        value: item.despesas,
                      }))}
                      xKey="name"
                      yKey="value"
                      height={250}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="nfe" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Notas Fiscais Eletrônicas</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Exportar XML
                  </Button>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Emitir NFe
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Número</th>
                        <th className="text-left p-3">Cliente/Fornecedor</th>
                        <th className="text-left p-3">Valor</th>
                        <th className="text-left p-3">Emissão</th>
                        <th className="text-left p-3">Tipo</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-right p-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">NF-e 000123</td>
                        <td className="p-3">Empresa ABC Ltda</td>
                        <td className="p-3">R$ 5.800,00</td>
                        <td className="p-3">10/06/2023</td>
                        <td className="p-3">Saída</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Autorizada
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            DANFE
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            XML
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">NF-e 000122</td>
                        <td className="p-3">Comércio XYZ S.A.</td>
                        <td className="p-3">R$ 3.200,00</td>
                        <td className="p-3">08/06/2023</td>
                        <td className="p-3">Saída</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Autorizada
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            DANFE
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            XML
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">NF-e 000121</td>
                        <td className="p-3">Distribuidora de Eletrônicos Ltda</td>
                        <td className="p-3">R$ 3.500,00</td>
                        <td className="p-3">05/06/2023</td>
                        <td className="p-3">Entrada</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Autorizada
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            DANFE
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            XML
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}