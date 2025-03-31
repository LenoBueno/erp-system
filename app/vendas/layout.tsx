"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, FileText, Calculator } from "lucide-react"

export default function VendasLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const getActiveTab = () => {
    if (pathname.includes("/vendas/pedidos")) return "pedidos"
    if (pathname.includes("/vendas/orcamentos")) return "orcamentos"
    if (pathname.includes("/pdv")) return "pdv"
    return "pedidos" // default
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Vendas</h1>
          
          <Tabs value={getActiveTab()} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-3">
              <Link href="/vendas/pedidos" passHref>
                <TabsTrigger value="pedidos" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Pedidos</span>
                </TabsTrigger>
              </Link>
              <Link href="/vendas/orcamentos" passHref>
                <TabsTrigger value="orcamentos" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  <span className="hidden sm:inline">Orçamentos</span>
                </TabsTrigger>
              </Link>
              <Link href="/pdv" passHref>
                <TabsTrigger value="pdv" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">PDV</span>
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>

        <div>
          {children}
        </div>
      </div>
    </MainLayout>
  )
}
