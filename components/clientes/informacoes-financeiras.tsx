"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface Order {
  id: string
  date: string
  number: string
  total: number
  status: string
  payment_status: string
}

interface InformacoesFinanceirasProps {
  data: {
    credit_limit: number
    total_orders: number
    total_spent: number
    status: string
  }
  orders: Order[]
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export function InformacoesFinanceiras({ data, orders = [], onChange, errors }: InformacoesFinanceirasProps) {
  const [creditLimitValue, setCreditLimitValue] = useState(
    data.credit_limit ? formatCurrency(data.credit_limit, false) : ""
  )
  
  const handleCreditLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const numericValue = value ? parseInt(value) / 100 : 0
    
    setCreditLimitValue(formatCurrency(numericValue, false))
    onChange("credit_limit", numericValue)
  }
  
  const getCreditStatus = () => {
    if (!data.credit_limit) return "normal"
    
    const usedPercentage = (data.total_spent / data.credit_limit) * 100
    
    if (usedPercentage >= 100) return "exceeded"
    if (usedPercentage >= 80) return "warning"
    return "normal"
  }
  
  const creditStatus = getCreditStatus()
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendente</Badge>
      case "processing":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Em Processamento</Badge>
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>
      case "cancelled":
        return <Badge variant="outline" className="text-red-500 border-red-200">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-200">Pendente</Badge>
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Pago</Badge>
      case "partial":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Parcial</Badge>
      case "refunded":
        return <Badge variant="outline" className="text-blue-500 border-blue-200">Reembolsado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações de Crédito</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="credit_limit">Limite de Crédito</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input 
                  id="credit_limit" 
                  value={creditLimitValue} 
                  onChange={handleCreditLimitChange}
                  className={`pl-8 ${errors.credit_limit ? "border-red-500" : ""}`}
                />
              </div>
              {errors.credit_limit && <p className="text-xs text-red-500">{errors.credit_limit}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Total Gasto</Label>
              <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                {formatCurrency(data.total_spent)}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status de Crédito</Label>
              <div className="h-10 px-3 py-2 rounded-md border flex items-center gap-2">
                {creditStatus === "normal" && (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Normal</span>
                  </>
                )}
                {creditStatus === "warning" && (
                  <>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span>Próximo ao Limite</span>
                  </>
                )}
                {creditStatus === "exceeded" && (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>Limite Excedido</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {data.credit_limit > 0 && (
            <div className="mt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Utilização do Limite</span>
                  <span>
                    {formatCurrency(data.total_spent)} de {formatCurrency(data.credit_limit)}
                    {" "}
                    ({Math.round((data.total_spent / data.credit_limit) * 100)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      creditStatus === "normal" 
                        ? "bg-green-500" 
                        : creditStatus === "warning" 
                          ? "bg-yellow-500" 
                          : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min((data.total_spent / data.credit_limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Compras</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Nenhum pedido encontrado para este cliente.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Pedido</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.number}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
