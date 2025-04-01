"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { maskCPF, maskCNPJ, validateCPF, validateCNPJ } from "@/lib/utils"

interface DadosGeraisProps {
  data: {
    code: string
    name: string
    type: string
    document: string
    group: string
    status: string
  }
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export function DadosGerais({ data, onChange, errors }: DadosGeraisProps) {
  const [documentValue, setDocumentValue] = useState(data.document)
  
  // Gerar código automaticamente se estiver vazio
  useEffect(() => {
    if (!data.code) {
      const randomCode = `CLI${Math.floor(10000 + Math.random() * 90000)}`
      onChange("code", randomCode)
    }
  }, [data.code, onChange])
  
  // Aplicar máscara ao documento conforme o tipo (CPF ou CNPJ)
  useEffect(() => {
    if (data.type === "PF" && data.document) {
      setDocumentValue(maskCPF(data.document))
    } else if (data.type === "PJ" && data.document) {
      setDocumentValue(maskCNPJ(data.document))
    } else {
      setDocumentValue(data.document)
    }
  }, [data.type, data.document])
  
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    
    if (data.type === "PF") {
      setDocumentValue(maskCPF(value))
      onChange("document", value)
    } else if (data.type === "PJ") {
      setDocumentValue(maskCNPJ(value))
      onChange("document", value)
    } else {
      setDocumentValue(value)
      onChange("document", value)
    }
  }
  
  const validateDocument = () => {
    if (data.type === "PF") {
      return validateCPF(data.document) ? "" : "CPF inválido"
    } else if (data.type === "PJ") {
      return validateCNPJ(data.document) ? "" : "CNPJ inválido"
    }
    return ""
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="code">Código do Cliente</Label>
            <Input 
              id="code" 
              value={data.code} 
              onChange={(e) => onChange("code", e.target.value)}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Gerado automaticamente</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="required">Nome do Cliente</Label>
            <Input 
              id="name" 
              value={data.name} 
              onChange={(e) => onChange("name", e.target.value)}
              required
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type" className="required">Tipo de Cliente</Label>
            <Select 
              value={data.type} 
              onValueChange={(value) => onChange("type", value)}
            >
              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PF">Pessoa Física (CPF)</SelectItem>
                <SelectItem value="PJ">Pessoa Jurídica (CNPJ)</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document" className="required">
              {data.type === "PF" ? "CPF" : data.type === "PJ" ? "CNPJ" : "Documento"}
            </Label>
            <Input 
              id="document" 
              value={documentValue} 
              onChange={handleDocumentChange}
              maxLength={data.type === "PF" ? 14 : data.type === "PJ" ? 18 : 20}
              className={errors.document ? "border-red-500" : ""}
              required
            />
            {errors.document && <p className="text-xs text-red-500">{errors.document}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group" className="required">Grupo de Clientes</Label>
            <Select 
              value={data.group} 
              onValueChange={(value) => onChange("group", value)}
            >
              <SelectTrigger className={errors.group ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distribuidor">Distribuidor</SelectItem>
                <SelectItem value="varejo">Varejo</SelectItem>
                <SelectItem value="atacado">Atacado</SelectItem>
                <SelectItem value="consumidor">Consumidor Final</SelectItem>
              </SelectContent>
            </Select>
            {errors.group && <p className="text-xs text-red-500">{errors.group}</p>}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Status do Cliente</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="status" 
                  checked={data.status === "active"} 
                  onCheckedChange={(checked) => 
                    onChange("status", checked ? "active" : "inactive")
                  }
                />
                <span className={data.status === "active" ? "text-green-500" : "text-red-500"}>
                  {data.status === "active" ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
