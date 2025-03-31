"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, FileText, Mail, AlertTriangle, CheckCircle, Plus, Trash2, Calculator } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  name: string
  code: string
  price: number
  unit: string
  tax_rate: number
  ncm?: string
  cfop?: string
  origin?: string
}

interface NFEItem {
  product_id: number
  product_name: string
  product_code: string
  quantity: number
  unit_price: number
  unit: string
  discount_percent: number
  tax_rate: number
  subtotal: number
  total: number
  icms_value?: number
  pis_value?: number
  cofins_value?: number
  iss_value?: number
}

interface NFEFormData {
  customer_id: number
  items: NFEItem[]
  payment_method: string
  shipping_method?: string
  shipping_cost?: number
  notes?: string
  send_email: boolean
}

interface NFEResponse {
  success: boolean
  message: string
  nfe_number?: string
  access_key?: string
  pdf_url?: string
  xml_url?: string
  emailSent?: boolean
  emailMessage?: string
}

interface NFEFormModalProps {
  isOpen: boolean
  onClose: () => void
  orderId?: string
  orderNumber?: string
}

export function NFEFormModal({ isOpen, onClose, orderId, orderNumber }: NFEFormModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"form" | "success" | "error">("form")
  const [activeTab, setActiveTab] = useState("cliente")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [customerSearch, setCustomerSearch] = useState("")
  const [productSearch, setProductSearch] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [nfeData, setNfeData] = useState<NFEResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<NFEFormData>({
    customer_id: 0,
    items: [],
    payment_method: "a_vista",
    shipping_method: "",
    shipping_cost: 0,
    notes: "",
    send_email: true
  })

  const { toast } = useToast()

  // Carregar clientes e produtos ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      fetchCustomers()
      fetchProducts()
      
      // Se tiver um orderId, carregar os dados do pedido
      if (orderId) {
        fetchOrderData(orderId)
      }
    }
  }, [isOpen, orderId])

  // Filtrar clientes com base na busca
  useEffect(() => {
    if (customerSearch.trim() === "") {
      setFilteredCustomers(customers)
    } else {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.document.includes(customerSearch)
      )
      setFilteredCustomers(filtered)
    }
  }, [customerSearch, customers])

  const fetchCustomers = async () => {
    try {
      // Simulação de dados para demonstração
      const mockCustomers: Customer[] = [
        {
          id: 1,
          name: "Empresa ABC Ltda",
          document: "12.345.678/0001-90",
          email: "contato@empresaabc.com.br",
          phone: "(51) 3333-4444",
          address: "Av. Assis Brasil, 1234",
          city: "Porto Alegre",
          state: "RS",
          postal_code: "90000-000"
        },
        {
          id: 2,
          name: "Comércio XYZ S.A.",
          document: "98.765.432/0001-10",
          email: "financeiro@xyz.com.br",
          phone: "(51) 3333-5555",
          address: "Rua dos Andradas, 500",
          city: "Porto Alegre",
          state: "RS",
          postal_code: "90020-010"
        },
        {
          id: 3,
          name: "Indústria 123",
          document: "11.222.333/0001-44",
          email: "fiscal@industria123.com.br",
          phone: "(51) 3333-6666",
          address: "Av. das Indústrias, 789",
          city: "Canoas",
          state: "RS",
          postal_code: "92000-000"
        }
      ]
      
      setCustomers(mockCustomers)
      setFilteredCustomers(mockCustomers)
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes",
        variant: "destructive",
      })
    }
  }

  const fetchProducts = async () => {
    try {
      // Simulação de dados para demonstração
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Notebook Dell Inspiron",
          code: "NOT-001",
          price: 3500,
          unit: "UN",
          tax_rate: 18,
          ncm: "8471.30.19",
          cfop: "5102",
          origin: "5"
        },
        {
          id: 2,
          name: "Monitor LG 24 polegadas",
          code: "MON-002",
          price: 950,
          unit: "UN",
          tax_rate: 18,
          ncm: "8528.52.20",
          cfop: "5102",
          origin: "5"
        },
        {
          id: 3,
          name: "Teclado sem fio Logitech",
          code: "TEC-003",
          price: 180,
          unit: "UN",
          tax_rate: 18,
          ncm: "8471.60.52",
          cfop: "5102",
          origin: "5"
        }
      ]
      
      setProducts(mockProducts)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos",
        variant: "destructive",
      })
    }
  }

  const fetchOrderData = async (id: string) => {
    try {
      // Em um ambiente real, aqui seria feita uma chamada para a API
      // Simulação de dados para demonstração
      const mockOrder = {
        id: parseInt(id),
        customer_id: 1,
        items: [
          {
            product_id: 1,
            product_name: "Notebook Dell Inspiron",
            product_code: "NOT-001",
            quantity: 2,
            unit_price: 3500,
            unit: "UN",
            discount_percent: 0,
            tax_rate: 18,
            subtotal: 7000,
            total: 7000
          },
          {
            product_id: 3,
            product_name: "Teclado sem fio Logitech",
            product_code: "TEC-003",
            quantity: 2,
            unit_price: 180,
            unit: "UN",
            discount_percent: 0,
            tax_rate: 18,
            subtotal: 360,
            total: 360
          }
        ],
        payment_method: "a_vista",
        shipping_method: "transportadora",
        shipping_cost: 50,
        notes: "Pedido para entrega urgente"
      }
      
      // Preencher o formulário com os dados do pedido
      setFormData({
        customer_id: mockOrder.customer_id,
        items: mockOrder.items,
        payment_method: mockOrder.payment_method,
        shipping_method: mockOrder.shipping_method,
        shipping_cost: mockOrder.shipping_cost,
        notes: mockOrder.notes,
        send_email: true
      })
      
      // Selecionar o cliente
      const customer = customers.find(c => c.id === mockOrder.customer_id)
      if (customer) {
        setSelectedCustomer(customer)
      }
      
    } catch (error) {
      console.error("Erro ao carregar dados do pedido:", error)
      toast({
        title: "Erro ao carregar pedido",
        description: "Não foi possível carregar os dados do pedido",
        variant: "destructive",
      })
    }
  }

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setFormData(prev => ({
      ...prev,
      customer_id: customer.id
    }))
    setCustomerSearch("")
    setActiveTab("itens")
  }

  const handleAddProduct = (product: Product) => {
    const newItem: NFEItem = {
      product_id: product.id,
      product_name: product.name,
      product_code: product.code,
      quantity: 1,
      unit_price: product.price,
      unit: product.unit,
      discount_percent: 0,
      tax_rate: product.tax_rate,
      subtotal: product.price,
      total: product.price,
      icms_value: (product.price * product.tax_rate) / 100,
      pis_value: (product.price * 1.65) / 100,
      cofins_value: (product.price * 7.6) / 100
    }
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
    
    setProductSearch("")
  }

  const handleRemoveProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity < 1) return
    
    setFormData(prev => {
      const updatedItems = [...prev.items]
      const item = updatedItems[index]
      
      const subtotal = quantity * item.unit_price
      const discount = subtotal * (item.discount_percent / 100)
      const total = subtotal - discount
      
      updatedItems[index] = {
        ...item,
        quantity,
        subtotal,
        total,
        icms_value: (total * item.tax_rate) / 100,
        pis_value: (total * 1.65) / 100,
        cofins_value: (total * 7.6) / 100
      }
      
      return {
        ...prev,
        items: updatedItems
      }
    })
  }

  const handleDiscountChange = (index: number, discountPercent: number) => {
    if (discountPercent < 0 || discountPercent > 100) return
    
    setFormData(prev => {
      const updatedItems = [...prev.items]
      const item = updatedItems[index]
      
      const subtotal = item.quantity * item.unit_price
      const discount = subtotal * (discountPercent / 100)
      const total = subtotal - discount
      
      updatedItems[index] = {
        ...item,
        discount_percent: discountPercent,
        subtotal,
        total,
        icms_value: (total * item.tax_rate) / 100,
        pis_value: (total * 1.65) / 100,
        cofins_value: (total * 7.6) / 100
      }
      
      return {
        ...prev,
        items: updatedItems
      }
    })
  }

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.subtotal, 0)
    const total = formData.items.reduce((sum, item) => sum + item.total, 0) + (formData.shipping_cost || 0)
    const totalICMS = formData.items.reduce((sum, item) => sum + (item.icms_value || 0), 0)
    const totalPIS = formData.items.reduce((sum, item) => sum + (item.pis_value || 0), 0)
    const totalCOFINS = formData.items.reduce((sum, item) => sum + (item.cofins_value || 0), 0)
    const totalTaxes = totalICMS + totalPIS + totalCOFINS
    
    return {
      subtotal,
      total,
      totalICMS,
      totalPIS,
      totalCOFINS,
      totalTaxes
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleGenerateNFE = async () => {
    // Validações
    if (!selectedCustomer) {
      toast({
        title: "Cliente não selecionado",
        description: "Selecione um cliente para emitir a nota fiscal",
        variant: "destructive",
      })
      setActiveTab("cliente")
      return
    }
    
    if (formData.items.length === 0) {
      toast({
        title: "Nenhum item adicionado",
        description: "Adicione pelo menos um item para emitir a nota fiscal",
        variant: "destructive",
      })
      setActiveTab("itens")
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Em um ambiente real, aqui seria feita uma chamada para a API
      const apiUrl = orderId 
        ? `/api/orders/${orderId}/nfe` 
        : `/api/nfe`
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          sendEmail: formData.send_email
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Falha ao gerar nota fiscal")
      }

      setNfeData(data)
      setStep("success")

      toast({
        title: "Nota fiscal gerada com sucesso",
        description: data.emailSent 
          ? "A nota fiscal foi gerada e enviada por e-mail" 
          : "A nota fiscal foi gerada com sucesso",
      })
    } catch (error) {
      console.error("Erro ao gerar NF-e:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido ao gerar nota fiscal")
      setStep("error")
      
      toast({
        title: "Erro ao gerar nota fiscal",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar gerar a nota fiscal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!nfeData) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const apiUrl = orderId 
        ? `/api/orders/${orderId}/nfe/email` 
        : `/api/nfe/email`
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nfeData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Falha ao enviar e-mail")
      }

      // Atualizar o estado com a resposta
      setNfeData({
        ...nfeData,
        emailSent: true,
        emailMessage: data.message
      })

      toast({
        title: "E-mail enviado com sucesso",
        description: `A nota fiscal foi enviada para ${selectedCustomer?.email}`,
      })
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido ao enviar e-mail")
      
      toast({
        title: "Erro ao enviar e-mail",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar enviar o e-mail",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = () => {
    if (nfeData?.pdf_url) {
      window.open(nfeData.pdf_url, "_blank")
    }
  }

  const handleDownloadXML = () => {
    if (nfeData?.xml_url) {
      window.open(nfeData.xml_url, "_blank")
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setStep("form")
      setNfeData(null)
      setError(null)
      setSelectedCustomer(null)
      setFormData({
        customer_id: 0,
        items: [],
        payment_method: "a_vista",
        shipping_method: "",
        shipping_cost: 0,
        notes: "",
        send_email: true
      })
      setActiveTab("cliente")
      onClose()
    }
  }

  const totals = calculateTotals()

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Emissão de Nota Fiscal Eletrônica</DialogTitle>
          <DialogDescription>
            {step === "form" && (orderNumber ? `Emitir nota fiscal para o pedido ${orderNumber}` : "Preencha os dados para emissão da nota fiscal")}
            {step === "success" && "Nota fiscal gerada com sucesso"}
            {step === "error" && "Erro ao gerar nota fiscal"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === "form" && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cliente">1. Identificação do Cliente</TabsTrigger>
                <TabsTrigger value="itens" disabled={!selectedCustomer}>2. Produtos/Serviços</TabsTrigger>
                <TabsTrigger value="pagamento" disabled={!selectedCustomer || formData.items.length === 0}>3. Pagamento e Envio</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cliente" className="space-y-4 mt-4">
                {selectedCustomer ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium mb-2">Dados do Cliente</h3>
                          <p><strong>Nome:</strong> {selectedCustomer.name}</p>
                          <p><strong>CNPJ/CPF:</strong> {selectedCustomer.document}</p>
                          <p><strong>E-mail:</strong> {selectedCustomer.email}</p>
                          <p><strong>Telefone:</strong> {selectedCustomer.phone}</p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Endereço de Faturamento</h3>
                          <p>{selectedCustomer.address}</p>
                          <p>{selectedCustomer.city} - {selectedCustomer.state}</p>
                          <p>CEP: {selectedCustomer.postal_code}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" onClick={() => setSelectedCustomer(null)}>Alterar Cliente</Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <Input 
                        placeholder="Buscar cliente por nome ou CNPJ/CPF..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                      />
                    </div>
                    
                    {filteredCustomers.length > 0 ? (
                      <div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome</TableHead>
                              <TableHead>CNPJ/CPF</TableHead>
                              <TableHead>Cidade/UF</TableHead>
                              <TableHead className="text-right">Ação</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredCustomers.map((customer) => (
                              <TableRow key={customer.id}>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>{customer.document}</TableCell>
                                <TableCell>{customer.city}/{customer.state}</TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleSelectCustomer(customer)}
                                  >
                                    Selecionar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center p-4 border rounded-md">
                        <p>Nenhum cliente encontrado</p>
                        <p className="text-sm text-muted-foreground mt-2">Tente outro termo de busca</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="itens" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="relative mb-4">
                      <Input 
                        placeholder="Buscar produto por nome ou código..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                    </div>
                    
                    {products.filter(product => 
                      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                      product.code.toLowerCase().includes(productSearch.toLowerCase())
                    ).length > 0 ? (
                      <div className="space-y-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Código</TableHead>
                              <TableHead>Nome</TableHead>
                              <TableHead>Preço</TableHead>
                              <TableHead className="text-right">Ação</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {products
                              .filter(product => 
                                product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                                product.code.toLowerCase().includes(productSearch.toLowerCase())
                              )
                              .map((product) => (
                                <TableRow key={product.id}>
                                  <TableCell>{product.code}</TableCell>
                                  <TableCell>{product.name}</TableCell>
                                  <TableCell>{formatCurrency(product.price)}</TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleAddProduct(product)}
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Adicionar
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center p-4 border rounded-md">
                        <p>Nenhum produto encontrado</p>
                        <p className="text-sm text-muted-foreground mt-2">Tente outro termo de busca</p>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Itens da Nota Fiscal</h3>
                      
                      {formData.items.length > 0 ? (
                        <div className="space-y-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Produto</TableHead>
                                <TableHead>Qtd</TableHead>
                                <TableHead>Valor Unit.</TableHead>
                                <TableHead>Desc. %</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {formData.items.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{item.product_name}</p>
                                      <p className="text-sm text-muted-foreground">{item.product_code}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Input 
                                      type="number" 
                                      min="1"
                                      className="w-16"
                                      value={item.quantity} 
                                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                                    />
                                  </TableCell>
                                  <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                                  <TableCell>
                                    <Input 
                                      type="number" 
                                      min="0"
                                      max="100"
                                      className="w-16"
                                      value={item.discount_percent} 
                                      onChange={(e) => handleDiscountChange(index, parseFloat(e.target.value) || 0)}
                                    />
                                  </TableCell>
                                  <TableCell>{formatCurrency(item.total)}</TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleRemoveProduct(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          
                          <div className="flex justify-end">
                            <Card className="w-64">
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrency(totals.subtotal)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Total de impostos:</span>
                                    <span>{formatCurrency(totals.totalTaxes)}</span>
                                  </div>
                                  <div className="flex justify-between font-medium text-lg pt-2 border-t">
                                    <span>Total:</span>
                                    <span>{formatCurrency(totals.total)}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-4 border rounded-md">
                          <p>Nenhum item adicionado à nota fiscal</p>
                          <p className="text-sm text-muted-foreground mt-2">Busque e adicione produtos acima</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="pagamento" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="payment_method">Forma de Pagamento</Label>
                          <Select 
                            value={formData.payment_method} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
                          >
                            <SelectTrigger id="payment_method">
                              <SelectValue placeholder="Selecione a forma de pagamento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="a_vista">À Vista</SelectItem>
                              <SelectItem value="boleto">Boleto Bancário</SelectItem>
                              <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                              <SelectItem value="pix">PIX</SelectItem>
                              <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="shipping_method">Método de Envio</Label>
                          <Select 
                            value={formData.shipping_method || ""} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, shipping_method: value }))}
                          >
                            <SelectTrigger id="shipping_method">
                              <SelectValue placeholder="Selecione o método de envio" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="correios">Correios</SelectItem>
                              <SelectItem value="transportadora">Transportadora</SelectItem>
                              <SelectItem value="retirada">Retirada no Local</SelectItem>
                              <SelectItem value="entrega_propria">Entrega Própria</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="shipping_cost">Custo de Envio (R$)</Label>
                          <Input
                            id="shipping_cost"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.shipping_cost || 0}
                            onChange={(e) => setFormData(prev => ({ ...prev, shipping_cost: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="notes">Observações</Label>
                          <Input
                            id="notes"
                            value={formData.notes || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          />
                        </div>
                        
                        <div className="flex items-start space-x-2 mt-4">
                          <Checkbox 
                            id="send_email" 
                            checked={formData.send_email} 
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, send_email: checked as boolean }))}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="send_email" className="text-sm font-medium leading-none">
                              Enviar por e-mail
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Enviar a nota fiscal para o e-mail do cliente ({selectedCustomer?.email})
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between items-center">
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveTab("itens")}
                        >
                          Voltar
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={handleGenerateNFE}
                          disabled={isLoading}
                        >
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Gerar Nota Fiscal
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          {step === "success" && nfeData && (
            <div className="space-y-6">
              <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-400">Nota fiscal gerada com sucesso</h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>Número da NF-e: {nfeData.nfe_number}</p>
                      <p className="mt-1 text-xs break-all">Chave de acesso: {nfeData.access_key}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {nfeData.emailSent ? (
                <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Mail className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400">E-mail enviado</h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <p>A nota fiscal foi enviada para {selectedCustomer?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendEmail}
                    disabled={isLoading}
                    className="mr-2"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar por E-mail
                  </Button>
                </div>
              )}
              
              <div className="flex justify-between">
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadXML}
                    className="mr-2"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Baixar XML
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadPDF}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={handleClose}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
          
          {step === "error" && (
            <div className="space-y-6">
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Erro ao gerar nota fiscal</h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => setStep("form")}
                  className="mr-2"
                >
                  Tentar Novamente
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </div>

        {step === "form" && (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            {activeTab === "pagamento" && (
              <Button
                type="button"
                onClick={handleGenerateNFE}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gerar Nota Fiscal
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
