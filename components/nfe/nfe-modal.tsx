"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, FileText, Mail, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NFEModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  orderNumber: string
  customerEmail: string
}

interface NFEResponse {
  success: boolean
  message: string
  nfe_number?: string
  access_key?: string
  pdf_url?: string
  xml_url?: string
  emailSent?: boolean
  emailMessage?: string
}

export function NFEModal({ isOpen, onClose, orderId, orderNumber, customerEmail }: NFEModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [sendEmail, setSendEmail] = useState(true)
  const [nfeData, setNfeData] = useState<NFEResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"initial" | "success" | "error">("initial")
  const { toast } = useToast()

  const handleGenerateNFE = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/orders/${orderId}/nfe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sendEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Falha ao gerar nota fiscal")
      }

      setNfeData(data)
      setStep("success")

      toast({
        title: "Nota fiscal gerada com sucesso",
        description: data.emailSent 
          ? "A nota fiscal foi gerada e enviada por e-mail" 
          : "A nota fiscal foi gerada com sucesso",
      })
    } catch (error) {
      console.error("Erro ao gerar NF-e:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido ao gerar nota fiscal")
      setStep("error")
      
      toast({
        title: "Erro ao gerar nota fiscal",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar gerar a nota fiscal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!nfeData) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/orders/${orderId}/nfe/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nfeData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Falha ao enviar e-mail")
      }

      toast({
        title: "E-mail enviado com sucesso",
        description: `A nota fiscal foi enviada para ${customerEmail}`,
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

  const handleDownloadPDF = () => {
    if (nfeData?.pdf_url) {
      window.open(nfeData.pdf_url, "_blank")
    }
  }

  const handleDownloadXML = () => {
    if (nfeData?.xml_url) {
      window.open(nfeData.xml_url, "_blank")
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setStep("initial")
      setNfeData(null)
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nota Fiscal Eletrônica</DialogTitle>
          <DialogDescription>
            {step === "initial" && `Gerar nota fiscal eletrônica para o pedido ${orderNumber}`}
            {step === "success" && "Nota fiscal gerada com sucesso"}
            {step === "error" && "Erro ao gerar nota fiscal"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === "initial" && (
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="send-email" 
                  checked={sendEmail} 
                  onCheckedChange={(checked) => setSendEmail(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="send-email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Enviar por e-mail
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar a nota fiscal para o e-mail do cliente ({customerEmail})
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === "success" && nfeData && (
            <div className="space-y-4">
              <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-400">Nota fiscal gerada com sucesso</h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>Número da NF-e: {nfeData.nfe_number}</p>
                      <p className="mt-1 text-xs break-all">Chave de acesso: {nfeData.access_key}</p>
                    </div>
                  </div>
                </div>
              </div>

              {nfeData.emailSent && (
                <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Mail className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400">E-mail enviado</h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <p>A nota fiscal foi enviada para {customerEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Baixar DANFE (PDF)
                </Button>
                <Button variant="outline" onClick={handleDownloadXML} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Baixar XML
                </Button>
              </div>

              {!nfeData.emailSent && (
                <Button onClick={handleSendEmail} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar por E-mail
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {step === "error" && error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Erro ao gerar nota fiscal</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === "initial" && (
            <Button onClick={handleGenerateNFE} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar NF-e
                </>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {step === "initial" ? "Cancelar" : "Fechar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}