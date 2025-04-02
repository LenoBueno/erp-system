import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Retornar dados simulados para desenvolvimento
    return NextResponse.json({
      stats: {
        totalSales: 125000,
        totalCustomers: 420,
        totalOrders: 1280,
        totalProducts: 540,
        salesGrowth: 12.5,
        customersGrowth: 8.2,
        ordersGrowth: 15.7,
        productsGrowth: 3.5,
        recentSales: [
          { date: "01/04", amount: 3200 },
          { date: "02/04", amount: 4500 },
          { date: "03/04", amount: 3800 },
          { date: "04/04", amount: 5100 },
          { date: "05/04", amount: 4300 },
          { date: "06/04", amount: 3700 },
          { date: "07/04", amount: 5800 }
        ],
        productCategories: [
          { category: "Eletrônicos", count: 145 },
          { category: "Móveis", count: 98 },
          { category: "Vestuário", count: 120 },
          { category: "Alimentos", count: 87 },
          { category: "Cosméticos", count: 65 },
          { category: "Outros", count: 25 }
        ],
        monthlySales: [
          { month: "01/2024", sales: 28500 },
          { month: "02/2024", sales: 31200 },
          { month: "03/2024", sales: 35800 },
          { month: "04/2024", sales: 42500 }
        ],
        lowStockProducts: [
          { id: 1, name: "Smartphone X", stock: 3, minStock: 5 },
          { id: 2, name: "Notebook Pro", stock: 2, minStock: 5 },
          { id: 3, name: "Headphone BT", stock: 4, minStock: 10 }
        ],
        paymentStatus: [
          { status: "Pago", count: 980, amount: 98500 },
          { status: "Pendente", count: 240, amount: 22000 },
          { status: "Cancelado", count: 60, amount: 4500 }
        ],
        topCustomers: [
          { id: 1, name: "João Silva", totalOrders: 12, totalSpent: 15800 },
          { id: 2, name: "Maria Oliveira", totalOrders: 9, totalSpent: 12500 },
          { id: 3, name: "Carlos Pereira", totalOrders: 8, totalSpent: 9800 }
        ]
      }
    });
  } catch (error) {
    console.error("Erro ao obter estatísticas do dashboard:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

