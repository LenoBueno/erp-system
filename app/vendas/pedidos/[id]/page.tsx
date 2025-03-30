"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Printer, FileText, Edit, Check, X, AlertTriangle, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { NFEModal } from "@/components/nfe/nfe-modal"
import { EmailOrderModal } from "@/components/nfe/email-order-modal"

interface OrderItem {
  id: number
  product_id: number
  product_code: string
  product_name: string
  quantity: number
  unit_price: number
  unit: string
  discount_percent: number
  tax_rate: number
  subtotal: number
  total: number
}

interface Order {
  id: number
  order_number: string
  customer: {
    id: number
    name: string
    document: string
    email: string
    phone: string
  }
  seller: {
    id: number
    name: string
  }
  status: string
  issue_date: string
  delivery_date: string | null
  payment_method: string
  payment_term: string
  payment_status: string
  shipping_address: string
  billing_address: string
  shipping_cost: number
  other_costs: number
  subtotal: number
  tax_total: number
  total_amount: number
  notes: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNFEModalOpen, setIsNFEModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        if (!response.ok) {
          throw new Error("Falha ao carregar pedido")
        }
        const data = await response.json()
        setOrder(data)
      } catch (error) {
        console.error("Erro ao carregar pedido:", error)
        toast({
          title: "Erro ao carregar pedido",
          description: "Não foi possível carregar os detalhes do pedido",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, toast])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não definida"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR").format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aberto":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
            Aberto
          </Badge>
        )
      case "aprovado":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">
            Aprovado
          </Badge>
        )
      case "faturado":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
            Faturado
          </Badge>
        )
      case "cancelado":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
            Pendente
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
            Pago
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500">
            Reembolsado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEdit = () => {
    router.push(`/vendas/pedidos/${params.id}/editar`)
  }

  const handleGenerateInvoice = () => {
    setIsNFEModalOpen(true)
  }
  
  const handleSendEmail = () => {
    setIsEmailModalOpen(true)
  }

  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "aprovado" }),
      })

      if (!response.ok) {
        throw new Error("Falha ao aprovar pedido")
      }

      // Atualizar o pedido na tela
      setOrder((prev) => (prev ? { ...prev, status: "aprovado" } : null))

      toast({
        title: "Pedido aprovado",
        description: "O pedido foi aprovado com sucesso",
      })
    } catch (error) {
      console.error("Erro ao aprovar pedido:", error)
      toast({
        title: "Erro ao aprovar pedido",
        description: "Ocorreu um erro ao tentar aprovar o pedido",
        variant: "destructive",
      })
    }
  }

  const handleCancel = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelado" }),
      })

      if (!response.ok) {
        throw new Error("Falha ao cancelar pedido")
      }

      // Atualizar o pedido na tela
      setOrder((prev) => (prev ? { ...prev, status: "cancelado" } : null))

      toast({
        title: "Pedido cancelado",
        description: "O pedido foi cancelado com sucesso",
      })
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error)
      toast({
        title: "Erro ao cancelar pedido",
        description: "Ocorreu um erro ao tentar cancelar o pedido",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Carregando detalhes do pedido...</p>
        </div>
      </MainLayout>
    )
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold">Pedido não encontrado</h2>
          <p className="text-muted-foreground">O pedido solicitado não foi encontrado ou não existe.</p>
          <Button onClick={() => router.push("/vendas/pedidos")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Pedidos
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Barra Superior (Ações e Status) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push("/vendas/pedidos")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Pedido #{order.order_number}</h1>
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground">Status: </p>
                {getStatusBadge(order.status)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {order.status === "aberto" && (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button onClick={handleApprove}>
                  <Check className="mr-2 h-4 w-4" />
                  Aprovar
                </Button>
              </>
            )}
            {order.status === "aprovado" && (
              <>
                <Button onClick={handleGenerateInvoice}>
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Nota Fiscal
                </Button>
                <Button variant="outline" onClick={handleSendEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar por E-mail
                </Button>
              </>
            )}
            {order.status === "faturado" && (
              <Button variant="outline" onClick={handleSendEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Enviar por E-mail
              </Button>
            )}
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da Esquerda - Informações do Cliente */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-lg font-medium">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    CNPJ/CPF: {order.customer.document}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: {order.customer.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Telefone: {order.customer.phone}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="font-medium">Vendedor</p>
                  <p className="text-sm text-muted-foreground">{order.seller.name}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endereços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Endereço de Entrega</p>
                  <p className="text-sm text-muted-foreground">{order.shipping_address}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="font-medium">Endereço de Cobrança</p>
                  <p className="text-sm text-muted-foreground">{order.billing_address}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium">Forma de Pagamento</p>
                    <p className="text-sm text-muted-foreground">
                      {order.payment_method === "pix" && "PIX"}
                      {order.payment_method === "boleto" && "Boleto Bancário"}
                      {order.payment_method === "cartao" && "Cartão de Crédito"}
                      {order.payment_method === "transferencia" && "Transferência Bancária"}
                      {order.payment_method === "dinheiro" && "Dinheiro"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Condição de Pagamento</p>
                    <p className="text-sm text-muted-foreground">
                      {order.payment_term === "a_vista" && "À Vista"}
                      {order.payment_term === "7_dias" && "7 Dias"}
                      {order.payment_term === "15_dias" && "15 Dias"}
                      {order.payment_term === "30_dias" && "30 Dias"}
                      {order.payment_term === "45_dias" && "45 Dias"}
                      {order.payment_term === "60_dias" && "60 Dias"}
                      {order.payment_term === "90_dias" && "90 Dias"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="font-medium">Status do Pagamento</p>
                  <div>{getPaymentStatusBadge(order.payment_status)}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium">Data de Emissão</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.issue_date)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Data de Entrega</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.delivery_date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna da Direita - Itens e Totais */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Qtd.</TableHead>
                        <TableHead>Unid.</TableHead>
                        <TableHead>Preço Unit.</TableHead>
                        <TableHead>Desc. (%)</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_code}</TableCell>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                          <TableCell>{item.discount_percent}%</TableCell>
                          <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                          <TableCell>{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {order.notes || "Nenhuma observação registrada."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Impostos:</span>
                      <span>{formatCurrency(order.tax_total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frete:</span>
                      <span>{formatCurrency(order.shipping_cost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Outras Taxas:</span>
                      <span>{formatCurrency(order.other_costs)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(order.total_amount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      {order && (
        <>
          <NFEModal 
            isOpen={isNFEModalOpen}
            onClose={() => setIsNFEModalOpen(false)}
            orderId={params.id}
            orderNumber={order.order_number}
            customerEmail={order.customer.email}
          />
          <EmailOrderModal 
            isOpen={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
            orderId={params.id}
            orderNumber={order.order_number}
            customerEmail={order.customer.email}
            customerName={order.customer.name}
          />
        </>
      )}
    </MainLayout>
  )
}