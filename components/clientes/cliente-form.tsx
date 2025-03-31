"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DadosGerais } from "./dados-gerais"
import { ContatosEnderecos } from "./contatos-enderecos"
import { CondicoesComerciais } from "./condicoes-comerciais"
import { InformacoesFinanceiras } from "./informacoes-financeiras"
import { ObservacoesAnexos } from "./observacoes-anexos"
import { useToast } from "@/hooks/use-toast"
import { Save, Loader2 } from "lucide-react"

export interface Customer {
  id?: number
  code: string
  name: string
  type: string
  document: string
  group: string
  status: string
  
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
  currency: string
  price_table: string
  payment_method: string
  payment_term: string
  
  // Informações Financeiras
  credit_limit: number
  total_orders: number
  total_spent: number
  
  // Observações e Anexos
  notes: string
  attachments: string[]
  
  created_at?: string
  updated_at?: string
}

interface Order {
  id: string
  date: string
  number: string
  total: number
  status: string
  payment_status: string
}

interface ClienteFormProps {
  initialData?: Customer
  onSubmit: (data: Customer) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ClienteForm({ initialData, onSubmit, onCancel, isLoading = false }: ClienteFormProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dados-gerais")
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<Customer>({
    code: "",
    name: "",
    type: "",
    document: "",
    group: "",
    status: "active",
    
    email: "",
    phone: "",
    contact_name: "",
    
    billing_address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Brasil",
    },
    shipping_address: {
      same_as_billing: true,
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Brasil",
    },
    
    currency: "BRL",
    price_table: "",
    payment_method: "",
    payment_term: "",
    
    credit_limit: 0,
    total_orders: 0,
    total_spent: 0,
    
    notes: "",
    attachments: [],
  })
  
