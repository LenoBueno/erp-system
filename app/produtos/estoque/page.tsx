"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, ArrowUp, ArrowDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  stock_quantity: number
  reorder_level: number
  category_id: number
  category_name: string
}

interface StockMovement {
  type: "add" | "remove"
  quantity: string
  reason: string
}

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [stockMovement, setStockMovement] = useState<StockMovement>({
    type: "add",
    quantity: "",
    reason: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/stock")
        if (!response.ok) {
          throw new Error("Falha ao carregar produtos")
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar produtos",
          description: "Não foi possível carregar a lista de produtos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error("Falha ao carregar categorias")
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar categorias",
          description: "Não foi possível carregar a lista de categorias",
          variant: "destructive",
        })
      }
    }

    fetchProducts()
    fetchCategories()
  }, [toast])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category_id.toString() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleOpenDialog = (product: Product, type: "add" | "remove") => {
    setCurrentProduct(product)
    setStockMovement({
      type,
      quantity: "",
      reason: "",
    })
    setIsDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setStockMovement((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!currentProduct) return

    try {
      const movementData = {
        product_id: currentProduct.id,
        quantity: Number.parseInt(stockMovement.quantity),
        type: stockMovement.type,
        reason: stockMovement.reason,
      }

      const response = await fetch("/api/products/stock/movement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movementData),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar estoque")
      }

      // Recarregar produtos
      const productsResponse = await fetch("/api/products/stock")
      const productsData = await productsResponse.json()
      setProducts(productsData)

      toast({
        title: "Estoque atualizado",
        description: "O estoque foi atualizado com sucesso",
      })

      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao atualizar estoque",
        description: "Ocorreu um erro ao tentar atualizar o estoque",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Controle de Estoque</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar produtos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="text-center py-4">Carregando produtos...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-4">Nenhum produto encontrado</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Estoque Atual</TableHead>
                      <TableHead>Nível de Reposição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category_name}</TableCell>
                        <TableCell>{product.stock_quantity}</TableCell>
                        <TableCell>{product.reorder_level}</TableCell>
                        <TableCell>
                          <div
                            className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                              product.stock_quantity <= product.reorder_level
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                          >
                            {product.stock_quantity <= product.reorder_level ? "Baixo Estoque" : "Estoque OK"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center"
                              onClick={() => handleOpenDialog(product, "add")}
                            >
                              <ArrowUp className="h-4 w-4 mr-1" />
                              Entrada
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center"
                              onClick={() => handleOpenDialog(product, "remove")}
                            >
                              <ArrowDown className="h-4 w-4 mr-1" />
                              Saída
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

      {/* Dialog para movimentação de estoque */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{stockMovement.type === "add" ? "Entrada de Estoque" : "Saída de Estoque"}</DialogTitle>
            <DialogDescription>
              {stockMovement.type === "add"
                ? `Registrar entrada de estoque para ${currentProduct?.name}`
                : `Registrar saída de estoque para ${currentProduct?.name}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={stockMovement.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo</Label>
                <Select
                  value={stockMovement.reason}
                  onValueChange={(value) => setStockMovement((prev) => ({ ...prev, reason: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {stockMovement.type === "add" ? (
                      <>
                        <SelectItem value="purchase">Compra de Fornecedor</SelectItem>
                        <SelectItem value="return">Devolução de Cliente</SelectItem>
                        <SelectItem value="adjustment">Ajuste de Inventário</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="sale">Venda</SelectItem>
                        <SelectItem value="damage">Produto Danificado</SelectItem>
                        <SelectItem value="loss">Perda</SelectItem>
                        <SelectItem value="adjustment">Ajuste de Inventário</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}

