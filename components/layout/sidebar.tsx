"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  Home,
  ShoppingBag,
  Users,
  FileText,
  BarChart2,
  Package,
  Truck,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/hooks/use-theme"

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  path: string
  subItems?: { title: string; path: string }[]
}

const SidebarItem = ({ icon, title, path, subItems }: SidebarItemProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const hasSubItems = subItems && subItems.length > 0
  const isActive = pathname === path || (hasSubItems && subItems.some((item) => pathname === item.path))
  
  // Verificar se algum subitem está ativo para manter o menu aberto
  useEffect(() => {
    if (hasSubItems && subItems.some(item => pathname === item.path)) {
      setIsOpen(true)
    }
  }, [pathname, hasSubItems, subItems])

  return (
    <div>
      <Link href={hasSubItems ? "#" : path} onClick={hasSubItems ? () => setIsOpen(!isOpen) : undefined}>
        <div
          className={cn(
            "flex items-center py-2 px-4 mb-1 cursor-pointer transition-colors",
            isActive 
              ? "text-foreground" 
              : "text-muted-foreground"
          )}
        >
          <span className={cn(
            "mr-3 flex items-center justify-center w-8 h-8",
            isActive ? "text-foreground" : "text-muted-foreground"
          )}>{icon}</span>
          <span className="flex-1 text-sm font-medium">{title}</span>
          {hasSubItems && (
            <span className="ml-2">{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
          )}
        </div>
      </Link>

      {hasSubItems && isOpen && (
        <div className="ml-6 mt-1 space-y-1 pl-4 relative">
          {/* Linha vertical conectando todos os subitens */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-border"></div>
          
          {subItems.map((item, index) => {
            const isLastItem = index === subItems.length - 1;
            return (
              <Link key={index} href={item.path}>
                <div
                  className={cn(
                    "py-2 px-3 text-sm cursor-pointer transition-colors relative",
                    pathname === item.path 
                      ? "text-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* Linha horizontal conectando ao item */}
                  <div className="absolute left-[-16px] top-1/2 transform -translate-y-1/2 w-4 h-[1px] bg-border"></div>
                  
                  {/* Para o último item, adicionar uma classe que limita a linha vertical */}
                  {isLastItem && (
                    <div className="absolute left-[-16px] top-1/2 bottom-0 w-[1px] bg-background"></div>
                  )}
                  
                  {item.title}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Carregar o estado do sidebar do localStorage
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed')
    if (savedCollapsedState) {
      setIsCollapsed(savedCollapsedState === 'true')
    }
  }, [])

  // Função para alternar o estado do sidebar e salvar no localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
  }

  // Hook de tema removido pois foi movido para um hook personalizado
  
  const sidebarItems: SidebarItemProps[] = [
    {
      icon: <Home size={20} />,
      title: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <ShoppingBag size={20} />,
      title: "Vendas",
      path: "/vendas",
      subItems: [
        { title: "Pedidos", path: "/vendas/pedidos" },
        { title: "Orçamentos", path: "/vendas/orcamentos" },
        { title: "PDV", path: "/vendas/pdv" },
      ],
    },
    {
      icon: <Package size={20} />,
      title: "Produtos",
      path: "/produtos",
      subItems: [
        { title: "Cadastro", path: "/produtos/cadastro" },
        { title: "Catálogo", path: "/produtos/catalogo" },
        { title: "Categorias", path: "/produtos/categorias" },
        { title: "Estoque", path: "/produtos/estoque" },
      ],
    },
    {
      icon: <Users size={20} />,
      title: "Clientes",
      path: "/clientes",
    },
    {
      icon: <Truck size={20} />,
      title: "Fornecedores",
      path: "/fornecedores",
    },
    {
      icon: <DollarSign size={20} />,
      title: "Financeiro",
      path: "/financeiro",
      subItems: [
        { title: "Contas a Receber", path: "/financeiro/contas-receber" },
        { title: "Contas a Pagar", path: "/financeiro/contas-pagar" },
        { title: "Fluxo de Caixa", path: "/financeiro/fluxo-caixa" },
        { title: "Nota Fiscal Eletrônica", path: "/financeiro/nota-fiscal" },
      ],
    },
    {
      icon: <FileText size={20} />,
      title: "Relatórios",
      path: "/relatorios",
      subItems: [
        { title: "Vendas", path: "/relatorios/vendas" },
        { title: "Produtos", path: "/relatorios/produtos" },
        { title: "Financeiro", path: "/relatorios/financeiro" },
        { title: "Clientes", path: "/relatorios/clientes" },
      ],
    },
    {
      icon: <BarChart2 size={20} />,
      title: "Estatísticas",
      path: "/estatisticas",
    },
  ]

  return (
    <div className={cn(
      "h-screen border-r flex flex-col transition-all",
      isCollapsed ? "w-20" : "w-64",
      "bg-background border-border text-foreground"
    )}>
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center w-full">
            <span className="font-bold text-lg">2103 C R E A T I V E</span>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <span className="font-bold text-base">2103</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar..." 
              className="pl-8 border-input"
            />
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-3">
        {sidebarItems.map((item, index) => (
          <div 
            key={index}
            onMouseEnter={() => isCollapsed && setHoveredItem(item.title)}
            onMouseLeave={() => isCollapsed && setHoveredItem(null)}
            className="relative"
          >
            {isCollapsed && hoveredItem === item.title && (
              <div className="absolute left-14 z-50 bg-popover text-popover-foreground rounded-md shadow-md px-3 py-2 whitespace-nowrap">
                {item.title}
              </div>
            )}
            <SidebarItem 
              icon={item.icon} 
              title={isCollapsed ? "" : item.title} 
              path={item.path} 
              subItems={isCollapsed ? undefined : item.subItems} 
            />
          </div>
        ))}
      </div>
      
      {/* Removido o rodapé com botões de tema e sair */}
    </div>
  )
}
