\"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Trash2, ShoppingCart, CreditCard, Printer, DollarSign, Percent, BarcodeScan } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  price: number
  stock_quantity: number
  barcode?: string
}

interface CartItem extends Product {
  quantity: number
  subtotal: number
  discount: number
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
}

export default function PDVPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Notebook Dell Inspiron 15", price: 4500, stock_quantity: 10, barcode: "7891234567890" },
    { id: 2, name: "Monitor Dell 24\"", price: 1200, stock_quantity: 15, barcode: "7891234567891" },
    { id: 3, name: "Teclado Mecânico Logitech", price: 350, stock_quantity: 20, barcode: "7891234567892" },
    { id: 4, name: "Mouse Wireless Microsoft", price: 120, stock_quantity: 30, barcode: "7891234567893" },
    { id: 5, name: "Headset Gamer Hyperx", price: 280, stock_quantity: 12, barcode: "7891234567894" },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [barcodeInput, setBarcodeInput] = useState("")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("produtos")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productQuantity, setProductQuantity] = useState("1")
  const [productDiscount, setProductDiscount] = useState("0")
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "cash", name: "Dinheiro", icon: <DollarSign className="h-5 w-5" /> },
    { id: "credit", name: "Cartão de Crédito", icon: <CreditCard className="h-5 w-5" /> },
    { id: "debit", name: "Cartão de Débito", icon: <CreditCard className="h-5 w-5" /> },
    { id: "pix", name: "PIX", icon: <DollarSign className="h-5 w-5" /> },
  ])
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<{id: string, amount: string}[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerDocument, setCustomerDocument] = useState("")
  const [saleNote, setSaleNote] = useState("")
  const [cashierBalance, setCashierBalance] = useState(1500)
  const { toast } = useToast()

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddToCart = (product: Product, quantity: number = 1, discount: number = 0) => {
    const existingItemIndex = cartItems.findIndex((item) => item.id === product.id)

    if (existingItemIndex >= 0) {
      // Item já existe no carrinho, atualiza a quantidade
      const updatedItems = [...cartItems]
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity
      
      if (newQuantity > product.stock_quantity) {
        toast({
          title: "Quantidade indisponível",
          description: `Apenas ${product.stock_quantity} unidades disponíveis em estoque`,
          variant: "destructive",
        })
        return
      }
      
      updatedItems[existingItemIndex].quantity = newQuantity
      updatedItems[existingItemIndex].discount = discount
      updatedItems[existingItemIndex].subtotal = (product.price * newQuantity) - discount
      setCartItems(updatedItems)
    } else {
      // Adiciona novo item ao carrinho
      if (quantity > product.stock_quantity) {
        toast({
          title: "Quantidade indisponível",
          description: `Apenas ${product.stock_quantity} unidades disponíveis em estoque`,
          variant: "destructive",
        })
        return
      }
      
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity,
          discount,
          subtotal: (product.price * quantity) - discount,
        },
      ])
    }

    toast({
      title: "Produto adicionado",
      description: `${product.name} adicionado ao carrinho`,
    })
  }

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== productId))
    toast({
      title: "Produto removido",
      description: "Item removido do carrinho",
    })
  }

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId)
      return
    }

    const product = products.find((p) => p.id === productId)
    if (!product) return

    if (newQuantity > product.stock_quantity) {
      toast({
        title: "Quantidade indisponível",
        description: `Apenas ${product.stock_quantity} unidades disponíveis em estoque`,
        variant: "destructive",
      })
      return
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity, subtotal: (item.price * newQuantity) - item.discount }
          : item
      )
    )
  }

  const handleBarcodeSearch = () => {
    if (!barcodeInput) return

    const product = products.find((p) => p.barcode === barcodeInput)
    if (product) {
      handleAddToCart(product)
      setBarcodeInput("")
    } else {
      toast({
        title: "Produto não encontrado",
        description: "Nenhum produto encontrado com este código de barras",
        variant: "destructive",
      })
    }
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setProductQuantity("1")
    setProductDiscount("0")
    setIsProductDialogOpen(true)
  }

  const handleAddProductWithDetails = () => {
    if (!selectedProduct) return

    const quantity = parseInt(productQuantity) || 1
    const discount = parseFloat(productDiscount) || 0

    handleAddToCart(selectedProduct, quantity, discount)
    setIsProductDialogOpen(false)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho para finalizar a venda",
        variant: "destructive",
      })
      return
    }

    // Inicializa o pagamento com o valor total
    setSelectedPaymentMethods([{ id: paymentMethods[0].id, amount: getCartTotal().toString() }])
    setIsPaymentDialogOpen(true)
  }

  const handlePaymentMethodChange = (index: number, methodId: string) => {
    const updatedMethods = [...selectedPaymentMethods]
    updatedMethods[index].id = methodId
    setSelectedPaymentMethods(updatedMethods)
  }

  const handlePaymentAmountChange = (index: number, amount: string) => {
    const updatedMethods = [...selectedPaymentMethods]
    updatedMethods[index].amount = amount
    setSelectedPaymentMethods(updatedMethods)
  }

  const handleAddPaymentMethod = () => {
    setSelectedPaymentMethods([...selectedPaymentMethods, { id: paymentMethods[0].id, amount: "0" }])
  }

  const handleRemovePaymentMethod = (index: number) => {
    if (selectedPaymentMethods.length <= 1) return
    const updatedMethods = [...selectedPaymentMethods]
    updatedMethods.splice(index, 1)
    setSelectedPaymentMethods(updatedMethods)
  }

  const handleFinalizeSale = () => {
    // Verifica se o total dos métodos de pagamento é igual ao total do carrinho
    const paymentTotal = selectedPaymentMethods.reduce(
      (sum, method) => sum + (parseFloat(method.amount) || 0),
      0
    )

    if (Math.abs(paymentTotal - getCartTotal()) > 0.01) {
      toast({
        title: "Valor de pagamento inválido",
        description: "O valor total dos pagamentos deve ser igual ao valor da venda",
        variant: "destructive",
      })
      return
    }

    // Atualiza o saldo do caixa (apenas para o método dinheiro)
    const cashPayment = selectedPaymentMethods.find(method => method.id === "cash")
    if (cashPayment) {
      setCashierBalance(cashierBalance + (parseFloat(cashPayment.amount) || 0))
    }

    // Simula a finalização da venda
    setIsPaymentDialogOpen(false)
    setIsReceiptDialogOpen(true)

    // Em um cenário real, aqui seria feita uma chamada à API para registrar a venda
    toast({
      title: "Venda finalizada com sucesso",
      description: `Venda no valor de ${formatCurrency(getCartTotal())} finalizada`,
    })
  }

  const handlePrintReceipt = () => {
    toast({
      title: "Imprimindo comprovante",
      description: "Enviando comprovante para impressão",
    })
    // Em um cenário real, aqui seria feita a impressão do comprovante
  }

  const handleNewSale = () => {
    setCartItems([])
    setCustomerName("")
    setCustomerDocument("")
    setSaleNote("")
    setIsReceiptDialogOpen(false)
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0)
  }

  const getTotalPayments = () => {
    return selectedPaymentMethods.reduce((total, method) => total + (parseFloat(method.amount) || 0), 0)
  }

  const getChange = () => {
    return Math.max(0, getTotalPayments() - getCartTotal())
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">PDV - Ponto de Venda</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm py-1 px-3">
              Caixa: {formatCurrency(cashierBalance)}
            </Badge>
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Relatório de Caixa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna de produtos */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="produtos">Produtos</TabsTrigger>
                    <TabsTrigger value="codigo">Código de Barras</TabsTrigger>
                  </TabsList>
                  <TabsContent value="produtos" className="space-y-4 mt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar produtos..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {filteredProducts.map((product) => (
                        <Card key={product.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleProductSelect(product)}>
                          <CardContent className="p-4">
                            <div className="font-medium truncate">{product.name}</div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
                              <Badge variant="outline" className={product.stock_quantity > 5 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                Estoque: {product.stock_quantity}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="codigo" className="space-y-4 mt-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <BarcodeScan className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Digite ou escaneie o código de barras"
                          className="pl-10"
                          value={barcodeInput}
                          onChange={(e) => setBarcodeInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleBarcodeSearch()}
                        />
                      </div>
                      <Button onClick={handleBarcodeSearch}>Buscar</Button>
                    </div>
                    <div className="flex items-center justify-center h-64 border rounded-md border-dashed">
                      <div className="text-center">
                        <BarcodeScan className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Digite o código de barras ou use um leitor</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Coluna do carrinho */}
          <div>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Carrinho</span>
                  <Badge variant="outline" className="text-sm">
                    {cartItems.length} {cartItems.length === 1 ? "item" : "itens"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Carrinho vazio</p>
                    <p className="text-sm text-muted-foreground mt-1">Adicione produtos para iniciar a venda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start border-b pb-3">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {formatCurrency(item.price)} x {item.quantity}
                            {item.discount > 0 && (
                              <span className="ml-2 text-green-600">(-{formatCurrency(item.discount)})</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="font-bold">{formatCurrency(item.subtotal)}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500 ml-1"
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <div className="p-4 border-t mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">{formatCurrency(getCartTotal())}</span>
                </div>
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  <CreditCard className="h-5 w-5" />
                  Finalizar Venda
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de detalhes do produto */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Produto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <Label>Produto</Label>
                <div className="font-medium mt-1">{selectedProduct.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço Unitário</Label>
                  <Input id="price" value={formatCurrency(selectedProduct.price)} readOnly className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="stock">Estoque Disponível</Label>
                  <Input id="stock" value={selectedProduct.stock_quantity} readOnly className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={selectedProduct.stock_quantity.toString()}
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="discount" className="flex items-center gap-1">
                    Desconto <Percent className="h-4 w-4" />
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    value={productDiscount}
                    onChange={(e) => setProductDiscount(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Subtotal</Label>
                <div className="font-bold text-lg mt-1">
                  {formatCurrency(
                    (selectedProduct.price * (parseInt(productQuantity) || 1)) -
                      (parseFloat(productDiscount) || 0)
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddProductWithDetails}>Adicionar ao Carrinho</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de pagamento */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Venda</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Total da Venda</span>
              <span className="text-xl font-bold">{formatCurrency(getCartTotal())}</span>
            </div>

            <div>
              <Label>Cliente (opcional)</Label>
              <Input
                placeholder="Nome do cliente"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label>CPF/CNPJ (opcional)</Label>
              <Input
                placeholder="CPF ou CNPJ do cliente"
                value={customerDocument}
                onChange={(e) => setCustomerDocument(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Formas de Pagamento</Label>
                {selectedPaymentMethods.length > 1 && (
                  <Badge variant="outline">
                    Pagamento Múltiplo
                  </Badge>
                )}
              </div>
              
              {selectedPaymentMethods.map((method, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Select value={method.id} onValueChange={(value) => handlePaymentMethodChange(index, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((pm) => (
                        <SelectItem key={pm.id} value={pm.id}>
                          <div className="flex items-center gap-2">
                            {pm.icon}
                            <span>{pm.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={method.amount}
                    onChange={(e) => handlePaymentAmountChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {selectedPaymentMethods.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePaymentMethod(index)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                className="mt-1 w-full"
                onClick={handleAddPaymentMethod}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Forma de Pagamento
              </Button>
            </div>

            {getChange() > 0 && (
              <div className="flex justify-between items-center py-2 border-t border-b">
                <span className="font-medium">Troco</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(getChange())}</span>
              </div>
            )}

            <div>
              <Label>Observações (opcional)</Label>
              <Textarea
                placeholder="Observações sobre a venda"
                value={saleNote}
                onChange={(e) => setSaleNote(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleFinalizeSale}>Finalizar Venda</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de comprovante */}
      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comprovante de Venda</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center border-b pb-4">
              <h3 className="font-bold text-lg">Simple Ink ERP</h3>
              <p className="text-sm text-muted-foreground">CNPJ: 12.345.678/0001-90</p>
              <p className="text-sm text-muted-foreground">Rua Exemplo, 123 - Centro</p>
              <p className="text-sm text-muted-foreground">Venda: #12345 - {formatDate(new Date())}</p>
            </div>

            {customerName && (
              <div className="text-sm">
                <p><strong>Cliente:</strong> {customerName}</p>
                {customerDocument && <p><strong>CPF/CNPJ:</strong> {customerDocument}</p>}
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Itens</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right