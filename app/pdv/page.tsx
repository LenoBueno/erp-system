"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Plus, Trash2, CreditCard, ShoppingCart, Search } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Tipos
interface Product {
  id: string
  code: string
  name: string
  price: number
  image?: string
  category: string
  stock: number
}

interface CartItem {
  product: Product
  quantity: number
  discount: number
  total: number
}

// Produtos mockados para demonstração
const mockProducts: Product[] = [
  { 
    id: "prod-001", 
    code: "NB-001",
    name: "Notebook Dell Inspiron 15", 
    price: 3499.90, 
    category: "Informática",
    stock: 12
  },
  { 
    id: "prod-002", 
    code: "MON-001",
    name: 'Monitor LG 24"', 
    price: 1299.50, 
    category: "Informática", 
    stock: 18
  },
  { 
    id: "prod-003", 
    code: "MOUSE-001",
    name: "Mouse sem fio Logitech", 
    price: 129.90, 
    category: "Informática", 
    stock: 45
  },
  { 
    id: "prod-004", 
    code: "PHONE-001",
    name: "Smartphone 128GB", 
    price: 2599.00, 
    category: "Celulares", 
    stock: 7
  },
  { 
    id: "prod-005", 
    code: "TV-001",
    name: "Smart TV LED 4K 50\"", 
    price: 3299.00, 
    category: "Eletrônicos", 
    stock: 5 
  },
  { 
    id: "prod-006", 
    code: "CAD-001",
    name: "Cadeira Ergonômica", 
    price: 899.90,
    category: "Escritório", 
    stock: 8
  },
]

// Categorias únicas extraídas dos produtos
const categories = [...new Set(mockProducts.map(product => product.category))]

export default function PDVPage() {
  // Estados
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productQuantity, setProductQuantity] = useState(1)
  const [productDiscount, setProductDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [customerName, setCustomerName] = useState("")
  const [customerDocument, setCustomerDocument] = useState("")

  // Filtrar produtos com base na pesquisa e categoria selecionada
  useEffect(() => {
    let filtered = mockProducts

    if (searchTerm) {
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (activeCategory) {
      filtered = filtered.filter(product => product.category === activeCategory)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, activeCategory])

  // Cálculo dos totais do carrinho
  const cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0)
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Funções para manipulação do carrinho
  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product)
    setProductQuantity(1)
    setProductDiscount(0)
    setIsAddProductDialogOpen(true)
  }

  const confirmAddToCart = () => {
    if (!selectedProduct) return
    
    const subtotal = selectedProduct.price * productQuantity
    const discountAmount = subtotal * (productDiscount / 100)
    const total = subtotal - discountAmount

    // Verificar se o produto já está no carrinho
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === selectedProduct.id
    )

    if (existingItemIndex >= 0) {
      // Atualizar item existente
      const updatedItems = [...cartItems]
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + productQuantity,
        discount: productDiscount,
        total: updatedItems[existingItemIndex].total + total
      }
      setCartItems(updatedItems)
    } else {
      // Adicionar novo item
      setCartItems([
        ...cartItems,
        {
          product: selectedProduct,
          quantity: productQuantity,
          discount: productDiscount,
          total
        }
      ])
    }

    setIsAddProductDialogOpen(false)
  }

  const handleRemoveFromCart = (index: number) => {
    const updatedItems = [...cartItems]
    updatedItems.splice(index, 1)
    setCartItems(updatedItems)
  }

  const handleCompleteOrder = () => {
    setIsPaymentDialogOpen(true)
  }

  const processPayment = () => {
    // Aqui seria implementada a lógica de processamento do pagamento
    // Por exemplo, integração com gateway de pagamento

    // Simulação de processamento bem-sucedido
    alert(`Venda finalizada com sucesso!\nTotal: ${formatCurrency(cartTotal)}\nForma de pagamento: ${paymentMethod}`)
    
    // Limpar carrinho e fechar diálogo
    setCartItems([])
    setIsPaymentDialogOpen(false)
    setCustomerName("")
    setCustomerDocument("")
    setPaymentMethod("credit")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">PDV - Ponto de Venda</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setCartItems([])}>
            Limpar
          </Button>
          <Button onClick={handleCompleteOrder} disabled={cartItems.length === 0}>
            <CreditCard className="mr-2 h-4 w-4" />
            Finalizar Venda
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Coluna 1-3: Produtos */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Select
              value={activeCategory || ""}
              onValueChange={(value) => setActiveCategory(value || null)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas as categorias" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleAddToCart(product)}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className="mb-2">{product.code}</Badge>
                      <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(product.price)}
                    </span>
                    <Button size="sm" variant="secondary" onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full flex justify-center items-center p-8 border rounded-lg">
                <p className="text-muted-foreground">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Coluna 4-5: Carrinho */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                <span>Carrinho</span>
              </div>
              <Badge variant="secondary">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'itens'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">Carrinho vazio</p>
                <p className="text-sm text-muted-foreground/80">Adicione produtos clicando nos cards à esquerda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <div className="text-sm text-muted-foreground">
                          <span>{formatCurrency(item.product.price)} × {item.quantity}</span>
                          {item.discount > 0 && (
                            <span className="ml-2 text-green-600">(-{item.discount}%)</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold">{formatCurrency(item.total)}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveFromCart(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <Separator />
          <CardFooter className="p-4">
            <div className="w-full">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(cartTotal)}</span>
              </div>
              <Button
                className="w-full mt-4"
                size="lg"
                onClick={handleCompleteOrder}
                disabled={cartItems.length === 0}
              >
                Finalizar Venda
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Modal para adicionar produto */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Produto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <h3 className="font-semibold">{selectedProduct.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedProduct.code}</p>
                <p className="text-primary font-bold mt-1">{formatCurrency(selectedProduct.price)}</p>
              </div>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantidade
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={selectedProduct.stock}
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount" className="text-right">
                    Desconto (%)
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    min={0}
                    max={100}
                    value={productDiscount}
                    onChange={(e) => setProductDiscount(Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedProduct.price * productQuantity)}</span>
                </div>
                {productDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto:</span>
                    <span>-{formatCurrency((selectedProduct.price * productQuantity) * (productDiscount / 100))}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency((selectedProduct.price * productQuantity) * (1 - productDiscount / 100))}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmAddToCart}>
              Adicionar ao Carrinho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para finalizar venda */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Finalizar Venda</DialogTitle>
            <DialogDescription>
              Complete as informações abaixo para finalizar a venda.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer">Cliente</TabsTrigger>
              <TabsTrigger value="payment">Pagamento</TabsTrigger>
            </TabsList>
            <TabsContent value="customer" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer">Nome do Cliente</Label>
                  <Input
                    id="customer"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="document">CPF/CNPJ</Label>
                  <Input
                    id="document"
                    value={customerDocument}
                    onChange={(e) => setCustomerDocument(e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="payment" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="payment-method">Forma de Pagamento</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Cartão de Crédito</SelectItem>
                      <SelectItem value="debit">Cartão de Débito</SelectItem>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="transfer">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>Itens:</span>
                    <span>{cartItemCount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                    <span>Total a pagar:</span>
                    <span className="text-primary">{formatCurrency(cartTotal)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={processPayment}>
              Concluir Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
