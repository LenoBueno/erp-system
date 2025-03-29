"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Printer, Search, Plus, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NotaFiscal {
  id: number
  numero: string
  tipo: "nfe" | "nfse"
  cliente: string
  valor: number
  data_emissao: string
  status: "pendente" | "emitida" | "cancelada" | "rejeitada"
  chave_acesso?: string
}

export default function NotaFiscalPage() {
  const [activeTab, setActiveTab] = useState("nfe")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  // Dados simulados para NF-e
  const notasFiscaisNFe: NotaFiscal[] = [
    {
      id: 1,
      numero: "000001234",
      tipo: "nfe",
      cliente: "Empresa ABC Ltda",
      valor: 5800,
      data_emissao: "2023-06-15T10:30:00",
      status: "emitida",
      chave_acesso: "35230612345678901234567890123456789012345678"
    },
    {
      id: 2,
      numero: "000001235",
      tipo: "nfe",
      cliente: "Comércio XYZ S.A.",
      valor: 3200,
      data_emissao: "2023-06-16T14:45:00",
      status: "pendente"
    },
    {
      id: 3,
      numero: "000001236",
      tipo: "nfe",
      cliente: "Indústria 123",
      valor: 7500,
      data_emissao: "2023-06-10T09:15:00",
      status: "emitida",
      chave_acesso: "35230612345678901234567890123456789012345679"
    },
    {
      id: 4,
      numero: "000001237",
      tipo: "nfe",
      cliente: "Distribuidora JKL",
      valor: 4200,
      data_emissao: "2023-06-05T16:20:00",
      status: "cancelada",
      chave_acesso: "35230612345678901234567890123456789012345680"
    },
    {
      id: 5,
      numero: "000001238",
      tipo: "nfe",
      cliente: "Serviços Tech",
      valor: 2800,
      data_emissao: "2023-06-18T11:10:00",
      status: "rejeitada"
    }
  ]

  // Dados simulados para NFS-e
  const notasFiscaisNFSe: NotaFiscal[] = [
    {
      id: 6,
      numero: "000000123",
      tipo: "nfse",
      cliente: "Consultoria ABC",
      valor: 3500,
      data_emissao: "2023-06-14T10:30:00",
      status: "emitida"
    },
    {
      id: 7,
      numero: "000000124",
      tipo: "nfse",
      cliente: "Escritório Advocacia XYZ",
      valor: 5000,
      data_emissao: "2023-06-16T14:45:00",
      status: "pendente"
    },
    {
      id: 8,
      numero: "000000125",
      tipo: "nfse",
      cliente: "Clínica Médica 123",
      valor: 1200,
      data_emissao: "2023-06-10T09:15:00",
      status: "emitida"
    },
    {
      id: 9,
      numero: "000000126",
      tipo: "nfse",
      cliente: "Escola de Idiomas JKL",
      valor: 800,
      data_emissao: "2023-06-05T16:20:00",
      status: "cancelada"
    },
    {
      id: 10,
      numero: "000000127",
      tipo: "nfse",
      cliente: "Agência de Marketing",
      valor: 4500,
      data_emissao: "2023-06-18T11:10:00",
      status: "emitida"
    }
  ]

  const getNotasFiscaisFiltradas = () => {
    const notasFiscais = activeTab === "nfe" ? notasFiscaisNFe : notasFiscaisNFSe
    
    return notasFiscais.filter((nf) => {
      const matchesSearch =
        nf.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nf.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || nf.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
            Pendente
          </Badge>
        )
      case "emitida":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
            Emitida
          </Badge>
        )
      case "cancelada":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
            Cancelada
          </Badge>
        )
      case "rejeitada":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500">
            Rejeitada
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const handleEmitirNota = () => {
    toast({
      title: "Emissão de Nota Fiscal",
      description: "Iniciando processo de emissão de nota fiscal",
    })
    setIsDialogOpen(true)
  }

  const handleDownloadXML = (notaFiscal: NotaFiscal) => {
    toast({
      title: "Download de XML",
      description: `Iniciando download do XML da nota ${notaFiscal.numero}`,
    })
  }

  const handleImprimirDANFE = (notaFiscal: NotaFiscal) => {
    toast({
      title: "Impressão de DANFE",
      description: `Preparando impressão do DANFE da nota ${notaFiscal.numero}`,
    })
  }

  const handleVisualizarNota = (notaFiscal: NotaFiscal) => {
    toast({
      title: "Visualizar Nota Fiscal",
      description: `Visualizando detalhes da nota ${notaFiscal.numero}`,
    })
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Nota Fiscal Eletrônica</h1>
          <Button onClick={handleEmitirNota} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Emitir Nota Fiscal
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="nfe">NF-e (Produtos)</TabsTrigger>
            <TabsTrigger value="nfse">NFS-e (Serviços)</TabsTrigger>
          </TabsList>

          <TabsContent value="nfe" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por número ou cliente..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-64">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="emitida">Emitida</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                        <SelectItem value="rejeitada">Rejeitada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data Emissão</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getNotasFiscaisFiltradas().map((nf) => (
                        <TableRow key={nf.id}>
                          <TableCell className="font-medium">{nf.numero}</TableCell>
                          <TableCell>{nf.cliente}</TableCell>
                          <TableCell>{formatDate(nf.data_emissao)}</TableCell>
                          <TableCell>{formatCurrency(nf.valor)}</TableCell>
                          <TableCell>{getStatusBadge(nf.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleVisualizarNota(nf)}
                                title="Visualizar"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {nf.status === "emitida" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDownloadXML(nf)}
                                    title="Download XML"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleImprimirDANFE(nf)}
                                    title="Imprimir DANFE"
                                  >
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Emitidas
                  </CardTitle>
                  <CardDescription>
                    Total de notas emitidas no mês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {notasFiscaisNFe.filter(nf => nf.status === "emitida").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Pendentes
                  </CardTitle>
                  <CardDescription>
                    Notas aguardando emissão
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {notasFiscaisNFe.filter(nf => nf.status === "pendente").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    Canceladas/Rejeitadas
                  </CardTitle>
                  <CardDescription>
                    Notas com problemas no mês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {notasFiscaisNFe.filter(nf => nf.status === "cancelada" || nf.status === "rejeitada").length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nfse" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por número ou cliente..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-64">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="emitida">Emitida</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                        <SelectItem value="rejeitada">Rejeitada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Data Emissão</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getNotasFiscaisFiltradas().map((nf) => (
                        <TableRow key={nf.id}>
                          <TableCell className="font-medium">{nf.numero}</TableCell>
                          <TableCell>{nf.cliente}</TableCell>
                          <TableCell>{formatDate(nf.data_emissao)}</TableCell>
                          <TableCell>{formatCurrency(nf.valor)}</TableCell>
                          <TableCell>{getStatusBadge(nf.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleVisualizarNota(nf)}
                                title="Visualizar"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {nf.status === "emitida" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDownloadXML(nf)}
                                    title="Download XML"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleImprimirDANFE(nf)}
                                    title="Imprimir"
                                  >
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Emitidas
                  </CardTitle>
                  <CardDescription>
                    Total de notas emitidas no mês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {notasFiscaisNFSe.filter(nf => nf.status === "emitida").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Pendentes
                  </CardTitle>
                  <CardDescription>
                    Notas aguardando emissão
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {notasFiscaisNFSe.filter(nf => nf.status === "pendente").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    Canceladas/Rejeitadas
                  </CardTitle>
                  <CardDescription>
                    Notas com problemas no mês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {notasFiscaisNFSe.filter(nf => nf.status === "cancelada" || nf.status === "rejeitada").length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Emitir Nota Fiscal</DialogTitle>
              <DialogDescription>
                Preencha os dados para emissão da nota fiscal
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cliente" className="text-right">
                  Cliente
                </Label>
                <Input id="cliente" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valor" className="text-right">
                  Valor
                </Label>
                <Input id="valor" className="col-span-3" type="number" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tipo" className="text-right">
                  Tipo
                </Label>
                <Select defaultValue={activeTab}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nfe">NF-e (Produtos)</SelectItem>
                    <SelectItem value="nfse">NFS-e (Serviços)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Nota fiscal emitida",
                  description: "A nota fiscal foi emitida com sucesso!",
                })
                setIsDialogOpen(false)
              }}>
                Emitir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}