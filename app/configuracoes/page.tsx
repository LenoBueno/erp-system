"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Building, FileText, Shield, PlusCircle, Pencil, Trash, Mail, Phone, Upload } from "lucide-react"

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("perfil")
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    nome: "",
    email: "",
    cargo: "vendedor",
    ativo: true,
    senha: "",
    confirmarSenha: ""
  })
  const [formErrors, setFormErrors] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveFeedback, setSaveFeedback] = useState({ show: false, type: "", message: "" })
  const router = useRouter()
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [])

  // Validação do formulário de usuário
  const validateUserForm = () => {
    const errors = {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: ""
    }
    let isValid = true

    if (!newUser.nome.trim()) {
      errors.nome = "Nome é obrigatório"
      isValid = false
    }

    if (!newUser.email.trim()) {
      errors.email = "Email é obrigatório"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = "Email inválido"
      isValid = false
    }

    if (!newUser.senha) {
      errors.senha = "Senha é obrigatória"
      isValid = false
    } else if (newUser.senha.length < 6) {
      errors.senha = "A senha deve ter pelo menos 6 caracteres"
      isValid = false
    }

    if (newUser.senha !== newUser.confirmarSenha) {
      errors.confirmarSenha = "As senhas não coincidem"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  // Função para criar um novo usuário
  const handleCreateUser = () => {
    if (!validateUserForm()) return

    setIsSaving(true)
    setSaveFeedback({ show: false, type: "", message: "" })

    // Simulando uma chamada de API
    setTimeout(() => {
      // Adicionar o novo usuário à lista
      const newId = usuarios.length + 1
      const newUserData = {
        id: newId,
        nome: newUser.nome,
        email: newUser.email,
        cargo: newUser.cargo,
        ativo: newUser.ativo,
        avatar: ""
      }
      
      usuarios.push(newUserData)
      
      // Resetar o formulário
      setNewUser({
        nome: "",
        email: "",
        cargo: "vendedor",
        ativo: true,
        senha: "",
        confirmarSenha: ""
      })
      
      setIsSaving(false)
      setSaveFeedback({ 
        show: true, 
        type: "success", 
        message: "Usuário criado com sucesso!" 
      })
      
      // Fechar o diálogo após 1 segundo
      setTimeout(() => {
        setIsUserDialogOpen(false)
        setSaveFeedback({ show: false, type: "", message: "" })
      }, 1000)
    }, 1500)
  }

  // Função para validar alíquotas como números positivos
  const validateNumericInput = (e: React.ChangeEvent<HTMLInputElement>, setterFunction: Function, field: Record<string, any>) => {
    const { name, value } = e.target
    
    // Remove tudo que não é dígito, ponto ou vírgula
    let cleanValue = value.replace(/[^\d.,]/g, '')
    
    // Substitui vírgula por ponto para cálculos
    cleanValue = cleanValue.replace(',', '.')
    
    // Se for um número válido, atualiza o estado
    if (!isNaN(parseFloat(cleanValue))) {
      setterFunction({
        ...field,
        [name]: cleanValue
      })
    }
  }

  // Função para validar alíquotas na tabela de estados
  const validateEstadoAliquota = (e: React.ChangeEvent<HTMLInputElement>, estadoId: number) => {
    const { value } = e.target;
    let cleanValue = value.replace(/[^\d.,]/g, '');
    cleanValue = cleanValue.replace(',', '.');
    
    if (!isNaN(parseFloat(cleanValue)) || cleanValue === '') {
      const newState = icmsPorEstado.map((s) => {
        if (s.id === estadoId) {
          return { ...s, aliquota: cleanValue };
        }
        return s;
      });
      setIcmsPorEstado(newState);
    }
  };

  // Função para remover um estado da lista
  const removerEstado = (estadoId: number) => {
    setIcmsPorEstado(icmsPorEstado.filter(estado => estado.id !== estadoId));
  };

  // Função para salvar as configurações fiscais
  const salvarConfiguracoesFiscais = () => {
    setIsSaving(true);
    
    // Simulando uma chamada de API
    setTimeout(() => {
      setSaveFeedback({
        show: true,
        type: "success",
        message: "Configurações fiscais salvas com sucesso!"
      });
      
      setTimeout(() => {
        setSaveFeedback({ show: false, type: "", message: "" });
        setIsSaving(false);
      }, 2000);
    }, 1500);
  };

  // Função para validar alíquota do novo estado
  const validateNovoEstadoAliquota = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let cleanValue = value.replace(/[^\d.,]/g, '');
    cleanValue = cleanValue.replace(',', '.');
    
    if (!isNaN(parseFloat(cleanValue)) || cleanValue === '') {
      setNovoEstado({ ...novoEstado, aliquota: cleanValue });
    }
  };

  // Atualizar a URL quando o usuário mudar de aba
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Atualizar a URL sem usar a opção scroll que não é suportada
    router.push(`/configuracoes?tab=${value}`)
  }

  // Dados simulados para usuários
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@empresa.com",
      cargo: "Administrador",
      ativo: true,
      avatar: "/placeholder-user.jpg"
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      email: "maria.oliveira@empresa.com",
      cargo: "Vendedor",
      ativo: true,
      avatar: ""
    },
    {
      id: 3,
      nome: "Carlos Santos",
      email: "carlos.santos@empresa.com",
      cargo: "Financeiro",
      ativo: true,
      avatar: ""
    },
    {
      id: 4,
      nome: "Ana Pereira",
      email: "ana.pereira@empresa.com",
      cargo: "Estoque",
      ativo: false,
      avatar: ""
    },
  ])

  // Estado para os campos de alíquotas
  const [aliquotas, setAliquotas] = useState({
    icmsInterna: "17.5",
    icmsInterestadual: "12.0",
    pis: "0.65",
    cofins: "3.0",
    difal: "100"
  })

  // Estado para alíquotas ICMS por estado
  const [icmsPorEstado, setIcmsPorEstado] = useState([
    { id: 1, estado: "RS", aliquota: "17.5" },
    { id: 2, estado: "SP", aliquota: "12.0" }
  ])

  // Estado para adicionar novo estado
  const [novoEstado, setNovoEstado] = useState({ estado: "", aliquota: "" })
  const [mostrarFormNovoEstado, setMostrarFormNovoEstado] = useState(false)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="empresa" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="fiscal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Fiscal
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Usuários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="perfil" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>Atualize suas informações pessoais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder-user.jpg" alt="Foto do perfil" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Alterar foto</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input id="nome" defaultValue="João Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="joao.silva@empresa.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" defaultValue="(11) 98765-4321" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input id="cargo" defaultValue="Administrador" readOnly disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha-atual">Senha atual</Label>
                  <Input id="senha-atual" type="password" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nova-senha">Nova senha</Label>
                    <Input id="nova-senha" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
                    <Input id="confirmar-senha" type="password" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Salvar alterações</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Configure suas preferências do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por email</Label>
                    <p className="text-sm text-muted-foreground">Receber alertas e notificações por email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tema escuro</Label>
                    <p className="text-sm text-muted-foreground">Alternar entre tema claro e escuro</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação em dois fatores</Label>
                    <p className="text-sm text-muted-foreground">Aumentar a segurança da sua conta</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empresa" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>Informações gerais da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 flex items-center justify-center border rounded-md">
                    <img src="/placeholder-logo.svg" alt="Logo da empresa" className="max-h-20 max-w-20" />
                  </div>
                  <Button variant="outline">Alterar logo</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razao-social">Razão Social</Label>
                    <Input id="razao-social" defaultValue="Empresa Demonstração Ltda" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nome-fantasia">Nome Fantasia</Label>
                    <Input id="nome-fantasia" defaultValue="Simple Ink ERP" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inscricao-estadual">Inscrição Estadual</Label>
                    <Input id="inscricao-estadual" defaultValue="123.456.789.000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnae">CNAE Principal</Label>
                    <Input id="cnae" placeholder="Ex: 4751-2/01" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inscricao-municipal">Inscrição Municipal</Label>
                    <Input id="inscricao-municipal" defaultValue="987.654.321" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input id="endereco" defaultValue="Av. Paulista, 1000, Sala 101" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input id="cidade" defaultValue="São Paulo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select defaultValue="SP">
                      <SelectTrigger id="estado">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" defaultValue="01310-100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone-empresa">Telefone</Label>
                    <Input id="telefone-empresa" defaultValue="(11) 3456-7890" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-empresa">Email</Label>
                  <Input id="email-empresa" type="email" defaultValue="contato@empresa.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  <Input id="site" type="url" defaultValue="https://www.empresa.com" />
                </div>

                <div className="flex justify-end">
                  <Button>Salvar alterações</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informações Bancárias</CardTitle>
                <CardDescription>Dados bancários da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="banco">Banco</Label>
                    <Select defaultValue="001">
                      <SelectTrigger id="banco">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="001">Banco do Brasil</SelectItem>
                        <SelectItem value="104">Caixa Econômica Federal</SelectItem>
                        <SelectItem value="237">Bradesco</SelectItem>
                        <SelectItem value="341">Itaú</SelectItem>
                        <SelectItem value="033">Santander</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tipo-conta">Tipo de Conta</Label>
                    <Select defaultValue="corrente">
                      <SelectTrigger id="tipo-conta">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corrente">Conta Corrente</SelectItem>
                        <SelectItem value="poupanca">Conta Poupança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agencia">Agência</Label>
                    <Input id="agencia" defaultValue="1234" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="conta">Número da Conta</Label>
                    <Input id="conta" defaultValue="56789-0" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pix">Chave PIX</Label>
                  <Select defaultValue="cnpj">
                    <SelectTrigger id="tipo-pix">
                      <SelectValue placeholder="Tipo de Chave" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cnpj">CNPJ</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="telefone">Telefone</SelectItem>
                      <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="valor-pix">Valor da Chave PIX</Label>
                  <Input id="valor-pix" defaultValue="12.345.678/0001-90" />
                </div>

                <div className="flex justify-end">
                  <Button>Salvar informações bancárias</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fiscal" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Fiscais</CardTitle>
                <CardDescription>Configure os parâmetros fiscais da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="regime-tributario">Regime Tributário</Label>
                      <Select defaultValue="simples">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o regime" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simples">Simples Nacional</SelectItem>
                          <SelectItem value="lucro-presumido">Lucro Presumido</SelectItem>
                          <SelectItem value="lucro-real">Lucro Real</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="codigo-servico">Código de Serviço Fiscal (LC116/01)</Label>
                      <Input id="codigo-servico" defaultValue="01.01.01/001" />
                      <p className="text-xs text-muted-foreground">Defina o código correto para sua atividade fiscal principal</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cfop-dentro">CFOP para Operações Internas</Label>
                      <Input id="cfop-dentro" defaultValue="5.102" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cfop-fora">CFOP para Operações Interestaduais</Label>
                      <Input id="cfop-fora" defaultValue="6.102" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Alíquotas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aliquota-icms">Alíquota ICMS Interna</Label>
                    <div className="flex items-center">
                      <Input 
                        id="aliquota-icms" 
                        value={aliquotas.icmsInterna}
                        onChange={(e) => validateNumericInput(e, setAliquotas, aliquotas)}
                        name="icmsInterna"
                      />
                      <span className="ml-2">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Alíquota para operações dentro do estado</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aliquota-icms-inter">Alíquota ICMS Interestadual</Label>
                    <div className="flex items-center">
                      <Input 
                        id="aliquota-icms-inter" 
                        value={aliquotas.icmsInterestadual}
                        onChange={(e) => validateNumericInput(e, setAliquotas, aliquotas)}
                        name="icmsInterestadual"
                      />
                      <span className="ml-2">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Alíquota para operações fora do estado</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aliquota-pis">Alíquota PIS</Label>
                    <div className="flex items-center">
                      <Input 
                        id="aliquota-pis" 
                        value={aliquotas.pis}
                        onChange={(e) => validateNumericInput(e, setAliquotas, aliquotas)}
                        name="pis"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aliquota-cofins">Alíquota COFINS</Label>
                    <div className="flex items-center">
                      <Input 
                        id="aliquota-cofins" 
                        value={aliquotas.cofins}
                        onChange={(e) => validateNumericInput(e, setAliquotas, aliquotas)}
                        name="cofins"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Alíquota ICMS por Estado de Destino</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estado</TableHead>
                        <TableHead>Alíquota (%)</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {icmsPorEstado.map((estado) => (
                        <TableRow key={estado.id}>
                          <TableCell>
                            <Select 
                              value={estado.estado}
                              onValueChange={(value) => {
                                const newState = icmsPorEstado.map((s) => {
                                  if (s.id === estado.id) {
                                    return { ...s, estado: value };
                                  }
                                  return s;
                                });
                                setIcmsPorEstado(newState);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                <SelectItem value="SC">Santa Catarina</SelectItem>
                                <SelectItem value="PR">Paraná</SelectItem>
                                <SelectItem value="SP">São Paulo</SelectItem>
                                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Input 
                                type="text" 
                                value={estado.aliquota}
                                onChange={(e) => validateEstadoAliquota(e, estado.id)}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => removerEstado(estado.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setMostrarFormNovoEstado(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Adicionar Estado
                    </Button>
                  </div>
                  {mostrarFormNovoEstado && (
                    <div className="space-y-2 mt-4">
                      <Label>Estado</Label>
                      <Select 
                        value={novoEstado.estado}
                        onValueChange={(value) => setNovoEstado({ ...novoEstado, estado: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          <SelectItem value="SC">Santa Catarina</SelectItem>
                          <SelectItem value="PR">Paraná</SelectItem>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        </SelectContent>
                      </Select>
                      <Label>Alíquota</Label>
                      <div className="flex items-center">
                        <Input 
                          type="text" 
                          value={novoEstado.aliquota}
                          onChange={(e) => validateNovoEstadoAliquota(e)}
                        />
                      </div>
                      <Button 
                        onClick={() => {
                          setIcmsPorEstado([...icmsPorEstado, { id: icmsPorEstado.length + 1, ...novoEstado }]);
                          setNovoEstado({ estado: "", aliquota: "" });
                          setMostrarFormNovoEstado(false);
                        }}
                      >
                        Adicionar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diferencial de Alíquotas (DIFAL)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Calcular DIFAL automaticamente</p>
                    <p className="text-sm text-muted-foreground">Cálculo automático do diferencial de alíquotas entre estados</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="percentual-difal">Percentual de Partilha DIFAL</Label>
                  <div className="flex items-center">
                    <Input 
                      id="percentual-difal" 
                      value={aliquotas.difal}
                      onChange={(e) => validateNumericInput(e, setAliquotas, aliquotas)}
                      name="difal"
                    />
                    <span className="ml-2">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Percentual de distribuição de acordo com o ano</p>
                </div>
                
                <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Informativo do Simples Nacional:</span> No Simples Nacional, as alíquotas de ICMS e ICMS-ST são e estão incluídas na alíquota única do regime. Os valores configurados aqui serão utilizados apenas para fins de determinação dos documentos fiscais.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificado Digital e SEFAZ RS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tipo-certificado">Tipo de Certificado</Label>
                  <Select defaultValue="a1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a1">Certificado A1</SelectItem>
                      <SelectItem value="a3">Certificado A3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url-webservice">URL Webservice SEFAZ RS</Label>
                  <Input id="url-webservice" defaultValue="https://nfe.sefazrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx" />
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline">
                    Testar Conexão com SEFAZ
                  </Button>
                </div>
                
                <div className="border p-4 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <p className="font-medium">Certificado Digital</p>
                    <Button variant="outline" size="sm">
                      Selecionar certificado
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="serie-nfe">Série NFe</Label>
                        <Input id="serie-nfe" defaultValue="1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prox-nfe">Próxima NFe</Label>
                        <Input id="prox-nfe" defaultValue="123" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ambiente">Ambiente</Label>
                      <Select defaultValue="homologacao">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="homologacao">Homologação</SelectItem>
                          <SelectItem value="producao">Produção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="csc">CSC (Código de Segurança do Contribuinte)</Label>
                      <Input id="csc" defaultValue="Código para NFCe" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Nota Fiscal Gaúcha (NFG)</p>
                      <p className="text-sm text-muted-foreground">Ative a integração com o programa Nota Fiscal Gaúcha</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="space-y-1">
                      <p className="font-medium">Solicitar CPF do Consumidor</p>
                      <p className="text-sm text-muted-foreground">Solicitar CPF do consumidor para registro no programa NFG</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="space-y-1">
                      <p className="font-medium">Consulta de Formação NFG</p>
                      <p className="text-sm text-muted-foreground">Permitir consulta de pontuação acumulada pelo consumidor</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="mensagem-nfg">Mensagem NFG</Label>
                    <Textarea id="mensagem-nfg" defaultValue="Esse documento é válido para a Nota Fiscal Gaúcha" />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <p className="font-medium">Configurações de DANFE e Impressão</p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="layout-danfe">Layout da DANFE</Label>
                      <Select defaultValue="padrao">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="padrao">Padrão</SelectItem>
                          <SelectItem value="simplificado">Simplificado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="space-y-1">
                        <p className="font-medium">Modo Contingencial (Offline)</p>
                        <p className="text-sm text-muted-foreground">Ativar modo de contingência quando SEFAZ estiver indisponível</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="space-y-1">
                        <p className="font-medium">Impressão Automática</p>
                        <p className="text-sm text-muted-foreground">Imprimir DANFE automaticamente após emissão</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={salvarConfiguracoesFiscais}>Salvar configurações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gerenciamento de Usuários</CardTitle>
                  <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Novo Usuário
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                        <DialogDescription>
                          Preencha os dados abaixo para criar um novo usuário no sistema.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome</Label>
                          <Input 
                            id="nome" 
                            placeholder="Nome completo do usuário"
                            value={newUser.nome}
                            onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                          />
                          {formErrors.nome && <p className="text-sm text-red-500">{formErrors.nome}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="email@empresa.com"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          />
                          {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cargo">Cargo</Label>
                          <Select 
                            value={newUser.cargo}
                            onValueChange={(value) => setNewUser({ ...newUser, cargo: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="vendedor">Vendedor</SelectItem>
                              <SelectItem value="financeiro">Financeiro</SelectItem>
                              <SelectItem value="estoque">Estoque</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="senha">Senha</Label>
                          <Input 
                            id="senha" 
                            type="password" 
                            placeholder="••••••••"
                            value={newUser.senha}
                            onChange={(e) => setNewUser({ ...newUser, senha: e.target.value })}
                          />
                          {formErrors.senha && <p className="text-sm text-red-500">{formErrors.senha}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                          <Input 
                            id="confirmarSenha" 
                            type="password" 
                            placeholder="••••••••"
                            value={newUser.confirmarSenha}
                            onChange={(e) => setNewUser({ ...newUser, confirmarSenha: e.target.value })}
                          />
                          {formErrors.confirmarSenha && <p className="text-sm text-red-500">{formErrors.confirmarSenha}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="ativo" 
                            checked={newUser.ativo}
                            onCheckedChange={(checked) => setNewUser({ ...newUser, ativo: checked })}
                          />
                          <Label htmlFor="ativo">Usuário ativo</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        {saveFeedback.show && (
                          <p className={`text-sm ${saveFeedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {saveFeedback.message}
                          </p>
                        )}
                        <Button 
                          type="submit" 
                          onClick={handleCreateUser}
                          disabled={isSaving}
                        >
                          {isSaving ? 'Salvando...' : 'Salvar usuário'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={usuario.avatar} alt={usuario.nome} />
                              <AvatarFallback>
                                {usuario.nome.substring(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{usuario.cargo}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={usuario.ativo ? "default" : "outline"}
                            className={usuario.ativo ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                          >
                            {usuario.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permissões do Sistema</CardTitle>
                <CardDescription>Configure as permissões para cada tipo de usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Administrador</h3>
                    <p className="text-sm text-muted-foreground mb-4">Acesso completo a todas as funcionalidades do sistema</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Dashboard</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-dashboard-view">Visualizar</Label>
                            <Switch id="admin-dashboard-view" defaultChecked disabled />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Vendas</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-vendas-view">Visualizar</Label>
                            <Switch id="admin-vendas-view" defaultChecked disabled />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-vendas-create">Criar/Editar</Label>
                            <Switch id="admin-vendas-create" defaultChecked disabled />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-vendas-delete">Excluir</Label>
                            <Switch id="admin-vendas-delete" defaultChecked disabled />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Financeiro</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-financeiro-view">Visualizar</Label>
                            <Switch id="admin-financeiro-view" defaultChecked disabled />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-financeiro-create">Criar/Editar</Label>
                            <Switch id="admin-financeiro-create" defaultChecked disabled />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-financeiro-delete">Excluir</Label>
                            <Switch id="admin-financeiro-delete" defaultChecked disabled />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      <div>
                        <h4 className="font-medium mb-2">Estoque</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-estoque-view">Visualizar</Label>
                            <Switch id="admin-estoque-view" defaultChecked disabled />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-estoque-create">Criar/Editar</Label>
                            <Switch id="admin-estoque-create" defaultChecked disabled />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-estoque-delete">Excluir</Label>
                            <Switch id="admin-estoque-delete" defaultChecked disabled />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Configurações</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-config-view">Visualizar</Label>
                            <Switch id="admin-config-view" defaultChecked disabled />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="admin-config-edit">Editar</Label>
                            <Switch id="admin-config-edit" defaultChecked disabled />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-md bg-blue-50 border border-blue-200 mt-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Administrador:</span> Todas as permissões são concedidas automaticamente e não podem ser revogadas. O administrador tem acesso completo a todas as funcionalidades do sistema.
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Vendedor</h3>
                    <p className="text-sm text-muted-foreground mb-4">Acesso às funcionalidades de vendas e clientes</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Dashboard</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="vendedor-dashboard-view">Visualizar</Label>
                            <Switch id="vendedor-dashboard-view" defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Vendas</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="vendedor-vendas-view">Visualizar</Label>
                            <Switch id="vendedor-vendas-view" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="vendedor-vendas-create">Criar/Editar</Label>
                            <Switch id="vendedor-vendas-create" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="vendedor-vendas-delete">Excluir</Label>
                            <Switch id="vendedor-vendas-delete" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Estoque</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="vendedor-estoque-view">Visualizar</Label>
                            <Switch id="vendedor-estoque-view" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="vendedor-estoque-create">Criar/Editar</Label>
                            <Switch id="vendedor-estoque-create" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Financeiro</h3>
                    <p className="text-sm text-muted-foreground mb-4">Acesso às funcionalidades financeiras e de fluxo de caixa</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Dashboard</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="financeiro-dashboard-view">Visualizar</Label>
                            <Switch id="financeiro-dashboard-view" defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Financeiro</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="financeiro-financeiro-view">Visualizar</Label>
                            <Switch id="financeiro-financeiro-view" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="financeiro-financeiro-create">Criar/Editar</Label>
                            <Switch id="financeiro-financeiro-create" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="financeiro-financeiro-delete">Excluir</Label>
                            <Switch id="financeiro-financeiro-delete" defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Vendas</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="financeiro-vendas-view">Visualizar</Label>
                            <Switch id="financeiro-vendas-view" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="financeiro-vendas-create">Criar/Editar</Label>
                            <Switch id="financeiro-vendas-create" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Estoque</h3>
                    <p className="text-sm text-muted-foreground mb-4">Acesso às funcionalidades de estoque e produtos</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Dashboard</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="estoque-dashboard-view">Visualizar</Label>
                            <Switch id="estoque-dashboard-view" defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Estoque</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="estoque-estoque-view">Visualizar</Label>
                            <Switch id="estoque-estoque-view" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="estoque-estoque-create">Criar/Editar</Label>
                            <Switch id="estoque-estoque-create" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="estoque-estoque-delete">Excluir</Label>
                            <Switch id="estoque-estoque-delete" defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Vendas</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="estoque-vendas-view">Visualizar</Label>
                            <Switch id="estoque-vendas-view" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="estoque-vendas-create">Criar/Editar</Label>
                            <Switch id="estoque-vendas-create" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="p-6 pt-0 flex justify-end">
                <Button>Salvar permissões</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}