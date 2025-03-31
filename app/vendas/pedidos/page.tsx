"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, FileText, Send, History } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"

interface Document {
  id: number
  number: string
  customer_name: string
  total_amount: number
  type: "order" | "quote" | "estimate"
  status: string
  payment_status?: "pending" | "paid" | "refunded"
  created_at: string
  valid_until?: string
  revision?: number
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/documents")
        if (!response.ok) {
          throw new Error("Falha ao carregar documentos")
        }
        const data = await response.json()
        setDocuments(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar documentos",
          description: "Não foi possível carregar a lista de documentos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [toast])

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "order" && doc.type === "order") ||
      (typeFilter === "quote" && doc.type === "quote") ||
      (typeFilter === "estimate" && doc.type === "estimate")
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    const matchesPayment =
      paymentFilter === "all" ||
      (doc.type !== "order") ||
      (doc.payment_status === paymentFilter)
    return matchesSearch && matchesType && matchesStatus && matchesPayment
  })

  const handleCreateNew = () => {
    router.push("/vendas/pedidos/novo")
  }

  const getStatusBadge = (status: string, type: string) => {
    if (type === "order") {
      switch (status) {
        case "pending":
          return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendente</Badge>
        case "processing":
          return <Badge className="bg-blue-500 hover:bg-blue-600">Em Processamento</Badge>
        case "completed":
          return <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>
        case "cancelled":
          return <Badge variant="outline" className="text-red-500 border-red-200">Cancelado</Badge>
        default:
          return <Badge variant="outline">{status}</Badge>
      }
    }

    if (type === "quote") {
      switch (status) {
        case "draft":
          return <Badge variant="outline">Rascunho</Badge>
        case "sent":
          return <Badge className="bg-blue-500 hover:bg-blue-600">Enviado</Badge>
        case "approved":
          return <Badge className="bg-green-500 hover:bg-green-600">Aprovado</Badge>
        case "rejected":
          return <Badge variant="outline" className="text-red-500 border-red-200">Rejeitado</Badge>
        case "expired":
          return <Badge variant="outline" className="text-amber-500 border-amber-200">Expirado</Badge>
        default:
          return <Badge variant="outline">{status}</Badge>
      }
    }

    if (type === "estimate") {
      switch (status) {
        case "pending":
          return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendente</Badge>
        case "sent":
          return <Badge className="bg-blue-500 hover:bg-blue-600">Enviada</Badge>
        case "accepted":
          return <Badge className="bg-green-500 hover:bg-green-600">Aceita</Badge>
        case "rejected":
          return <Badge variant="outline" className="text-red-500 border-red-200">Rejeitada</Badge>
        default:
          return <Badge variant="outline">{status}</Badge>
      }
    }

    return <Badge variant="outline">{status}</Badge>
  }

  const getPaymentStatusBadge = (status?: string) => {
    if (!status) return null

    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-200">Pendente</Badge>
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Pago</Badge>
      case "refunded":
        return <Badge variant="outline" className="text-blue-500 border-blue-200">Reembolsado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "order":
        return "Pedido"
      case "quote":
        return "Orçamento"
      case "estimate":
        return "Cotação"
      default:
        return type
    }
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "order":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "quote":
        return <Send className="h-4 w-4 text-green-500" />
      case "estimate":
        return <History className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Documentos de Venda</h1>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" /> Novo Documento
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por número ou cliente..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="order">Pedidos</SelectItem>
                  <SelectItem value="quote">Orçamentos</SelectItem>
                  <SelectItem value="estimate">Cotações</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="processing">Em Processamento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="sent">Enviado</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                </SelectContent>
              </Select>

              {typeFilter === "all" || typeFilter === "order" ? (
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status de Pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="refunded">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Carregando documentos...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <p className="text-muted-foreground mb-4">Nenhum documento encontrado</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("")
              setStatusFilter("all")
              setTypeFilter("all")
              setPaymentFilter("all")
            }}>
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDocumentIcon(doc.type)}
                        <span>{getTypeLabel(doc.type)}</span>
                        {doc.type === "quote" && doc.revision && doc.revision > 1 && (
                          <Badge variant="outline" className="text-xs">Rev. {doc.revision}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{doc.customer_name}</TableCell>
                    <TableCell>{new Date(doc.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{formatCurrency(doc.total_amount)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(doc.status, doc.type)}
                        {doc.type === "order" && doc.payment_status && (
                          <div className="mt-1">{getPaymentStatusBadge(doc.payment_status)}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/vendas/pedidos/${doc.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
