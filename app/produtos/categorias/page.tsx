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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: number
  name: string
  description: string
  product_count: number
  created_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const { toast } = useToast()

  useEffect(() => {
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
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    })
    setCurrentCategory(null)
  }

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setCurrentCategory(category)
      setFormData({
        name: category.name,
        description: category.description,
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleOpenDeleteDialog = (category: Category) => {
    setCurrentCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = currentCategory ? `/api/categories/${currentCategory.id}` : "/api/categories"

      const method = currentCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Falha ao salvar categoria")
      }

      // Recarregar categorias
      const categoriesResponse = await fetch("/api/categories")
      const categoriesData = await categoriesResponse.json()
      setCategories(categoriesData)

      toast({
        title: currentCategory ? "Categoria atualizada" : "Categoria criada",
        description: currentCategory ? "A categoria foi atualizada com sucesso" : "A categoria foi criada com sucesso",
      })

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Erro ao salvar categoria",
        description: "Ocorreu um erro ao tentar salvar a categoria",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentCategory) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/categories/${currentCategory.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir categoria")
      }

      // Atualizar lista de categorias
      setCategories(categories.filter((c) => c.id !== currentCategory.id))

      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso",
      })

      setIsDeleteDialogOpen(false)
      setCurrentCategory(null)
    } catch (error) {
      toast({
        title: "Erro ao excluir categoria",
        description: "Ocorreu um erro ao tentar excluir a categoria",
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
          <h1 className="text-2xl font-bold">Categorias de Produtos</h1>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-4">Carregando categorias...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-4">Nenhuma categoria encontrada</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Produtos</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>{category.product_count}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(category)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDeleteDialog(category)}
                              disabled={category.product_count > 0}
                            >
                              <Trash2 className="h-4 w-4" />
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

      {/* Dialog para adicionar/editar categoria */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            <DialogDescription>
              {currentCategory ? "Edite os detalhes da categoria abaixo" : "Preencha os detalhes da nova categoria"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a categoria "{currentCategory?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}

