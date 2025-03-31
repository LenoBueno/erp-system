"use client"

import { useState, useEffect } from "react"
import { ClienteForm, Customer } from "@/components/clientes/cliente-form"
import PageHeader from "@/components/layout/page-header"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface EditarClientePageProps {
  params: {
    id: string
  }
}

export default function EditarClientePage({ params }: EditarClientePageProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true)
      
      try {
        // Em um cenário real, você faria uma chamada para a API
        // Simulação de dados para desenvolvimento
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Dados simulados baseados no ID
        const mockCustomers: Record<string, Customer> = {
          "1": {
            id: 1,
            code: "CLI0001",
            name: "Empresa ABC Ltda",
            type: "PJ",
            document: "12.345.678/0001-90",
            group: "distribuidor",
            status: "active",
            email: "contato@empresaabc.com.br",
            phone: "(11) 3456-7890",
            contact_name: "João Silva",
            billing_address: {
              street: "Av. Paulista",
              number: "1000",
              complement: "Sala 123",
              neighborhood: "Bela Vista",
              city: "São Paulo",
              state: "SP",
              postal_code: "01310-100",
              country: "Brasil"
            },
            shipping_address: {
              same_as_billing: true,
              street: "Av. Paulista",
              number: "1000",
              complement: "Sala 123",
              neighborhood: "Bela Vista",
              city: "São Paulo",
              state: "SP",
              postal_code: "01310-100",
              country: "Brasil"
            },
            currency: "BRL",
            price_table: "distribuidor",
            payment_method: "boleto,pix",
            payment_term: "30_days",
            credit_limit: 50000,
            total_orders: 15,
            total_spent: 35000,
            notes: "Cliente desde 2020",
            attachments: [],
            created_at: "2023-01-15T10:30:00Z",
            updated_at: "2023-05-20T14:45:00Z"
          },
          "2": {
            id: 2,
            code: "CLI0002",
            name: "Comércio XYZ",
            type: "PJ",
            document: "98.765.432/0001-10",
            group: "varejo",
            status: "active",
            email: "contato@comercioxyz.com.br",
            phone: "(21) 2345-6789",
            contact_name: "Maria Oliveira",
            billing_address: {
              street: "Rua do Comércio",
              number: "500",
              complement: "",
              neighborhood: "Centro",
              city: "Rio de Janeiro",
              state: "RJ",
              postal_code: "20010-020",
              country: "Brasil"
            },
            shipping_address: {
              same_as_billing: false,
              street: "Rodovia BR 101",
              number: "km 10",
              complement: "Galpão 5",
              neighborhood: "Distrito Industrial",
              city: "Duque de Caxias",
              state: "RJ",
              postal_code: "25000-000",
              country: "Brasil"
            },
            currency: "BRL",
            price_table: "varejo",
            payment_method: "credit_card,pix",
            payment_term: "installments",
            credit_limit: 20000,
            total_orders: 8,
            total_spent: 12500,
            notes: "",
            attachments: [],
            created_at: "2023-02-10T09:15:00Z",
            updated_at: "2023-06-05T11:30:00Z"
          },
          "3": {
            id: 3,
            code: "CLI0003",
            name: "José Pereira",
            type: "PF",
            document: "123.456.789-00",
            group: "varejo",
            status: "inactive",
            email: "jose.pereira@email.com",
            phone: "(31) 98765-4321",
            contact_name: "",
            billing_address: {
              street: "Rua das Flores",
              number: "123",
              complement: "Apto 101",
              neighborhood: "Jardim América",
              city: "Belo Horizonte",
              state: "MG",
              postal_code: "30000-000",
              country: "Brasil"
            },
            shipping_address: {
              same_as_billing: true,
              street: "Rua das Flores",
              number: "123",
              complement: "Apto 101",
              neighborhood: "Jardim América",
              city: "Belo Horizonte",
              state: "MG",
              postal_code: "30000-000",
              country: "Brasil"
            },
            currency: "BRL",
            price_table: "varejo",
            payment_method: "pix",
            payment_term: "cash",
            credit_limit: 5000,
            total_orders: 3,
            total_spent: 1800,
            notes: "Cliente com histórico de atrasos",
            attachments: [],
            created_at: "2023-03-20T14:00:00Z",
            updated_at: "2023-04-10T16:20:00Z"
          }
        }
        
        const customer = mockCustomers[params.id]
        
        if (!customer) {
          throw new Error("Cliente não encontrado")
        }
        
        setCustomer(customer)
      } catch (error) {
        console.error("Erro ao buscar cliente:", error)
        
        toast({
          title: "Erro ao carregar cliente",
          description: "Não foi possível encontrar o cliente solicitado.",
          variant: "destructive",
        })
        
        router.push("/clientes")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCustomer()
  }, [params.id, router, toast])
  
  const handleSubmit = async (data: Customer) => {
    setIsSaving(true)
    
    try {
      // Simulação de envio para API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log("Cliente atualizado:", data)
      
      toast({
        title: "Cliente atualizado com sucesso",
        description: `As informações do cliente ${data.name} foram atualizadas.`,
      })
      
      // Redirecionar para a lista de clientes
      router.push("/clientes")
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error)
      
      toast({
        title: "Erro ao atualizar cliente",
        description: "Ocorreu um erro ao atualizar o cliente. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleCancel = () => {
    router.push("/clientes")
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando informações do cliente...</p>
        </div>
      </div>
    )
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          title="Editar Cliente"
          description={`Editando o cliente ${customer?.name} (${customer?.code})`}
        />
        
        {customer && (
          <ClienteForm
            initialData={customer}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        )}
      </div>
    </MainLayout>
  )
}