  // Dados simulados para o histórico de pedidos
  const [orders, setOrders] = useState<Order[]>([])
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      
      // Simulação de pedidos para clientes existentes
      if (initialData.id) {
        const mockOrders: Order[] = [
          {
            id: "1",
            date: "2025-02-15",
            number: "PED-2025-001",
            total: 1250.75,
            status: "completed",
            payment_status: "paid"
          },
          {
            id: "2",
            date: "2025-03-10",
            number: "PED-2025-015",
            total: 3780.25,
            status: "completed",
            payment_status: "paid"
          },
          {
            id: "3",
            date: "2025-03-25",
            number: "PED-2025-032",
            total: 950.00,
            status: "processing",
            payment_status: "pending"
          }
        ]
        setOrders(mockOrders)
      }
    }
  }, [initialData])
  
  const handleFieldChange = (field: string, value: any) => {
    // Lidar com campos aninhados (como billing_address.street)
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData(prev => {
        // Garantir que prev[parent] seja tratado como um objeto
        const parentObj = prev[parent as keyof Customer] as Record<string, any>;
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    // Limpar erro do campo quando ele for alterado
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Validar Dados Gerais
    if (!formData.name) newErrors.name = "Nome é obrigatório"
    if (!formData.type) newErrors.type = "Tipo de cliente é obrigatório"
    if (!formData.document) newErrors.document = "Documento é obrigatório"
    if (!formData.group) newErrors.group = "Grupo é obrigatório"
    
    // Validar Contatos
    if (!formData.email) {
      newErrors.email = "E-mail é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido"
    }
    
    if (!formData.phone) newErrors.phone = "Telefone é obrigatório"
    
    // Validar Endereço de Faturamento
    if (!formData.billing_address.postal_code) newErrors["billing_address.postal_code"] = "CEP é obrigatório"
    if (!formData.billing_address.street) newErrors["billing_address.street"] = "Rua é obrigatória"
    if (!formData.billing_address.number) newErrors["billing_address.number"] = "Número é obrigatório"
    if (!formData.billing_address.neighborhood) newErrors["billing_address.neighborhood"] = "Bairro é obrigatório"
    if (!formData.billing_address.city) newErrors["billing_address.city"] = "Cidade é obrigatória"
    if (!formData.billing_address.state) newErrors["billing_address.state"] = "Estado é obrigatório"
    if (!formData.billing_address.country) newErrors["billing_address.country"] = "País é obrigatório"
    
    // Validar Endereço de Entrega (se não for o mesmo que o de faturamento)
    if (!formData.shipping_address.same_as_billing) {
      if (!formData.shipping_address.postal_code) newErrors["shipping_address.postal_code"] = "CEP é obrigatório"
      if (!formData.shipping_address.street) newErrors["shipping_address.street"] = "Rua é obrigatória"
      if (!formData.shipping_address.number) newErrors["shipping_address.number"] = "Número é obrigatório"
      if (!formData.shipping_address.neighborhood) newErrors["shipping_address.neighborhood"] = "Bairro é obrigatório"
      if (!formData.shipping_address.city) newErrors["shipping_address.city"] = "Cidade é obrigatória"
      if (!formData.shipping_address.state) newErrors["shipping_address.state"] = "Estado é obrigatório"
      if (!formData.shipping_address.country) newErrors["shipping_address.country"] = "País é obrigatório"
    }
    
    // Validar Condições Comerciais
    if (!formData.currency) newErrors.currency = "Moeda é obrigatória"
    if (!formData.price_table) newErrors.price_table = "Tabela de preços é obrigatória"
    if (!formData.payment_method) newErrors.payment_method = "Pelo menos uma forma de pagamento é obrigatória"
    if (!formData.payment_term) newErrors.payment_term = "Condição de pagamento é obrigatória"
    
    setErrors(newErrors)
    
    // Se houver erros, navegar para a primeira aba com erro
    if (Object.keys(newErrors).length > 0) {
      const errorFields = Object.keys(newErrors)
      
      if (errorFields.some(field => 
        field === "name" || field === "type" || field === "document" || field === "group"
      )) {
        setActiveTab("dados-gerais")
      } else if (errorFields.some(field => 
        field === "email" || field === "phone" || 
        field.startsWith("billing_address.") || field.startsWith("shipping_address.")
      )) {
        setActiveTab("contatos-enderecos")
      } else if (errorFields.some(field => 
        field === "currency" || field === "price_table" || 
        field === "payment_method" || field === "payment_term"
      )) {
        setActiveTab("condicoes-comerciais")
      }
      
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive",
      })
      
      return false
    }
    
    return true
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="dados-gerais">
            Dados Gerais
          </TabsTrigger>
          <TabsTrigger value="contatos-enderecos">
            Contatos e Endereços
          </TabsTrigger>
          <TabsTrigger value="condicoes-comerciais">
            Condições Comerciais
          </TabsTrigger>
          <TabsTrigger value="informacoes-financeiras">
            Informações Financeiras
          </TabsTrigger>
          <TabsTrigger value="observacoes-anexos">
            Observações e Anexos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dados-gerais">
          <DadosGerais 
            data={{
              code: formData.code,
              name: formData.name,
              type: formData.type,
              document: formData.document,
              group: formData.group,
              status: formData.status
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        </TabsContent>
        
        <TabsContent value="contatos-enderecos">
          <ContatosEnderecos 
            data={{
              email: formData.email,
              phone: formData.phone,
              contact_name: formData.contact_name,
              billing_address: formData.billing_address,
              shipping_address: formData.shipping_address
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        </TabsContent>
        
        <TabsContent value="condicoes-comerciais">
          <CondicoesComerciais 
            data={{
              currency: formData.currency,
              price_table: formData.price_table,
              payment_method: formData.payment_method,
              payment_term: formData.payment_term
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        </TabsContent>
        
        <TabsContent value="informacoes-financeiras">
          <InformacoesFinanceiras 
            data={{
              credit_limit: formData.credit_limit,
              total_orders: formData.total_orders,
              total_spent: formData.total_spent,
              status: formData.status
            }}
            orders={orders}
            onChange={handleFieldChange}
            errors={errors}
          />
        </TabsContent>
        
        <TabsContent value="observacoes-anexos">
          <ObservacoesAnexos 
            data={{
              notes: formData.notes,
              attachments: formData.attachments
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Cliente
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
