"use client"

import { useState } from "react"
import { ClienteForm, Customer } from "@/components/clientes/cliente-form"
import PageHeader from "../../../components/layout/page-header"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"

export default function CadastroClientePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (data: Customer) => {
    setIsLoading(true)
    
    try {
      // Simulação de envio para API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Gerar código automático se for um novo cliente
      if (!data.code) {
        data.code = `CLI${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      }
      
      console.log("Cliente salvo:", data)
      
      toast({
        title: "Cliente salvo com sucesso",
        description: `O cliente ${data.name} foi cadastrado com o código ${data.code}.`,
      })
      
      // Redirecionar para a lista de clientes
      router.push("/clientes")
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
      
      toast({
        title: "Erro ao salvar cliente",
        description: "Ocorreu um erro ao salvar o cliente. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleCancel = () => {
    router.push("/clientes")
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          title="Cadastro de Cliente"
          description="Cadastre um novo cliente no sistema"
        />
        
        <ClienteForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </MainLayout>
  )
}
