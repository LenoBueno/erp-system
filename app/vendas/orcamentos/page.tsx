\"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Eye, FileText, Send, History } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Quote {
  id: number
  quote_number: string
  customer_name: string
  total_amount: number
  status: "draft" | "sent" | "approved" | "rejected" | "expired"
  created_at: string
  valid_until: string
  revision: number
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 1,
      quote_number: "ORC-2023-001",
      customer_name: "Empresa ABC Ltda",
      total_amount: 12500,
      status: "sent",
      created_at: "2023-06-10T10:30:00",
      valid_until: "2023-07-10",
      revision: 1
    },
    {
      id: 2,
      quote_number: "ORC-2023-002",
      customer_name: "Comércio XYZ S.A.",
      total_amount: 8750,
      status: "approved",
      created_at: "2023-06-05T14:15:00",
      valid_until: "2023-07-05",
      revision: 2
    },
    {
      id: 3,
      quote_number: "ORC-2023-003",
      customer_name: "Indústria 123",
      total_amount: 15300,
      status: "draft",
      created_at: "2023-06-12T09:45:00",
      valid_until: "2023-07-12",
      revision: 1
    },
    {
      id: 4,
      quote_number: "ORC-2023-004",
      customer_name: "Distribuidora JKL",
      total_amount: 6200,
      status: "rejected",
      created_at: "2023-05-28T16:20:00",
      valid_until: "2023-06-28",
      revision: 3
    },
    {
      id: 5,
      quote_number: "ORC-2023-005",
      customer_name: "Serviços Tech",
      total_amount: 9800,
      status: "expired",
      created_at: "2023-05-15T11:10:00",
      valid_until: "2023-06-15",
      revision: 1
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Simulação de carregamento de dados da API
  useEffect(() => {
    // Em um cenário real, aqui seria feita uma chamada à API
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            Rascunho
          </Badge>
        )
      case "sent":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">
            Enviado
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
            Aprovado
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
            Rejeitado
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
            Expirado
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const handleCreateQuote = () => {
    // Em um cenário real, aqui seria feita uma navegação para a página de criação de orçamento
    toast({
      title: "Criar novo orçamento",
      description: "Redirecionando para o formulário de criação de orçamento",
    })
    // router.push("/vendas/orcamentos/novo")
  }

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote)
    setIsDialogOpen(true)
  }

  const handleSendQuote = (quote: Quote) => {
    toast({
      title: "Orçamento enviado",
      description: `O orçamento ${quote.quote_number} foi enviado para ${quote.customer_name}`,
    })
  }

  const handleViewHistory = (quote: Quote) => {
    setSelectedQuote(quote)
    setIsHistoryDialogOpen(true)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <Button onClick={handleCreateQuote} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Orçamento
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por número ou cliente..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="sent">Enviado</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                    <SelectItem value="expired">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p>Carregando orçamentos...</p>
              </div>
            ) : filteredQuotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground mb-4">Nenhum orçamento encontrado</p>
                <Button onClick={handleCreateQuote} variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Novo Orçamento
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Revisão</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.quote_number}</TableCell>
                        <TableCell>{quote.customer_name}</TableCell>
                        <TableCell>{formatDate(quote.created_at)}</TableCell>
                        <TableCell>{formatDate(quote.valid_until)}</TableCell>
                        <TableCell>{formatCurrency(quote.total_amount)}</TableCell>
                        <TableCell>v{quote.revision}</TableCell>
                        <TableCell>{getStatusBadge(quote.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewQuote(quote)}
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {quote.status === "draft" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSendQuote(quote)}
                                title="Enviar"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewHistory(quote)}
                              title="Histórico de revisões"
                            >
                              <History className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de visualização do orçamento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Orçamento</DialogTitle>
            <DialogDescription>
              Orçamento {selectedQuote?.quote_number} - Revisão v{selectedQuote?.revision}
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Cliente</Label>
                  <p className="font-medium">{selectedQuote.customer_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedQuote.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Criação</Label>
                  <p className="font-medium">{formatDate(selectedQuote.created_at)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Válido até</Label>
                  <p className="font-medium">{formatDate(selectedQuote.valid_until)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor Total</Label>
                  <p className="font-medium">{formatCurrency(selectedQuote.total_amount)}</p>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Itens do Orçamento</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-right">Qtd</TableHead>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Itens simulados */}
                    <TableRow>
                      <TableCell>Notebook Dell Inspiron 15</TableCell>
                      <TableCell className="text-right">2</TableCell>
                      <TableCell className="text-right">R$ 4.500,00</TableCell>
                      <TableCell className="text-right">R$ 9.000,00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Monitor Dell 24"</TableCell>
                      <TableCell className="text-right">3</TableCell>
                      <TableCell className="text-right">R$ 1.200,00</TableCell>
                      <TableCell className="text-right">R$ 3.600,00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <Label className="text-muted-foreground">Observações</Label>
                <Textarea readOnly className="mt-1" value="Orçamento válido para pagamento à vista ou em até 3x sem juros." />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Fechar
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Imprimir
              </Button>
              {selectedQuote?.status === "draft" && (
                <Button className="flex items-center gap-2" onClick={() => handleSendQuote(selectedQuote)}>
                  <Send className="h-4 w-4" />
                  Enviar
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de histórico de revisões */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico de Revisões</DialogTitle>
            <DialogDescription>
              Orçamento {selectedQuote?.quote_number} - Histórico de alterações
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Revisão</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Alterado por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Histórico simulado */}
                  <TableRow>
                    <TableCell>v{selectedQuote.revision}</TableCell>
                    <TableCell>{formatDate(selectedQuote.created_at)}</TableCell>
                    <TableCell>{formatCurrency(selectedQuote.total_amount)}</TableCell>
                    <TableCell>João Silva</TableCell>
                  </TableRow>
                  {selectedQuote.revision > 1 && (
                    <>
                      <TableRow>
                        <TableCell>v{selectedQuote.revision - 1}</TableCell>
                        <TableCell>{formatDate(new Date(new Date(selectedQuote.created_at).setDate(new Date(selectedQuote.created_at).getDate() - 2)).toISOString())}</TableCell>
                        <TableCell>{formatCurrency(selectedQuote.total_amount * 0.95)}</TableCell>
                        <TableCell>Maria Oliveira</TableCell>
                      </TableRow>
                      {selectedQuote.revision > 2 && (
                        <TableRow>
                          <TableCell>v{selectedQuote.revision - 2}</TableCell>
                          <TableCell>{formatDate(new Date(new Date(selectedQuote.created_at).setDate(new Date(selectedQuote.created_at).getDate() - 5)).toISOString())}</TableCell>
                          <TableCell>{formatCurrency(selectedQuote.total_amount * 0.9)}</TableCell>
                          <TableCell>Carlos Santos</TableCell>
                        </TableRow>
                      )}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}