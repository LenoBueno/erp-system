"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Plus, Save, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Fornecedor {
  id: number
  nome: string
}

interface Categoria {
  id: number
  name: string
}

interface FormData {
  // Dados básicos
  codigo: string
  nome: string
  descricao: string
  tipo_item: string
  unidade_medida: string
  categoria_id: string
  
  // Dados de estoque
  quantidade_estoque: string
  local_armazenamento: string
  preco_custo: string
  preco_venda: string
  margem_lucro: string
  
  // Informações fiscais
  codigo_ncm: string
  codigo_cest: string
  aliquota_icms: string
  aliquota_pis: string
  aliquota_cofins: string
  imposto_importacao: string
  origem_produto: string
  beneficio_fiscal: string
  aliquota_iss: string
  
  // Informações de fornecedores
  fornecedor_id: string
  preco_compra: string
  condicoes_pagamento_fornecedor: string
  
  // Informações de vendas
  precos_especiais: {
    cliente_tipo: string
    valor: string
  }[]
  condicoes_pagamento_venda: string
  
  // Outros dados
  imagem: File | null
  atributos: {
    nome: string
    valor: string
  }[]
  observacoes: string
}

export default function CadastroProdutoPage() {
  const [formData, setFormData] = useState<FormData>({
    // Dados básicos
    codigo: "",
    nome: "",
    descricao: "",
    tipo_item: "mercadoria",
    unidade_medida: "",
    categoria_id: "",
    
    // Dados de estoque
    quantidade_estoque: "0",
    local_armazenamento: "",
    preco_custo: "0",
    preco_venda: "0",
    margem_lucro: "0",
    
    // Informações fiscais
    codigo_ncm: "",
    codigo_cest: "",
    aliquota_icms: "0",
    aliquota_pis: "0",
    aliquota_cofins: "0",
    imposto_importacao: "0",
    origem_produto: "0",
    beneficio_fiscal: "",
    aliquota_iss: "0",
    
    // Informações de fornecedores
    fornecedor_id: "",
    preco_compra: "0",
    condicoes_pagamento_fornecedor: "",
    
    // Informações de vendas
    precos_especiais: [],
    condicoes_pagamento_venda: "",
    
    // Outros dados
    imagem: null,
    atributos: [],
    observacoes: ""
  })
  
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Opções para campos de seleção
  const tiposItem = [
    { value: "mercadoria", label: "Mercadoria" },
    { value: "servico", label: "Serviço" },
    { value: "insumo", label: "Insumo" },
    { value: "materia_prima", label: "Matéria-Prima" }
  ]
  
  const unidadesMedida = [
    { value: "un", label: "Unidade" },
    { value: "kg", label: "Quilograma" },
    { value: "g", label: "Grama" },
    { value: "l", label: "Litro" },
    { value: "ml", label: "Mililitro" },
    { value: "m", label: "Metro" },
    { value: "m2", label: "Metro Quadrado" },
    { value: "m3", label: "Metro Cúbico" },
    { value: "pct", label: "Pacote" },
    { value: "cx", label: "Caixa" },
    { value: "hr", label: "Hora" }
  ]
  
  const origensProtudo = [
    { value: "0", label: "0 - Nacional" },
    { value: "1", label: "1 - Estrangeira (Importação direta)" },
    { value: "2", label: "2 - Estrangeira (Adquirida no mercado interno)" },
    { value: "3", label: "3 - Nacional (Mercadoria com conteúdo de importação superior a 40%)" },
    { value: "4", label: "4 - Nacional (Produção conforme processos produtivos)" },
    { value: "5", label: "5 - Nacional (Mercadoria com conteúdo de importação inferior ou igual a 40%)" },
    { value: "6", label: "6 - Estrangeira (Importação direta, sem similar nacional)" },
    { value: "7", label: "7 - Estrangeira (Adquirida no mercado interno, sem similar nacional)" },
    { value: "8", label: "8 - Nacional (Mercadoria com conteúdo de importação superior a 70%)" }
  ]
  
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error("Falha ao carregar categorias")
        }
        const data = await response.json()
        setCategorias(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar categorias",
          description: "Não foi possível carregar a lista de categorias",
          variant: "destructive",
        })
      }
    }
    
    const fetchFornecedores = async () => {
      try {
        const response = await fetch("/api/fornecedores")
        if (!response.ok) {
          throw new Error("Falha ao carregar fornecedores")
        }
        const data = await response.json()
        setFornecedores(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar fornecedores",
          description: "Não foi possível carregar a lista de fornecedores",
          variant: "destructive",
        })
      }
    }
    
    fetchCategorias()
    fetchFornecedores()
  }, [toast])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Calcular margem de lucro automaticamente quando preço de custo ou venda mudar
    if (name === "preco_custo" || name === "preco_venda") {
      const precoCusto = parseFloat(name === "preco_custo" ? value : formData.preco_custo) || 0
      const precoVenda = parseFloat(name === "preco_venda" ? value : formData.preco_venda) || 0
      
      if (precoCusto > 0 && precoVenda > 0) {
        const margemLucro = ((precoVenda - precoCusto) / precoCusto) * 100
        setFormData((prev) => ({ ...prev, margem_lucro: margemLucro.toFixed(2) }))
      }
    }
    
    // Calcular preço de venda automaticamente quando margem de lucro mudar
    if (name === "margem_lucro") {
      const precoCusto = parseFloat(formData.preco_custo) || 0
      const margemLucro = parseFloat(value) || 0
      
      if (precoCusto > 0) {
        const precoVenda = precoCusto * (1 + margemLucro / 100)
        setFormData((prev) => ({ ...prev, preco_venda: precoVenda.toFixed(2) }))
      }
    }
  }
  
  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, imagem: file }))
    
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagemPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagemPreview(null)
    }
  }
  
  const handleRemoverImagem = () => {
    setFormData((prev) => ({ ...prev, imagem: null }))
    setImagemPreview(null)
  }
  
  const handleAdicionarAtributo = () => {
    setFormData((prev) => ({
      ...prev,
      atributos: [...prev.atributos, { nome: "", valor: "" }]
    }))
  }
  
  const handleRemoverAtributo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      atributos: prev.atributos.filter((_, i) => i !== index)
    }))
  }
  
  const handleAtributoChange = (index: number, field: "nome" | "valor", value: string) => {
    setFormData((prev) => ({
      ...prev,
      atributos: prev.atributos.map((attr, i) => {
        if (i === index) {
          return { ...attr, [field]: value }
        }
        return attr
      })
    }))
  }
  
  const handleAdicionarPrecoEspecial = () => {
    setFormData((prev) => ({
      ...prev,
      precos_especiais: [...prev.precos_especiais, { cliente_tipo: "", valor: "" }]
    }))
  }
  
  const handleRemoverPrecoEspecial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      precos_especiais: prev.precos_especiais.filter((_, i) => i !== index)
    }))
  }
  
  const handlePrecoEspecialChange = (index: number, field: "cliente_tipo" | "valor", value: string) => {
    setFormData((prev) => ({
      ...prev,
      precos_especiais: prev.precos_especiais.map((preco, i) => {
        if (i === index) {
          return { ...preco, [field]: value }
        }
        return preco
      })
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Preparar dados para envio
      const produtoData = new FormData()
      
      // Adicionar todos os campos do formulário
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "imagem" && value) {
          produtoData.append("imagem", value)
        } else if (key === "atributos" || key === "precos_especiais") {
          produtoData.append(key, JSON.stringify(value))
        } else if (typeof value === "string") {
          produtoData.append(key, value)
        }
      })
      
      const response = await fetch("/api/produtos", {
        method: "POST",
        body: produtoData,
      })
      
      if (!response.ok) {
        throw new Error("Falha ao salvar produto")
      }
      
      toast({
        title: "Produto cadastrado",
        description: "O produto foi cadastrado com sucesso",
      })
      
      // Resetar formulário
      window.location.href = "/produtos/catalogo"
    } catch (error) {
      toast({
        title: "Erro ao cadastrar produto",
        description: "Ocorreu um erro ao tentar cadastrar o produto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cadastro de Produto</h1>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Produto
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="dados-basicos" className="w-full">
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="dados-basicos">Dados Básicos</TabsTrigger>
              <TabsTrigger value="estoque">Estoque</TabsTrigger>
              <TabsTrigger value="fiscal">Informações Fiscais</TabsTrigger>
              <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
              <TabsTrigger value="vendas">Vendas</TabsTrigger>
              <TabsTrigger value="outros">Outros Dados</TabsTrigger>
            </TabsList>
            
            {/* Aba de Dados Básicos */}
            <TabsContent value="dados-basicos">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codigo">Código do Produto *</Label>
                      <Input
                        id="codigo"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleInputChange}
                        placeholder="Código único do produto"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome do Produto *</Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        placeholder="Nome ou descrição curta"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleInputChange}
                      placeholder="Detalhamento do produto"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoria_id">Categoria *</Label>
                      <Select
                        value={formData.categoria_id}
                        onValueChange={(value) => handleSelectChange(value, "categoria_id")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria.id} value={categoria.id.toString()}>
                              {categoria.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tipo_item">Tipo de Item *</Label>
                      <Select
                        value={formData.tipo_item}
                        onValueChange={(value) => handleSelectChange(value, "tipo_item")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposItem.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unidade_medida">Unidade de Medida *</Label>
                      <Select
                        value={formData.unidade_medida}
                        onValueChange={(value) => handleSelectChange(value, "unidade_medida")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {unidadesMedida.map((unidade) => (
                            <SelectItem key={unidade.value} value={unidade.value}>
                              {unidade.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Aba de Estoque */}
            <TabsContent value="estoque">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantidade_estoque">Quantidade em Estoque</Label>
                      <Input
                        id="quantidade_estoque"
                        name="quantidade_estoque"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.quantidade_estoque}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="local_armazenamento">Local de Armazenamento</Label>
                      <Input
                        id="local_armazenamento"
                        name="local_armazenamento"
                        value={formData.local_armazenamento}
                        onChange={handleInputChange}
                        placeholder="Depósito, prateleira, etc."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preco_custo">Preço de Custo (R$)</Label>
                      <Input
                        id="preco_custo"
                        name="preco_custo"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.preco_custo}
                        onChange={handleInputChange}
                        placeholder="0,00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="margem_lucro">Margem de Lucro (%)</Label>
                      <Input
                        id="margem_lucro"
                        name="margem_lucro"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.margem_lucro}
                        onChange={handleInputChange}
                        placeholder="0,00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preco_venda">Preço de Venda (R$)</Label>
                      <Input
                        id="preco_venda"
                        name="preco_venda"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.preco_venda}
                        onChange={handleInputChange}
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Aba de Informações Fiscais */}
            <TabsContent value="fiscal">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codigo_ncm">Código NCM</Label>
                      <Input
                        id="codigo_ncm"
                        name="codigo_ncm"
                        value={formData.codigo_ncm}
                        onChange={handleInputChange}
                        placeholder="Ex: 8471.30.12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="codigo_cest">Código CEST</Label>
                      <Input
                        id="codigo_cest"
                        name="codigo_cest"
                        value={formData.codigo_cest}
                        onChange={handleInputChange}
                        placeholder="Ex: 28.038.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="origem_produto">Origem do Produto</Label>
                      <Select
                        value={formData.origem_produto}
                        onValueChange={(value) => handleSelectChange(value, "origem_produto")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a origem" />
                        </SelectTrigger>
                        <SelectContent>
                          {origensProtudo.map((origem) => (
                            <SelectItem key={origem.value} value={origem.value}>
                              {origem.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aliquota_icms">Alíquota de ICMS (%)</Label>
                      <Input
                        id="aliquota_icms"
                        name="aliquota_icms"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.aliquota_icms}
                        onChange={handleInputChange}
                        placeholder="0,00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aliquota_pis">Alíquota de PIS (%)</Label>
                      <Input
                        id="aliquota_pis"
                        name="aliquota_pis"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.aliquota_pis}
                        onChange={handleInputChange}
                        placeholder="0,00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aliquota_cofins">Alíquota de COFINS (%)</Label>
                      <Input
                        id="aliquota_cofins"
                        name="aliquota_cofins"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.aliquota_cofins}
                        onChange={handleInputChange}
                        placeholder="0,00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="imposto_importacao">Imposto de Importação (%)</Label>
                      <Input
                        id="imposto_importacao"
                        name="imposto_importacao"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.imposto_importacao}
                        onChange={handleInputChange}
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="beneficio_fiscal">Benefício Fiscal</Label>
                      <Input
                        id="beneficio_fiscal"
                        name="beneficio_fiscal"
                        value={formData.beneficio_fiscal}
                        onChange={handleInputChange}
                        placeholder="Ex: ICMS ST, PIS/COFINS reduzido"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aliquota_iss">Alíquota de ISS (%) - Apenas para serviços</Label>
                      <Input
                        id="aliquota_iss"
                        name="aliquota_iss"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.aliquota_iss}
                        onChange={handleInputChange}
                        placeholder="0,00"
                        disabled={formData.tipo_item !== "servico"}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Aba de Fornecedores */}
            <TabsContent value="fornecedores">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fornecedor_id">Fornecedor Principal</Label>
                      <Select
                        value={formData.fornecedor_id}
                        onValueChange={(value) => handleSelectChange(value, "fornecedor_id")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fornecedor" />
                        </SelectTrigger>
                        <SelectContent>
                          {fornecedores.map((fornecedor) => (
                            <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                              {fornecedor.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preco_compra">Preço de Compra (R$)</Label>
                      <Input
                        id="preco_compra"
                        name="preco_compra"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.preco_compra}
                        onChange={handleInputChange}
                        placeholder="0,00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="condicoes_pagamento_fornecedor">Condições de Pagamento</Label>
                      <Input
                        id="condicoes_pagamento_fornecedor"
                        name="condicoes_pagamento_fornecedor"
                        value={formData.condicoes_pagamento_fornecedor}
                        onChange={handleInputChange}
                        placeholder="Ex: 30/60/90 dias"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Aba de Vendas */}
            <TabsContent value="vendas">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Preços Especiais por Tipo de Cliente</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAdicionarPrecoEspecial}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Adicionar
                      </Button>
                    </div>
                    
                    {formData.precos_especiais.length === 0 ? (
                      <div className="text-sm text-muted-foreground py-2">
                        Nenhum preço especial cadastrado
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.precos_especiais.map((preco, index) => (
                          <div key={index} className="flex items-end gap-2">
                            <div className="flex-1 space-y-2">
                              <Label>Tipo de Cliente</Label>
                              <Input
                                value={preco.cliente_tipo}
                                onChange={(e) => handlePrecoEspecialChange(index, "cliente_tipo", e.target.value)}
                                placeholder="Ex: Atacado, Varejo, VIP"
                              />
                            </div>
                            <div className="flex-1 space-y-2">
                              <Label>Valor (R$)</Label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={preco.valor}
                                onChange={(e) => handlePrecoEspecialChange(index, "valor", e.target.value)}
                                placeholder="0,00"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoverPrecoEspecial(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condicoes_pagamento_venda">Condições de Pagamento para Venda</Label>
                    <Textarea
                      id="condicoes_pagamento_venda"
                      name="condicoes_pagamento_venda"
                      value={formData.condicoes_pagamento_venda}
                      onChange={handleInputChange}
                      placeholder="Ex: À vista, 30/60 dias, Cartão em até 12x"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Aba de Outros Dados */}
            <TabsContent value="outros">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Imagem do Produto</Label>
                    <div className="flex flex-col items-center gap-4">
                      {imagemPreview ? (
                        <div className="relative">
                          <img
                            src={imagemPreview}
                            alt="Preview"
                            className="max-w-full max-h-64 rounded-md object-contain"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleRemoverImagem}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">Clique para selecionar uma imagem</p>
                          </div>
                          <Input
                            id="imagem"
                            name="imagem"
                            type="file"
                            accept="image/*"
                            onChange={handleImagemChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("imagem")?.click()}
                          >
                            Selecionar Imagem
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Atributos do Produto</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAdicionarAtributo}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Adicionar
                      </Button>
                    </div>
                    
                    {formData.atributos.length === 0 ? (
                      <div className="text-sm text-muted-foreground py-2">
                        Nenhum atributo cadastrado
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.atributos.map((atributo, index) => (
                          <div key={index} className="flex items-end gap-2">
                            <div className="flex-1 space-y-2">
                              <Label>Nome</Label>
                              <Input
                                value={atributo.nome}
                                onChange={(e) => handleAtributoChange(index, "nome", e.target.value)}
                                placeholder="Ex: Cor, Tamanho, Material"
                              />
                            </div>
                            <div className="flex-1 space-y-2">
                              <Label>Valor</Label>
                              <Input
                                value={atributo.valor}
                                onChange={(e) => handleAtributoChange(index, "valor", e.target.value)}
                                placeholder="Ex: Azul, Grande, Alumínio"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoverAtributo(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleInputChange}
                      placeholder="Informações adicionais sobre o produto"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </MainLayout>
  )
}