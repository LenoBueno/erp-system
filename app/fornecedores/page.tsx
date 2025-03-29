"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search, FileText, Building, Phone, Mail, MapPin, Trash, Pencil } from "lucide-react"

interface Supplier {
  id: string
  name: string
  cnpj: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  contact_name: string
  category: string
}

export default function FornecedoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "Distribuidora de Eletrônicos Ltda",
      cnpj: "12.345.678/0001-90",
      email: "contato@distribuidora.com",
      phone: "(11) 3456-7890",
      address: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
      contact_name: "Carlos Silva",
      category: "Eletrônicos",
    },
    {
      id: "2",
      name: "Suprimentos Industriais S.A.",
      cnpj: "98.765.432/0001-10",
      email: "vendas@suprimentos.com",
      phone: "(21) 2345-6789",
      address: "Rua da Indústria, 500",
      city: "Rio de Janeiro",
      state: "RJ",
      contact_name: "Ana Oliveira",
      category: "Material de Escritório",
    },
    {
      id: "3",
      name: "Tech Parts Importadora",
      cnpj: "45.678.901/0001-23",
      email: "contato@techparts.com",
      phone: "(31) 3456-7890",
      address: "Av. Tecnologia, 200",
      city: "Belo Horizonte",
      state: "MG",
      contact_name: "Roberto Almeida",
      category: "Componentes Eletrônicos",
    },
  ])

  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    contact_name: "",
    category: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("lista")

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.cnpj.includes(searchTerm) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewSupplier((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSupplier = () => {
    const id = Math.random().toString(36).substr(2, 9)
    const supplier = { ...newSupplier, id } as Supplier
    setSuppliers((prev) => [...prev, supplier])
    setNewSupplier({
      name: "",
      cnpj: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      contact_name: "",
      category: "",
    })
    setIsDialogOpen(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Fornecedores</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Adicionar Fornecedor
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>
    </MainLayout>
  )
}