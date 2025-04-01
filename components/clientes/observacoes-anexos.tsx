"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileUp, X, FileText, Image, FileArchive, Download, Eye } from "lucide-react"

interface ObservacoesAnexosProps {
  data: {
    notes: string
    attachments: string[]
  }
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export function ObservacoesAnexos({ data, onChange, errors }: ObservacoesAnexosProps) {
  const [dragActive, setDragActive] = useState(false)
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }
  
  const handleFiles = (files: FileList) => {
    // Em uma implementação real, aqui você faria o upload dos arquivos para um servidor
    // e receberia URLs ou IDs em resposta
    
    // Simulação de upload
    const newAttachments = [...data.attachments]
    
    Array.from(files).forEach(file => {
      // Simulando uma URL para o arquivo
      const fakeUrl = `https://example.com/uploads/${Date.now()}_${file.name}`
      newAttachments.push(fakeUrl)
    })
    
    onChange("attachments", newAttachments)
  }
  
  const removeAttachment = (index: number) => {
    const newAttachments = [...data.attachments]
    newAttachments.splice(index, 1)
    onChange("attachments", newAttachments)
  }
  
  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase() || ""
    
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)) {
      return <Image className="h-5 w-5 text-blue-500" />
    } else if (["pdf", "doc", "docx", "txt"].includes(extension)) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
      return <FileArchive className="h-5 w-5 text-yellow-500" />
    }
    
    return <FileText className="h-5 w-5 text-gray-500" />
  }
  
  const getFileName = (url: string) => {
    return url.split('/').pop() || url
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Observações Internas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea 
              id="notes" 
              value={data.notes} 
              onChange={(e) => onChange("notes", e.target.value)}
              placeholder="Adicione observações importantes sobre este cliente..."
              className="min-h-[150px]"
            />
            <p className="text-xs text-muted-foreground">
              Estas notas são visíveis apenas internamente e não são compartilhadas com o cliente.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Anexos</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <FileUp className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="font-medium">Arraste arquivos aqui ou clique para fazer upload</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Suporta documentos, imagens e arquivos PDF (máx. 10MB por arquivo)
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Selecionar Arquivos
              </Button>
              <input 
                id="file-upload" 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
          </div>
          
          {data.attachments.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium">Arquivos anexados ({data.attachments.length})</h3>
              <div className="space-y-2">
                {data.attachments.map((attachment, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(attachment)}
                      <span className="text-sm truncate max-w-[200px]">
                        {getFileName(attachment)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
