"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  ShoppingBag,
  Users,
  FileText,
  BarChart2,
  Settings,
  Package,
  Truck,
  DollarSign,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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

  return (
    <div>
      <Link href={hasSubItems ? "#" : path} onClick={hasSubItems ? () => setIsOpen(!isOpen) : undefined}>
        <div
          className={cn(
            "flex items-center py-2 px-4 rounded-md mb-1 cursor-pointer",
            isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
          )}
        >
          <span className="mr-3">{icon}</span>
          <span className="flex-1">{title}</span>
          {hasSubItems && (
            <span className="ml-2">{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
          )}
        </div>
      </Link>

      {hasSubItems && isOpen && (
        <div className="ml-8 mt-1 space-y-1">
          {subItems.map((item, index) => (
            <Link key={index} href={item.path}>
              <div
                className={cn(
                  "py-2 px-3 rounded-md text-sm cursor-pointer",
                  pathname === item.path ? "bg-primary/10 text-primary" : "hover:bg-muted",
                )}
              >
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const { toast } = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast({
          title: "Logout realizado com sucesso",
          description: "Você será redirecionado para a página de login",
        })
        router.push("/login")
      } else {
        throw new Error("Falha ao realizar logout")
      }
    } catch (error) {
      toast({
        title: "Erro ao realizar logout",
        description: "Ocorreu um erro ao tentar sair do sistema",
        variant: "destructive",
      })
    }
  }

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
    {
      icon: <Settings size={20} />,
      title: "Configurações",
      path: "/configuracoes",
      subItems: [
        { title: "Perfil", path: "/configuracoes/perfil" },
        { title: "Empresa", path: "/configuracoes/empresa" },
        { title: "Usuários", path: "/configuracoes/usuarios" },
      ],
    },
  ]

  return (
    <div className="w-64 h-screen bg-card border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-center">Simple Ink ERP</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {sidebarItems.map((item, index) => (
          <SidebarItem key={index} icon={item.icon} title={item.title} path={item.path} subItems={item.subItems} />
        ))}
      </div>
      <div className="p-3 border-t">
        <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  )
}

