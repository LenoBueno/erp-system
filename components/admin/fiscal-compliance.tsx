"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Calendar,
  FileCheck,
  Info,
  ExternalLink,
  ArrowRight
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

interface ComplianceItem {
  id: string
  name: string
  description: string
  dueDate: string
  status: "compliant" | "warning" | "non_compliant" | "pending"
  category: "nfe" | "nfce" | "certificate" | "tax" | "sped" | "other"
}

export function FiscalCompliance() {
  const { toast } = useToast()
  const [isChecking, setIsChecking] = useState(false)
  const [checkProgress, setCheckProgress] = useState(0)
  const [lastCheckDate, setLastCheckDate] = useState("30/03/2025 15:45")
  
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    {
      id: "1",
      name: "Certificado Digital A1",
      description: "Certificado digital para emissão de notas fiscais",
      dueDate: "15/05/2025",
      status: "warning",
      category: "certificate"
    },
    {
      id: "2",
      name: "Validador NFe SEFAZ-RS",
      description: "Validação de esquema XML para NFe",
      dueDate: "N/A",
      status: "compliant",
      category: "nfe"
    },
    {
      id: "3",
      name: "SPED Fiscal",
      description: "Entrega da escrituração fiscal digital",
      dueDate: "10/04/2025",
      status: "pending",
      category: "sped"
    },
    {
      id: "4",
      name: "Cadastro de NCM",
      description: "Atualização dos códigos NCM dos produtos",
      dueDate: "N/A",
      status: "non_compliant",
      category: "tax"
    },
    {
      id: "5",
      name: "Contingência NFCe",
      description: "Configuração do modo de contingência para NFCe",
      dueDate: "N/A",
      status: "compliant",
      category: "nfce"
    },
    {
      id: "6",
      name: "Alíquotas de ICMS",
      description: "Atualização das alíquotas de ICMS interestaduais",
      dueDate: "N/A",
      status: "compliant",
      category: "tax"
    },
    {
      id: "7",
      name: "Nota Fiscal Gaúcha",
      description: "Integração com o programa Nota Fiscal Gaúcha",
      dueDate: "N/A",
      status: "warning",
      category: "other"
    }
  ])
  
  const handleCheckCompliance = () => {
    if (isChecking) return;
    
    setIsChecking(true)
    setCheckProgress(0)
    
    toast({
      title: "Verificação de conformidade iniciada",
      description: "Verificando a conformidade fiscal do sistema",
      variant: "default",
    })
    
    const interval = setInterval(() => {
      setCheckProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsChecking(false)
          setLastCheckDate(new Date().toLocaleDateString("pt-BR") + " " + 
            new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))
          
          toast({
            title: "Verificação concluída",
            description: "A verificação de conformidade fiscal foi concluída",
            variant: "default",
          })
          
          // Atualizar aleatoriamente alguns status para simular a verificação
          setComplianceItems(prev => 
            prev.map(item => {
              const random = Math.random();
              if (random > 0.7) {
                return {
                  ...item,
                  status: "compliant"
                };
              }
              return item;
            })
          );
          
          return 100;
        }
        const increment = Math.random() * 15;
        return Math.min(prev + increment, 100);
      });
    }, 800);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "compliant":
        return <Badge className="bg-green-500 hover:bg-green-600">Conforme</Badge>;
      case "warning":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Atenção</Badge>;
      case "non_compliant":
        return <Badge className="bg-red-500 hover:bg-red-600">Não Conforme</Badge>;
      case "pending":
        return <Badge variant="outline">Pendente</Badge>;
      default:
        return null;
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "nfe":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "nfce":
        return <FileText className="h-4 w-4 text-purple-500" />;
      case "certificate":
        return <FileCheck className="h-4 w-4 text-green-500" />;
      case "tax":
        return <FileText className="h-4 w-4 text-amber-500" />;
      case "sped":
        return <FileText className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getComplianceScore = () => {
    const total = complianceItems.length;
    const compliant = complianceItems.filter(item => item.status === "compliant").length;
    const warning = complianceItems.filter(item => item.status === "warning").length;
    
    return Math.round((compliant + (warning * 0.5)) / total * 100);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <span className={`text-xl font-bold ${getScoreColor(getComplianceScore())}`}>
              {getComplianceScore()}%
            </span>
          </div>
          <div>
            <h3 className="font-medium">Conformidade Fiscal</h3>
            <p className="text-sm text-muted-foreground">Última verificação: {lastCheckDate}</p>
          </div>
        </div>
        
        <Button onClick={handleCheckCompliance} disabled={isChecking} className="whitespace-nowrap">
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <FileCheck className="h-4 w-4 mr-2" />
              Verificar Conformidade
            </>
          )}
        </Button>
      </div>
      
      {isChecking && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso da verificação</span>
            <span>{Math.round(checkProgress)}%</span>
          </div>
          <Progress value={checkProgress} className="h-2" />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Conforme
              </h4>
              <span className="text-xl font-bold">
                {complianceItems.filter(item => item.status === "compliant").length}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Atenção
              </h4>
              <span className="text-xl font-bold">
                {complianceItems.filter(item => item.status === "warning").length}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Não Conforme
              </h4>
              <span className="text-xl font-bold">
                {complianceItems.filter(item => item.status === "non_compliant").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-4">Itens de Conformidade</h3>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.category)}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{item.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-4">Calendário Fiscal</h3>
        
        <div className="space-y-3">
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">SPED Fiscal</p>
                  <p className="text-xs text-muted-foreground">Entrega mensal</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium">10/04/2025</p>
                <p className="text-xs text-muted-foreground">Em 10 dias</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">SPED Contribuições</p>
                  <p className="text-xs text-muted-foreground">Entrega mensal</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium">15/04/2025</p>
                <p className="text-xs text-muted-foreground">Em 15 dias</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Renovação de Certificado Digital</p>
                  <p className="text-xs text-muted-foreground">Vencimento</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium">15/05/2025</p>
                <p className="text-xs text-muted-foreground">Em 45 dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md">
        <h4 className="font-medium flex items-center gap-2 mb-2">
          <Info className="h-5 w-5" />
          Recursos Fiscais
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a href="#" className="hover:underline">Portal da SEFAZ-RS</a>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a href="#" className="hover:underline">Validador de Notas Fiscais</a>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a href="#" className="hover:underline">Consulta de NCM</a>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a href="#" className="hover:underline">Calendário Tributário 2025</a>
          </div>
        </div>
      </div>
    </div>
  )
}
