"use client"

import { useState, useEffect, useRef } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Plus, Trash2, Save, Printer, X, Check, FileText, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { generateOrderHTML } from "@/lib/html-pdf-generator"

interface Customer {
  id: number
  name: string
  document: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postal_code: string
}

interface Product {
  id: number
  code: string
  name: string
  description: string
  price: number
  unit: string
  stock: number
  tax_rate: number
}

interface OrderItem {
  id: number
  product_id: number
  product_code: string
  product_name: string
  quantity: number
  unit_price: number
  unit: string
  discount_percent: number
  tax_rate: number // Será sempre 10% na v0
  subtotal: number
  total: number
}

interface PaymentMethod {
  id: string
  name: string
}

interface PaymentTerm {
  id: string
  name: string
  days: number
}

interface Seller {
  id: number
  name: string
}

export default function NewOrderPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [orderType, setOrderType] = useState("normal")
  const [orderStatus, setOrderStatus] = useState("aberto")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedSeller, setSelectedSeller] = useState<number | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [currentItem, setCurrentItem] = useState<{
    product_id: number
    quantity: number
    discount_percent: number
    unit: string
  }>({
    product_id: 0,
    quantity: 1,
    discount_percent: 0,
    unit: ""
  })
  const [issueDate, setIssueDate] = useState<Date>(new Date())
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined)
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [paymentTerm, setPaymentTerm] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [shippingAddress, setShippingAddress] = useState<string>("")
  const [billingAddress, setBillingAddress] = useState<string>("")
  const [shippingCost, setShippingCost] = useState<number>(0)
  const [otherCosts, setOtherCosts] = useState<number>(0)
  
  const { toast } = useToast()
  const router = useRouter()

  // Métodos de pagamento disponíveis
  const paymentMethods: PaymentMethod[] = [
    { id: "pix", name: "PIX" },
    { id: "boleto", name: "Boleto" },
    { id: "cartao", name: "Cartão" },
    { id: "transferencia", name: "Depósito" },
    { id: "dinheiro", name: "Dinheiro" },
  ]

  // Condições de pagamento disponíveis
  const paymentTerms: PaymentTerm[] = [
    { id: "a_vista", name: "À Vista", days: 0 },
    { id: "7_dias", name: "7 Dias", days: 7 },
    { id: "15_dias", name: "15 Dias", days: 15 },
    { id: "30_dias", name: "30 Dias", days: 30 },
    { id: "45_dias", name: "45 Dias", days: 45 },
    { id: "60_dias", name: "60 Dias", days: 60 },
    { id: "90_dias", name: "90 Dias", days: 90 },
  ]

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      try {
        // Carregar clientes
        const customersResponse = await fetch("/api/customers")
        if (customersResponse.ok) {
          const customersData = await customersResponse.json()
          setCustomers(customersData)
        }

        // Carregar produtos
        const productsResponse = await fetch("/api/products")
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setProducts(productsData)
        }

        // Carregar vendedores
        const sellersResponse = await fetch("/api/sellers")
        if (sellersResponse.ok) {
          const sellersData = await sellersResponse.json()
          setSellers(sellersData)
        }

        // Gerar número do pedido
        const orderNumberResponse = await fetch("/api/orders/next-number")
        if (orderNumberResponse.ok) {
          const { number } = await orderNumberResponse.json()
          setOrderNumber(number)
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados necessários para criar o pedido",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [toast])

  // Atualizar endereços quando o cliente for selecionado
  useEffect(() => {
    if (selectedCustomer) {
      setShippingAddress(
        `${selectedCustomer.address}, ${selectedCustomer.city} - ${selectedCustomer.state}, ${selectedCustomer.postal_code}`
      )
      setBillingAddress(
        `${selectedCustomer.address}, ${selectedCustomer.city} - ${selectedCustomer.state}, ${selectedCustomer.postal_code}`
      )
    } else {
      setShippingAddress("")
      setBillingAddress("")
    }
  }, [selectedCustomer])

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find((c) => c.id === parseInt(customerId))
    setSelectedCustomer(customer || null)
  }

  const handleSellerChange = (sellerId: string) => {
    setSelectedSeller(parseInt(sellerId))
  }

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === parseInt(productId))
    setCurrentItem({
      ...currentItem,
      product_id: parseInt(productId),
      unit: product?.unit || ""
    })
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value) && value > 0) {
      setCurrentItem({
        ...currentItem,
        quantity: value,
      })
    }
  }

  const handleUnitChange = (unit: string) => {
    setCurrentItem({
      ...currentItem,
      unit: unit,
    })
  }

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setCurrentItem({
        ...currentItem,
        discount_percent: value,
      })
    }
  }

  const addItemToOrder = () => {
    if (currentItem.product_id === 0) {
      toast({
        title: "Produto não selecionado",
        description: "Selecione um produto para adicionar ao pedido",
        variant: "destructive",
      })
      return
    }

    const product = products.find((p) => p.id === currentItem.product_id)
    if (!product) return

    const unitPrice = product.price
    const subtotal = unitPrice * currentItem.quantity
    const discountAmount = subtotal * (currentItem.discount_percent / 100)
    const subtotalWithDiscount = subtotal - discountAmount
    // Usar taxa fixa de 10% para impostos conforme solicitado
    const taxAmount = subtotalWithDiscount * 0.1 // 10% fixo para v0
    const total = subtotalWithDiscount + taxAmount

    const newItem: OrderItem = {
      id: Date.now(), // ID temporário
      product_id: product.id,
      product_code: product.code,
      product_name: product.name,
      quantity: currentItem.quantity,
      unit_price: unitPrice,
      unit: currentItem.unit || product.unit,
      discount_percent: currentItem.discount_percent,
      tax_rate: 10, // Taxa fixa de 10% para v0
      subtotal: subtotalWithDiscount,
      total: total,
    }

    setOrderItems([...orderItems, newItem])

    // Resetar o item atual
    setCurrentItem({
      product_id: 0,
      quantity: 1,
      discount_percent: 0,
      unit: ""
    })
  }

  const removeItemFromOrder = (itemId: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId))
  }

  const calculateOrderTotal = () => {
    const itemsTotal = orderItems.reduce((sum, item) => sum + item.total, 0)
    return itemsTotal + shippingCost + otherCosts
  }

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const calculateTaxTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.total - item.subtotal), 0)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleSaveAsDraft = async () => {
    if (!selectedCustomer) {
      toast({
        title: "Cliente não selecionado",
        description: "Selecione um cliente para o pedido",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const orderData = {
        order_number: orderNumber,
        customer_id: selectedCustomer.id,
        seller_id: selectedSeller,
        status: "rascunho",
        order_type: orderType,
        issue_date: issueDate.toISOString(),
        delivery_date: deliveryDate ? deliveryDate.toISOString() : null,
        payment_method: paymentMethod,
        payment_term: paymentTerm,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        shipping_cost: shippingCost,
        other_costs: otherCosts,
        subtotal: calculateSubtotal(),
        tax_total: calculateTaxTotal(),
        total_amount: calculateOrderTotal(),
        notes: notes,
        items: orderItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          unit: item.unit,
          discount_percent: item.discount_percent,
          tax_rate: item.tax_rate,
          subtotal: item.subtotal,
          total: item.total,
        })),
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Falha ao salvar rascunho")
      }

      const savedOrder = await response.json()

      toast({
        title: "Rascunho salvo com sucesso",
        description: `Pedido ${orderNumber} foi salvo como rascunho`,
      })

      // Redirecionar para a página do pedido
      router.push(`/vendas/pedidos/${savedOrder.id}`)
    } catch (error) {
      console.error("Erro ao salvar rascunho:", error)
      toast({
        title: "Erro ao salvar rascunho",
        description: "Ocorreu um erro ao tentar salvar o rascunho",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveOrder = async () => {
    if (!selectedCustomer) {
      toast({
        title: "Cliente não selecionado",
        description: "Selecione um cliente para o pedido",
        variant: "destructive",
      })
      return
    }

    if (orderItems.length === 0) {
      toast({
        title: "Pedido vazio",
        description: "Adicione pelo menos um item ao pedido",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const orderData = {
        order_number: orderNumber,
        customer_id: selectedCustomer.id,
        seller_id: selectedSeller,
        status: orderStatus,
        order_type: orderType,
        issue_date: issueDate.toISOString(),
        delivery_date: deliveryDate ? deliveryDate.toISOString() : null,
        payment_method: paymentMethod,
        payment_term: paymentTerm,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        shipping_cost: shippingCost,
        other_costs: otherCosts,
        subtotal: calculateSubtotal(),
        tax_total: calculateTaxTotal(),
        total_amount: calculateOrderTotal(),
        notes: notes,
        items: orderItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          unit: item.unit,
          discount_percent: item.discount_percent,
          tax_rate: item.tax_rate,
          subtotal: item.subtotal,
          total: item.total,
        })),
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Falha ao salvar pedido")
      }

      const savedOrder = await response.json()

      toast({
        title: "Pedido criado com sucesso",
        description: `Pedido ${orderNumber} foi criado com sucesso`,
      })

      // Redirecionar para a página do pedido
      router.push(`/vendas/pedidos/${savedOrder.id}`)
    } catch (error) {
      console.error("Erro ao salvar pedido:", error)
      toast({
        title: "Erro ao salvar pedido",
        description: "Ocorreu um erro ao tentar salvar o pedido",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (orderItems.length > 0) {
      if (window.confirm("Tem certeza que deseja cancelar? Todas as alterações serão perdidas.")) {
        router.push("/vendas/pedidos")
      }
    } else {
      router.push("/vendas/pedidos")
    }
  }

  const handlePrintPDF = () => {
    if (!selectedCustomer || orderItems.length === 0) {
      toast({
        title: "Não é possível imprimir",
        description: "Selecione um cliente e adicione pelo menos um item ao pedido",
        variant: "destructive",
      })
      return
    }

    try {
      // Preparar dados para o PDF
      const orderData = {
        order_number: orderNumber,
        issue_date: issueDate,
        delivery_date: deliveryDate,
        customer: {
          name: selectedCustomer.name,
          document: selectedCustomer.document,
          email: selectedCustomer.email,
          phone: selectedCustomer.phone,
        },
        seller: selectedSeller ? sellers.find(s => s.id === selectedSeller) : undefined,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        payment_method: paymentMethod ? paymentMethods.find(m => m.id === paymentMethod)?.name || paymentMethod : "-",
        payment_term: paymentTerm ? paymentTerms.find(t => t.id === paymentTerm)?.name || paymentTerm : "-",
        items: orderItems,
        shipping_cost: shippingCost,
        other_costs: otherCosts,
        subtotal: calculateSubtotal(),
        tax_total: calculateTaxTotal(),
        total_amount: calculateOrderTotal(),
        notes: notes,
      }

      // Gerar HTML do pedido
      const htmlContent = generateOrderHTML(orderData)
      
      // Abrir HTML em nova aba
      const newWindow = window.open()
      if (newWindow) {
        newWindow.document.write(htmlContent)
        newWindow.document.close()
      } else {
        toast({
          title: "Erro ao abrir impressão",
          description: "O navegador bloqueou a abertura de uma nova janela. Verifique as configurações do seu navegador.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao gerar impressão:", error)
      toast({
        title: "Erro ao gerar impressão",
        description: "Ocorreu um erro ao tentar gerar a impressão do pedido",
        variant: "destructive",
      })
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Novo Pedido</h1>
            <p className="text-muted-foreground">Preencha os dados para criar um novo pedido</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/vendas/pedidos/novo")}>
              <Plus className="mr-2 h-4 w-4" />
              Novo
            </Button>
            <Button onClick={handleSaveOrder} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Pedido
            </Button>
            <Button variant="secondary" onClick={handleSaveAsDraft} disabled={isSaving}>
              <FileText className="mr-2 h-4 w-4" />
              Salvar Rascunho
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button variant="outline" onClick={handlePrintPDF} disabled={orderItems.length === 0 || !selectedCustomer}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handlePrintPDF} disabled={orderItems.length === 0 || !selectedCustomer}>
              <Download className="mr-2 h-4 w-4" />
              Gerar PDF
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber">Número do Pedido</Label>
                    <Input id="orderNumber" value={orderNumber} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderType">Tipo de Pedido</Label>
                    <Select value={orderType} onValueChange={setOrderType}>
                      <SelectTrigger id="orderType">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Pedido Normal</SelectItem>
                        <SelectItem value="cotacao">Cotação</SelectItem>
                        <SelectItem value="orcamento">Orçamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderStatus">Status</Label>
                    <Select value={orderStatus} onValueChange={setOrderStatus}>
                      <SelectTrigger id="orderStatus">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aberto">Aberto</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="faturado">Faturado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Data de Emissão</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {issueDate ? format(issueDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={issueDate}
                          onSelect={(date) => date && setIssueDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">Data de Entrega</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deliveryDate
                            ? format(deliveryDate, "dd/MM/yyyy", { locale: ptBR })
                            : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={deliveryDate}
                          onSelect={setDeliveryDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer">Cliente</Label>
                  <Select onValueChange={handleCustomerChange}>
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCustomer && (
                  <div className="space-y-2 p-3 border rounded-md bg-muted/50">
                    <p className="text-sm font-medium">{selectedCustomer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      CNPJ/CPF: {selectedCustomer.document}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Email: {selectedCustomer.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Telefone: {selectedCustomer.phone}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="seller">Vendedor</Label>
                  <Select onValueChange={handleSellerChange}>
                    <SelectTrigger id="seller">
                      <SelectValue placeholder="Selecione o vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {sellers.map((seller) => (
                        <SelectItem key={seller.id} value={seller.id.toString()}>
                          {seller.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endereços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">Endereço de Entrega</Label>
                  <Textarea
                    id="shippingAddress"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingCity">Cidade</Label>
                    <Input
                      id="shippingCity"
                      value={selectedCustomer?.city || ""}
                      onChange={(e) => {}}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingPostalCode">CEP</Label>
                    <Input
                      id="shippingPostalCode"
                      value={selectedCustomer?.postal_code || ""}
                      onChange={(e) => {}}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Endereço de Cobrança</Label>
                  <Textarea
                    id="billingAddress"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingCity">Cidade</Label>
                    <Input
                      id="billingCity"
                      value={selectedCustomer?.city || ""}
                      onChange={(e) => {}}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingPostalCode">CEP</Label>
                    <Input
                      id="billingPostalCode"
                      value={selectedCustomer?.postal_code || ""}
                      onChange={(e) => {}}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTerm">Condição de Pagamento</Label>
                  <Select value={paymentTerm} onValueChange={setPaymentTerm}>
                    <SelectTrigger id="paymentTerm">
                      <SelectValue placeholder="Selecione a condição de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTerms.map((term) => (
                        <SelectItem key={term.id} value={term.id}>
                          {term.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor="product">Produto</Label>
                    <Select onValueChange={handleProductChange}>
                      <SelectTrigger id="product">
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.code} - {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      step="1"
                      value={currentItem.quantity}
                      onChange={handleQuantityChange}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="unit">Unidade</Label>
                    <Select value={currentItem.unit} onValueChange={handleUnitChange}>
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Unid." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="un">Unidade</SelectItem>
                        <SelectItem value="kg">Quilograma</SelectItem>
                        <SelectItem value="g">Grama</SelectItem>
                        <SelectItem value="l">Litro</SelectItem>
                        <SelectItem value="ml">Mililitro</SelectItem>
                        <SelectItem value="m">Metro</SelectItem>
                        <SelectItem value="cm">Centímetro</SelectItem>
                        <SelectItem value="m2">Metro²</SelectItem>
                        <SelectItem value="m3">Metro³</SelectItem>
                        <SelectItem value="cx">Caixa</SelectItem>
                        <SelectItem value="pct">Pacote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="discount">Desconto (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={currentItem.discount_percent}
                      onChange={handleDiscountChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button onClick={addItemToOrder} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar ao Pedido
                    </Button>
                  </div>
                </div>

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
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_code}</TableCell>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                          <TableCell>{item.discount_percent}%</TableCell>
                          <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                          <TableCell>{formatCurrency(item.total)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItemFromOrder(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}