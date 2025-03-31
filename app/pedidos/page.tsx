"use client"

import * as React from "react"
import { useState } from "react"
import { PlusCircle, FileText, Download, Printer, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { OrderData } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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

interface ExtendedOrderData extends OrderData {
  id: string
  status: 'pendente' | 'aprovado' | 'enviado' | 'entregue' | 'cancelado'
}

// Dados mockados para demonstração
const mockOrders: ExtendedOrderData[] = [
  {
    id: "PED-202504-0001",
    order_number: "PED-202504-0001",
    issue_date: new Date("2025-04-01T10:30:00"),
    delivery_date: new Date("2025-04-05T14:00:00"),
    customer: {
      name: "Empresa XYZ Ltda",
      document: "12.345.678/0001-90",
      email: "contato@empresaxyz.com.br",
      phone: "(11) 95555-1234"
    },
    seller: {
      name: "Carlos Silva"
    },
    shipping_address: "Av. Paulista, 1000, São Paulo, SP",
    billing_address: "Av. Paulista, 1000, São Paulo, SP",
    payment_method: "Boleto Bancário",
    payment_term: "30 dias",
    items: [
      {
        product_code: "NB-001",
        product_name: "Notebook Dell Inspiron 15",
        quantity: 3,
        unit: "un",
        unit_price: 3499.90,
        discount_percent: 5,
        subtotal: 10499.70,
        total: 9974.72
      },
      {
        product_code: "MON-001",
        product_name: "Monitor LG 24\"",
        quantity: 3,
        unit: "un",
        unit_price: 1299.50,
        discount_percent: 0,
        subtotal: 3898.50,
        total: 3898.50
      }
    ],
    shipping_cost: 150.00,
    other_costs: 0,
    subtotal: 14398.20,
    tax_total: 1295.84,
    total_amount: 15844.04,
    notes: "Entrega em horário comercial",
    status: "aprovado"
  },
  {
    id: "PED-202504-0002",
    order_number: "PED-202504-0002",
    issue_date: new Date("2025-04-02T14:45:00"),
    delivery_date: new Date("2025-04-10T09:00:00"),
    customer: {
      name: "Consultório Médico ABC",
      document: "23.456.789/0001-12",
      email: "contato@clinicaabc.com.br",
      phone: "(11) 3333-4444"
    },
    seller: {
      name: "Maria Oliveira"
    },
    shipping_address: "Rua Augusta, 500, São Paulo, SP",
    billing_address: "Rua Augusta, 500, São Paulo, SP",
    payment_method: "Cartão de Crédito",
    payment_term: "À vista",
    items: [
      {
        product_code: "MOUSE-001",
        product_name: "Mouse sem fio Logitech",
        quantity: 5,
        unit: "un",
        unit_price: 129.90,
        discount_percent: 0,
        subtotal: 649.50,
        total: 649.50
      },
      {
        product_code: "CAD-001",
        product_name: "Cadeira Ergonômica",
        quantity: 5,
        unit: "un",
        unit_price: 899.90,
        discount_percent: 10,
        subtotal: 4499.50,
        total: 4049.55
      }
    ],
    shipping_cost: 200.00,
    other_costs: 50.00,
    subtotal: 5149.00,
    tax_total: 463.41,
    total_amount: 5862.41,
    notes: "",
    status: "pendente"
  },
  {
    id: "PED-202504-0003",
    order_number: "PED-202504-0003",
    issue_date: new Date("2025-04-03T09:15:00"),
    delivery_date: new Date("2025-04-15T13:30:00"),
    customer: {
      name: "Escola Futuro",
      document: "34.567.890/0001-23",
      email: "compras@escolafuturo.edu.br",
      phone: "(11) 2222-3333"
    },
    seller: {
      name: "Pedro Santos"
    },
    shipping_address: "Av. Rebouças, 1234, São Paulo, SP",
    billing_address: "Av. Rebouças, 1234, São Paulo, SP",
    payment_method: "Transferência Bancária",
    payment_term: "15 dias",
    items: [
      {
        product_code: "NB-001",
        product_name: "Notebook Dell Inspiron 15",
        quantity: 10,
        unit: "un",
        unit_price: 3499.90,
        discount_percent: 12,
        subtotal: 34999.00,
        total: 30799.12
      },
      {
        product_code: "MOUSE-001",
        product_name: "Mouse sem fio Logitech",
        quantity: 10,
        unit: "un",
        unit_price: 129.90,
        discount_percent: 5,
        subtotal: 1299.00,
        total: 1234.05
      }
    ],
    shipping_cost: 0,
    other_costs: 0,
    subtotal: 36298.00,
    tax_total: 3266.82,
    total_amount: 35299.99,
    notes: "Entrega diretamente no laboratório de informática",
    status: "enviado"
  },
  {
    id: "PED-202504-0004",
    order_number: "PED-202504-0004",
    issue_date: new Date("2025-04-05T16:20:00"),
    delivery_date: new Date("2025-04-12T10:00:00"),
    customer: {
      name: "Distribuidora JL",
      document: "45.678.901/0001-34",
      email: "pedidos@distribuidorajl.com.br",
      phone: "(11) 4444-5555"
    },
    seller: {
      name: "Ana Costa"
    },
    shipping_address: "Rua Vergueiro, 3000, São Paulo, SP",
    billing_address: "Rua Vergueiro, 3000, São Paulo, SP",
    payment_method: "Boleto Bancário",
    payment_term: "45 dias",
    items: [
      {
        product_code: "TV-001",
        product_name: "Smart TV LED 4K 50\"",
        quantity: 4,
        unit: "un",
        unit_price: 3299.00,
        discount_percent: 8,
        subtotal: 13196.00,
        total: 12140.32
      }
    ],
    shipping_cost: 300.00,
    other_costs: 0,
    subtotal: 13196.00,
    tax_total: 1187.64,
    total_amount: 13627.96,
    notes: "",
    status: "entregue"
  },
  {
    id: "PED-202504-0005",
    order_number: "PED-202504-0005",
    issue_date: new Date("2025-04-10T11:35:00"),
    delivery_date: undefined,
    customer: {
      name: "Clínica Saúde Total",
      document: "56.789.012/0001-45",
      email: "compras@clinicasaudetotal.com.br",
      phone: "(11) 5555-6666"
    },
    seller: {
      name: "Carlos Silva"
    },
    shipping_address: "Av. Brigadeiro Faria Lima, 2000, São Paulo, SP",
    billing_address: "Av. Brigadeiro Faria Lima, 2000, São Paulo, SP",
    payment_method: "PIX",
    payment_term: "À vista",
    items: [
      {
        product_code: "PHONE-001",
        product_name: "Smartphone 128GB",
        quantity: 2,
        unit: "un",
        unit_price: 2599.00,
        discount_percent: 0,
        subtotal: 5198.00,
        total: 5198.00
      }
    ],
    shipping_cost: 100.00,
    other_costs: 0,
    subtotal: 5198.00,
    tax_total: 467.82,
    total_amount: 5765.82,
    notes: "Cliente cancelou por mudança nos requisitos",
    status: "cancelado"
  }
];

// Constantes para as cores do status
const STATUS_COLORS = {
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  aprovado: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  enviado: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  entregue: "bg-green-100 text-green-800 hover:bg-green-200",
  cancelado: "bg-red-100 text-red-800 hover:bg-red-200"
};

export default function PedidosPage() {
  const [viewOrder, setViewOrder] = useState<ExtendedOrderData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  
  // Filtrar pedidos
  const filteredOrders = React.useMemo(() => {
    return mockOrders.filter(order => {
      // Filtro de pesquisa
      const searchMatch = !searchTerm || 
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.document.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filtro de status
      const statusMatch = !statusFilter || order.status === statusFilter
      
      return searchMatch && statusMatch
    })
  }, [searchTerm, statusFilter])

  // Configuração das colunas do DataTable
  const columns = [
    {
      key: "order_number",
      header: "Nº Pedido",
      sortable: true
    },
    {
      key: "customer",
      header: "Cliente",
      formatter: (value: ExtendedOrderData["customer"]) => value.name
    },
    {
      key: "issue_date",
      header: "Data Emissão",
      formatter: (value: Date) => formatDate(value),
      sortable: true
    },
    {
      key: "total_amount",
      header: "Valor",
      formatter: (value: number) => formatCurrency(value),
      sortable: true
    },
    {
      key: "status",
      header: "Status",
      formatter: (value: ExtendedOrderData["status"]) => (
        <Badge className={STATUS_COLORS[value]}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    }
  ]

  // Ações para cada pedido
  const actions = [
    {
      label: "Visualizar",
      icon: <FileText className="mr-2 h-4 w-4" />,
      onClick: (order: ExtendedOrderData) => {
        setViewOrder(order)
        setIsDialogOpen(true)
      }
    },
    {
      label: "Gerar PDF",
      icon: <Download className="mr-2 h-4 w-4" />,
      onClick: (order: ExtendedOrderData) => {
        alert(`Gerando PDF do pedido ${order.order_number}`)
        // Aqui seria implementada a chamada para o gerador de PDF
      }
    },
    {
      label: "Imprimir",
      icon: <Printer className="mr-2 h-4 w-4" />,
      onClick: (order: ExtendedOrderData) => {
        alert(`Imprimindo pedido ${order.order_number}`)
        // Aqui seria implementada a lógica de impressão
      }
    }
  ]

  // Configuração da paginação
  const pagination = {
    pageSize: 10,
    currentPage: 1,
    totalItems: filteredOrders.length,
    onPageChange: (page: number) => {
      console.log(`Mudando para página ${page}`)
      // Implementação da paginação real seria aqui
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Gerenciar Pedidos</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os pedidos do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por número, cliente, documento..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DataTable
              data={filteredOrders}
              columns={columns}
              actions={actions}
              pagination={pagination}
              onRowClick={(order) => {
                setViewOrder(order as ExtendedOrderData)
                setIsDialogOpen(true)
              }}
              emptyMessage="Nenhum pedido encontrado"
            />
          </CardContent>
        </Card>
      </div>

      {/* Modal para visualizar o pedido */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
            <DialogDescription>
              {viewOrder && `Pedido ${viewOrder.order_number} - ${formatDate(viewOrder.issue_date)}`}
            </DialogDescription>
          </DialogHeader>

          {viewOrder && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Informações do Cliente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <p><strong>Nome:</strong> {viewOrder.customer.name}</p>
                      <p><strong>Documento:</strong> {viewOrder.customer.document}</p>
                      <p><strong>Email:</strong> {viewOrder.customer.email}</p>
                      <p><strong>Telefone:</strong> {viewOrder.customer.phone}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Informações de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <p><strong>Endereço de Entrega:</strong> {viewOrder.shipping_address}</p>
                      <p><strong>Previsão de Entrega:</strong> {viewOrder.delivery_date ? formatDate(viewOrder.delivery_date) : 'Não definida'}</p>
                      <p><strong>Status:</strong> 
                        <Badge className={`ml-2 ${STATUS_COLORS[viewOrder.status]}`}>
                          {viewOrder.status.charAt(0).toUpperCase() + viewOrder.status.slice(1)}
                        </Badge>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <table className="w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Unit.</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Desc.</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {viewOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                                <div className="text-xs text-gray-500">{item.product_code}</div>
                              </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-right text-sm text-gray-500">
                              {formatCurrency(item.unit_price)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                              {item.discount_percent > 0 ? `${item.discount_percent}%` : '-'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                              {formatCurrency(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Pagamento e Totais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 text-sm">
                      <p><strong>Forma de Pagamento:</strong> {viewOrder.payment_method}</p>
                      <p><strong>Condição de Pagamento:</strong> {viewOrder.payment_term}</p>
                      <p><strong>Vendedor:</strong> {viewOrder.seller?.name || 'Não informado'}</p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(viewOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frete:</span>
                        <span>{formatCurrency(viewOrder.shipping_cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Outros custos:</span>
                        <span>{formatCurrency(viewOrder.other_costs)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Impostos:</span>
                        <span>{formatCurrency(viewOrder.tax_total)}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t mt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(viewOrder.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {viewOrder.notes && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{viewOrder.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                alert(`Gerando PDF do pedido ${viewOrder?.order_number}`)
              }}>
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button variant="outline" onClick={() => {
                alert(`Imprimindo pedido ${viewOrder?.order_number}`)
              }}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
            </div>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
