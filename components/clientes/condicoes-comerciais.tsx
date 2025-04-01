"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface CondicoesComerciais {
  currency: string
  price_table: string
  payment_method: string
  payment_term: string
}

interface CondicoesComercaisProps {
  data: CondicoesComerciais
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export function CondicoesComerciais({ data, onChange, errors }: CondicoesComercaisProps) {
  const paymentMethods = [
    { id: "boleto", label: "Boleto Bancário" },
    { id: "credit_card", label: "Cartão de Crédito" },
    { id: "pix", label: "PIX" },
    { id: "bank_transfer", label: "Transferência Bancária" }
  ]
  
  const handlePaymentMethodChange = (id: string, checked: boolean) => {
    let methods = data.payment_method ? data.payment_method.split(",") : []
    
    if (checked) {
      if (!methods.includes(id)) {
        methods.push(id)
      }
    } else {
      methods = methods.filter(method => method !== id)
    }
    
    onChange("payment_method", methods.join(","))
  }
  
  const isPaymentMethodChecked = (id: string) => {
    return data.payment_method ? data.payment_method.split(",").includes(id) : false
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Condições Comerciais</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="currency" className="required">Moeda Padrão</Label>
            <Select 
              value={data.currency} 
              onValueChange={(value) => onChange("currency", value)}
            >
              <SelectTrigger className={errors.currency ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione a moeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
              </SelectContent>
            </Select>
            {errors.currency && <p className="text-xs text-red-500">{errors.currency}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price_table" className="required">Tabela de Preços</Label>
            <Select 
              value={data.price_table} 
              onValueChange={(value) => onChange("price_table", value)}
            >
              <SelectTrigger className={errors.price_table ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione a tabela" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padrao">Tabela Padrão</SelectItem>
                <SelectItem value="atacado">Tabela Atacado</SelectItem>
                <SelectItem value="varejo">Tabela Varejo</SelectItem>
                <SelectItem value="distribuidor">Tabela Distribuidor</SelectItem>
                <SelectItem value="especial">Tabela Especial</SelectItem>
              </SelectContent>
            </Select>
            {errors.price_table && <p className="text-xs text-red-500">{errors.price_table}</p>}
          </div>
          
          <div className="space-y-4 md:col-span-2">
            <Label className="required">Formas de Pagamento</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`payment_method_${method.id}`} 
                    checked={isPaymentMethodChecked(method.id)}
                    onCheckedChange={(checked) => 
                      handlePaymentMethodChange(method.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`payment_method_${method.id}`}>{method.label}</Label>
                </div>
              ))}
            </div>
            {errors.payment_method && <p className="text-xs text-red-500">{errors.payment_method}</p>}
          </div>
          
          <div className="space-y-4 md:col-span-2">
            <Label htmlFor="payment_term" className="required">Condição de Pagamento</Label>
            <RadioGroup 
              value={data.payment_term} 
              onValueChange={(value) => onChange("payment_term", value)}
              className={errors.payment_term ? "border border-red-500 rounded-md p-4" : ""}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="payment_term_cash" />
                  <Label htmlFor="payment_term_cash">À Vista</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="installments" id="payment_term_installments" />
                  <Label htmlFor="payment_term_installments">Parcelado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30_days" id="payment_term_30_days" />
                  <Label htmlFor="payment_term_30_days">30 dias</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60_days" id="payment_term_60_days" />
                  <Label htmlFor="payment_term_60_days">60 dias</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="90_days" id="payment_term_90_days" />
                  <Label htmlFor="payment_term_90_days">90 dias</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30_60_90_days" id="payment_term_30_60_90_days" />
                  <Label htmlFor="payment_term_30_60_90_days">30/60/90 dias</Label>
                </div>
              </div>
            </RadioGroup>
            {errors.payment_term && <p className="text-xs text-red-500">{errors.payment_term}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
