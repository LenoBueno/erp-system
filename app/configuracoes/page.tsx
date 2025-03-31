"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Building, FileText, Shield, PlusCircle, Pencil, Trash, Mail, Phone } from "lucide-react"

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("perfil")
  const router = useRouter()
  
  useEffect(() => {
    // Pegar o parâmetro da URL e selecionar a aba correspondente
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const tabParam = searchParams.get('tab')
      if (tabParam && ['perfil', 'empresa', 'usuarios', 'fiscal'].includes(tabParam)) {
        setActiveTab(tabParam)
      }
    }
  }, [])

  // Atualizar a URL quando o usuário mudar de aba
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Atualizar a URL sem usar a opção scroll que não é suportada
    router.push(`/configuracoes?tab=${value}`)
  }

  // Dados simulados para usuários
  const usuarios = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@empresa.com",
      cargo: "Administrador",
      avatar: "/placeholder-user.jpg",
      ativo: true,
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      email: "maria.oliveira@empresa.com",
      cargo: "Vendedor",
      avatar: "/placeholder-user.jpg",
      ativo: true,
    },
    {
      id: 3,
      nome: "Carlos Santos",
      email: "carlos.santos@empresa.com",
      cargo: "Financeiro",
      avatar: "/placeholder-user.jpg",
      ativo: true,
    },
    {
      id: 4,
      nome: "Ana Pereira",
      email: "ana.pereira@empresa.com",
      cargo: "Estoque",
      avatar: "/placeholder-user.jpg",
      ativo: false,
    },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="empresa" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Empresa
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
                <CardTitle>Configurações Fiscais</CardTitle>
                <CardDescription>Configurações para emissão de notas fiscais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="regime-tributario">Regime Tributário</Label>
                    <Select defaultValue="simples">
                      <SelectTrigger id="regime-tributario">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simples">Simples Nacional</SelectItem>
                        <SelectItem value="lucro-presumido">Lucro Presumido</SelectItem>
                        <SelectItem value="lucro-real">Lucro Real</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="codigo-beneficio-fiscal">Código de Benefício Fiscal (ICMS-ST)</Label>
                    <Input id="codigo-beneficio-fiscal" placeholder="Ex: RS12345678" />
                    <p className="text-xs text-muted-foreground">Definido conforme incentivo fiscal estadual</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cfop-interno">CFOP para Operações Internas</Label>
                    <Input id="cfop-interno" placeholder="Ex: 5102" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cfop-interestadual">CFOP para Operações Interestaduais</Label>
                    <Input id="cfop-interestadual" placeholder="Ex: 6102" />
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h3 className="text-lg font-medium mb-4">Configurações de Alíquotas</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aliquota-icms-interna">Alíquota ICMS Interna</Label>
                      <div className="flex items-center gap-2">
                        <Input id="aliquota-icms-interna" placeholder="Ex: 17.5" />
                        <span className="text-sm">%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Alíquota para operações dentro do estado</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aliquota-icms-interestadual">Alíquota ICMS Interestadual</Label>
                      <div className="flex items-center gap-2">
                        <Input id="aliquota-icms-interestadual" placeholder="Ex: 12" />
                        <span className="text-sm">%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Alíquota para operações fora do estado</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label>Alíquotas PIS/COFINS (Simples Nacional)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="aliquota-pis">Alíquota PIS</Label>
                        <div className="flex items-center gap-2">
                          <Input id="aliquota-pis" defaultValue="0.65" />
                          <span className="text-sm">%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Valor fixo para Simples Nacional</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="aliquota-cofins">Alíquota COFINS</Label>
                        <div className="flex items-center gap-2">
                          <Input id="aliquota-cofins" defaultValue="3.0" />
                          <span className="text-sm">%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Valor fixo para Simples Nacional</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Alíquotas ICMS por Estado de Destino</Label>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <PlusCircle className="h-3 w-3" />
                        Adicionar Estado
                      </Button>
                    </div>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Estado</TableHead>
                            <TableHead>Alíquota (%)</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Select defaultValue="RS">
                                <SelectTrigger id="estado-destino-1">
                                  <SelectValue placeholder="Selecione" />
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
                              <div className="flex items-center gap-2">
                                <Input defaultValue="17.5" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Select defaultValue="SP">
                                <SelectTrigger id="estado-destino-2">
                                  <SelectValue placeholder="Selecione" />
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
                              <div className="flex items-center gap-2">
                                <Input defaultValue="12.0" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Configure alíquotas específicas por estado de destino</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <h3 className="text-lg font-medium mb-4">Diferencial de Alíquotas (DIFAL)</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Calcular DIFAL automaticamente</Label>
                        <p className="text-sm text-muted-foreground">Calcular diferencial de alíquotas para vendas interestaduais</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="percentual-partilha">Percentual de Partilha DIFAL</Label>
                    <div className="flex items-center gap-2">
                      <Input id="percentual-partilha" defaultValue="100" />
                      <span className="text-sm">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Percentual destinado ao estado de destino</p>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Informações do Simples Nacional</Label>
                        <p className="text-sm text-muted-foreground">Seu regime tributário é Simples Nacional</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md mt-2">
                      <p className="text-sm">No Simples Nacional, as alíquotas de PIS (0,65%) e COFINS (3,0%) são fixas e já estão incluídas na alíquota única do regime. Os valores configurados aqui serão utilizados apenas para fins de demonstração nos documentos fiscais.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <h3 className="text-lg font-medium mb-4">Certificado Digital e SEFAZ-RS</h3>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="tipo-certificado">Tipo de Certificado</Label>
                    <Select defaultValue="a1">
                      <SelectTrigger id="tipo-certificado">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a1">Certificado A1</SelectItem>
                        <SelectItem value="a3">Certificado A3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="url-webservice">URL Webservice SEFAZ-RS</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select defaultValue="producao">
                        <SelectTrigger id="ambiente-webservice">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="producao">Produção</SelectItem>
                          <SelectItem value="homologacao">Homologação</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input id="url-webservice" defaultValue="https://nfe.sefazrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx" />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Testar Conexão com SEFAZ
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certificado-digital">Certificado Digital</Label>
                    <div className="flex items-center gap-2">
                      <Input id="certificado-digital" type="file" className="hidden" />
                      <Button variant="outline" className="w-full justify-start" onClick={() => document.getElementById('certificado-digital')?.click()}>
                        Selecionar certificado
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Nenhum certificado selecionado</p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="senha-certificado">Senha do Certificado</Label>
                    <Input id="senha-certificado" type="password" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="serie-nfe">Série NFe</Label>
                      <Input id="serie-nfe" defaultValue="1" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="proxima-nfe">Próxima NFe</Label>
                      <Input id="proxima-nfe" defaultValue="123" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="ambiente">Ambiente</Label>
                      <Select defaultValue="homologacao">
                        <SelectTrigger id="ambiente">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="homologacao">Homologação</SelectItem>
                          <SelectItem value="producao">Produção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="csc">CSC (Código de Segurança do Contribuinte)</Label>
                      <Input id="csc" type="password" placeholder="Código para NFC-e" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h3 className="text-lg font-medium mb-4">Nota Fiscal Gaúcha (NFG)</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Integração com NFG</Label>
                        <p className="text-sm text-muted-foreground">Ativar integração com o programa Nota Fiscal Gaúcha</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Solicitar CPF do Consumidor</Label>
                        <p className="text-sm text-muted-foreground">Solicitar CPF do consumidor para registro no programa NFG</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Consulta de Pontuação NFG</Label>
                        <p className="text-sm text-muted-foreground">Permitir consulta de pontuação acumulada pelo consumidor</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="mensagem-nfg">Mensagem NFG</Label>
                    <Textarea 
                      id="mensagem-nfg" 
                      defaultValue="Este documento é válido para a Nota Fiscal Gaúcha" 
                      placeholder="Mensagem exibida no DANFE" 
                    />
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h3 className="text-lg font-medium mb-4">Configurações de DANFE e Impressão</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="layout-danfe">Layout do DANFE</Label>
                    <Select defaultValue="padrao">
                      <SelectTrigger id="layout-danfe">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="padrao">Padrão</SelectItem>
                        <SelectItem value="simplificado">Simplificado</SelectItem>
                        <SelectItem value="personalizado">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Modo Contingencial (Offline)</Label>
                        <p className="text-sm text-muted-foreground">Ativar modo de contingência quando SEFAZ estiver indisponível</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Impressão Automática</Label>
                        <p className="text-sm text-muted-foreground">Imprimir DANFE automaticamente após emissão</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Salvar configurações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Novo Usuário
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
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
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={usuario.avatar} alt={usuario.nome} />
                              <AvatarFallback>{usuario.nome.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{usuario.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{usuario.cargo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${usuario.ativo ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span>{usuario.ativo ? 'Ativo' : 'Inativo'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
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
                <div className="space-y-6">
                  <div>
                    <Label className="text-base">Administrador</Label>
                    <p className="text-sm text-muted-foreground">Acesso completo a todas as funcionalidades do sistema</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="font-medium">Dashboard</div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-dashboard-view" className="text-sm">Visualizar</Label>
                          <Switch id="admin-dashboard-view" defaultChecked disabled />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="font-medium">Vendas</div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-vendas-view" className="text-sm">Visualizar</Label>
                          <Switch id="admin-vendas-view" defaultChecked disabled />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-vendas-create" className="text-sm">Criar/Editar</Label>
                          <Switch id="admin-vendas-create" defaultChecked disabled />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-vendas-delete" className="text-sm">Excluir</Label>
                          <Switch id="admin-vendas-delete" defaultChecked disabled />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="font-medium">Financeiro</div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-financeiro-view" className="text-sm">Visualizar</Label>
                          <Switch id="admin-financeiro-view" defaultChecked disabled />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-financeiro-create" className="text-sm">Criar/Editar</Label>
                          <Switch id="admin-financeiro-create" defaultChecked disabled />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-financeiro-delete" className="text-sm">Excluir</Label>
                          <Switch id="admin-financeiro-delete" defaultChecked disabled />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="text-base">Vendedor</Label>
                    <p className="text-sm text-muted-foreground">Acesso às funcionalidades de vendas e clientes</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="font-medium">Dashboard</div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vendedor-dashboard-view" className="text-sm">Visualizar</Label>
                          <Switch id="vendedor-dashboard-view" defaultChecked />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="font-medium">Vendas</div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vendedor-vendas-view" className="text-sm">Visualizar</Label>
                          <Switch id="vendedor-vendas-view" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vendedor-vendas-create" className="text-sm">Criar/Editar</Label>
                          <Switch id="vendedor-vendas-create" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vendedor-vendas-delete" className="text-sm">Excluir</Label>
                          <Switch id="vendedor-vendas-delete" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="font-medium">Financeiro</div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vendedor-financeiro-view" className="text-sm">Visualizar</Label>
                          <Switch id="vendedor-financeiro-view" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vendedor-financeiro-create" className="text-sm">Criar/Editar</Label>
                          <Switch id="vendedor-financeiro-create" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="vendedor-financeiro-delete" className="text-sm">Excluir</Label>
                          <Switch id="vendedor-financeiro-delete" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Salvar permissões</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}