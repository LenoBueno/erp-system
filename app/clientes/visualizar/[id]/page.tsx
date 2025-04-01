"use client"

import { useState, useEffect } from "react"
import PageHeader from "@/components/layout/page-header"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Edit, Trash2 } from "lucide-react"
import { Customer } from "@/components/clientes/cliente-form"
import { formatCurrency } from "@/lib/utils"
import { MainLayout } from "@/components/layout/main-layout"

interface VisualizarClientePageProps {
  params: {
    id: string
  }
}

export default function VisualizarClientePage({ params }: VisualizarClientePageProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true)
      
      try {
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
  
  if (!customer) {
    return null
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <PageHeader
            title={customer.name}
            description={`Código: ${customer.code} | Cadastrado em: ${new Date(customer.created_at || "").toLocaleDateString("pt-BR")}`}
          />
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/clientes")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button onClick={() => router.push(`/clientes/editar/${customer.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Badge className={customer.status === "active" ? "bg-green-500" : "bg-red-500"}>
                  {customer.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <p className="font-medium">
                  {customer.type === "PJ" ? "Pessoa Jurídica" : "Pessoa Física"}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Documento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <p className="font-medium">{customer.document}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="dados-gerais">
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
            <Card>
              <CardHeader>
                <CardTitle>Dados Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Código</h3>
                    <p>{customer.code}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Nome</h3>
                    <p>{customer.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Tipo</h3>
                    <p>{customer.type === "PJ" ? "Pessoa Jurídica" : "Pessoa Física"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Documento</h3>
                    <p>{customer.document}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Grupo</h3>
                    <p className="capitalize">{customer.group}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Status</h3>
                    <Badge className={customer.status === "active" ? "bg-green-500" : "bg-red-500"}>
                      {customer.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contatos-enderecos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p>{customer.email}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Telefone</h3>
                      <p>{customer.phone}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Contato</h3>
                      <p>{customer.contact_name || "Não informado"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Endereço de Faturamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      {customer.billing_address.street}, {customer.billing_address.number}
                      {customer.billing_address.complement && `, ${customer.billing_address.complement}`}
                    </p>
                    <p>
                      {customer.billing_address.neighborhood} - {customer.billing_address.city}/{customer.billing_address.state}
                    </p>
                    <p>
                      CEP: {customer.billing_address.postal_code}
                    </p>
                    <p>
                      {customer.billing_address.country}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {!customer.shipping_address.same_as_billing && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Endereço de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        {customer.shipping_address.street}, {customer.shipping_address.number}
                        {customer.shipping_address.complement && `, ${customer.shipping_address.complement}`}
                      </p>
                      <p>
                        {customer.shipping_address.neighborhood} - {customer.shipping_address.city}/{customer.shipping_address.state}
                      </p>
                      <p>
                        CEP: {customer.shipping_address.postal_code}
                      </p>
                      <p>
                        {customer.shipping_address.country}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="condicoes-comerciais">
            <Card>
              <CardHeader>
                <CardTitle>Condições Comerciais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Moeda</h3>
                    <p>{customer.currency}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Tabela de Preços</h3>
                    <p className="capitalize">{customer.price_table}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Formas de Pagamento</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {customer.payment_method.split(',').map((method) => (
                        <Badge key={method} variant="outline">
                          {method === "boleto" && "Boleto Bancário"}
                          {method === "credit_card" && "Cartão de Crédito"}
                          {method === "pix" && "PIX"}
                          {method === "bank_transfer" && "Transferência Bancária"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Condição de Pagamento</h3>
                    <p>
                      {customer.payment_term === "cash" && "À Vista"}
                      {customer.payment_term === "installments" && "Parcelado"}
                      {customer.payment_term === "30_days" && "30 dias"}
                      {customer.payment_term === "60_days" && "60 dias"}
                      {customer.payment_term === "90_days" && "90 dias"}
                      {customer.payment_term === "30_60_90_days" && "30/60/90 dias"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="informacoes-financeiras">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Crédito</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold">Limite de Crédito</h3>
                      <p>{formatCurrency(customer.credit_limit)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Total Gasto</h3>
                      <p>{formatCurrency(customer.total_spent)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Status de Crédito</h3>
                      <p>
                        {customer.total_spent >= customer.credit_limit ? (
                          <Badge variant="destructive">Limite Excedido</Badge>
                        ) : customer.total_spent >= customer.credit_limit * 0.8 ? (
                          <Badge className="bg-yellow-500">Próximo ao Limite</Badge>
                        ) : (
                          <Badge className="bg-green-500">Normal</Badge>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {customer.credit_limit > 0 && (
                    <div className="mt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Utilização do Limite</span>
                          <span>
                            {formatCurrency(customer.total_spent)} de {formatCurrency(customer.credit_limit)}
                            {" "}
                            ({Math.round((customer.total_spent / customer.credit_limit) * 100)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              customer.total_spent >= customer.credit_limit 
                                ? "bg-red-500" 
                                : customer.total_spent >= customer.credit_limit * 0.8
                                  ? "bg-yellow-500" 
                                  : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min((customer.total_spent / customer.credit_limit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="observacoes-anexos">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Observações Internas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{customer.notes || "Nenhuma observação registrada."}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Anexos</CardTitle>
                </CardHeader>
                <CardContent>
                  {customer.attachments && customer.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {customer.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center space-x-3">
                            <p className="text-sm">{attachment.split('/').pop()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Nenhum anexo disponível.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
