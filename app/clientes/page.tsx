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
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Customer {
  id: number
  code: string
  name: string
  type: "PJ" | "PF"
  document: string
  group: string
  status: "active" | "inactive"
  
  // Contatos
  email: string
  phone: string
  contact_name: string
  
  // Endereços
  billing_address: {
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  shipping_address: {
    same_as_billing: boolean
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  
  // Condições Comerciais
  currency: "BRL" | "USD" | "EUR"
  price_table: string
  payment_method: "boleto" | "credit_card" | "pix" | "bank_transfer"
  payment_term: "cash" | "installments" | "30_days" | "60_days" | "90_days" | "30_60_90_days"
  
  // Informações Financeiras
  credit_limit: number
  total_orders: number
  total_spent: number
  
  // Observações e Anexos
  notes: string
  attachments: string[]
  
  created_at: string
  updated_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers")
        if (!response.ok) {
          throw new Error("Falha ao carregar clientes")
        }
        const data = await response.json()
        setCustomers(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [toast])

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    )
  })

  const handleOpenDeleteDialog = (customer: Customer) => {
    setCurrentCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!currentCustomer) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/customers/${currentCustomer.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir cliente")
      }

      // Atualizar lista de clientes
      setCustomers(customers.filter((c) => c.id !== currentCustomer.id))

      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso",
      })

      setIsDeleteDialogOpen(false)
      setCurrentCustomer(null)
    } catch (error) {
      toast({
        title: "Erro ao excluir cliente",
        description: "Ocorreu um erro ao tentar excluir o cliente",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clientes</h1>
          <Button onClick={() => router.push("/clientes/cadastro")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nome, email ou telefone..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-10">
                <p>Carregando clientes...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-10">
                <p>Nenhum cliente encontrado.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.code}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.document}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              customer.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {customer.status === "active" ? "Ativo" : "Inativo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/clientes/visualizar/${customer.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/clientes/editar/${customer.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentCustomer(customer)
                                setIsDeleteDialogOpen(true)
                              }}
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

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Cliente</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o cliente{" "}
                <span className="font-medium">{currentCustomer?.name}</span>? Esta ação não pode ser
                desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (currentCustomer) {
                    // Simulação de exclusão
                    setCustomers((prev) => prev.filter((c) => c.id !== currentCustomer.id))
                    setIsDeleteDialogOpen(false)
                    toast({
                      title: "Cliente excluído",
                      description: `O cliente ${currentCustomer.name} foi excluído com sucesso.`,
                    })
                  }
                }}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
