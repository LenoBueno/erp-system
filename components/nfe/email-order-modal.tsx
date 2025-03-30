"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmailOrderModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  orderNumber: string
  customerEmail: string
  customerName: string
}

export function EmailOrderModal({ 
  isOpen, 
  onClose, 
  orderId, 
  orderNumber, 
  customerEmail, 
  customerName 
}: EmailOrderModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState(customerEmail)
  const [subject, setSubject] = useState(`Pedido ${orderNumber}`)
  const [message, setMessage] = useState(
    `Prezado(a) ${customerName},\n\nSegue em anexo o pedido ${orderNumber}.\n\nAgradecemos pela preferência!`
  )
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleSendEmail = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      // Em um ambiente real, aqui seria feita uma chamada para a API
      // Simulação do envio de e-mail
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simular sucesso
      setSuccess(true)
      
      toast({
        title: "E-mail enviado com sucesso",
        description: `O pedido foi enviado para ${email}`,
      })
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido ao enviar e-mail")
      
      toast({
        title: "Erro ao enviar e-mail",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar enviar o e-mail",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setSuccess(false)
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enviar Pedido por E-mail</DialogTitle>
          <DialogDescription>
            Enviar o pedido {orderNumber} por e-mail para o cliente
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {success ? (
            <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-400">E-mail enviado com sucesso</h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    <p>O pedido foi enviado para {email}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Erro ao enviar e-mail</h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Assunto do e-mail"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite a mensagem..."
                    rows={5}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {!success && (
            <Button onClick={handleSendEmail} disabled={isLoading || !email}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar E-mail
                </>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {success ? "Fechar" : "Cancelar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}