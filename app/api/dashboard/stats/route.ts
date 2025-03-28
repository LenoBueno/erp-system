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

    // Obter estatísticas do dashboard
    const [
      totalSalesResult,
      totalCustomersResult,
      totalOrdersResult,
      totalProductsResult,
      salesGrowthResult,
      customersGrowthResult,
      ordersGrowthResult,
      productsGrowthResult,
      recentSalesResult,
      productCategoriesResult,
      monthlySalesResult,
    ] = await Promise.all([
      // Total de vendas
      db.query(`
        SELECT COALESCE(SUM(total_amount), 0) as total
        FROM orders
        WHERE status = 'completed'
      `),

      // Total de clientes
      db.query(`
        SELECT COUNT(*) as total
        FROM customers
      `),

      // Total de pedidos
      db.query(`
        SELECT COUNT(*) as total
        FROM orders
      `),

      // Total de produtos
      db.query(`
        SELECT COUNT(*) as total
        FROM products
      `),

      // Crescimento de vendas
      db.query(`
        SELECT 
          (
            (
              SELECT COALESCE(SUM(total_amount), 0)
              FROM orders
              WHERE 
                status = 'completed' AND
                created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01') AND
                created_at < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
            ) - 
            (
              SELECT COALESCE(SUM(total_amount), 0)
              FROM orders
              WHERE 
                status = 'completed' AND
                created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 2 MONTH, '%Y-%m-01') AND
                created_at < DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01')
            )
          ) / 
          NULLIF(
            (
              SELECT COALESCE(SUM(total_amount), 0)
              FROM orders
              WHERE 
                status = 'completed' AND
                created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 2 MONTH, '%Y-%m-01') AND
                created_at < DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01')
            ), 0
          ) * 100 as growth
      `),

      // Crescimento de clientes
      db.query(`
        SELECT 
          (
            (
              SELECT COUNT(*)
              FROM customers
              WHERE created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01') AND
                    created_at < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
            ) - 
            (
              SELECT COUNT(*)
              FROM customers
              WHERE created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 2 MONTH, '%Y-%m-01') AND
                    created_at < DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01')
            )
          ) / 
          NULLIF(
            (
              SELECT COUNT(*)
              FROM customers
              WHERE created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 2 MONTH, '%Y-%m-01') AND
                    created_at < DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01')
            ), 0
          ) * 100 as growth
      `),

      // Crescimento de pedidos
      db.query(`
        SELECT 
          (
            (
              SELECT COUNT(*)
              FROM orders
              WHERE created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01') AND
                    created_at < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
            ) - 
            (
              SELECT COUNT(*)
              FROM orders
              WHERE created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 2 MONTH, '%Y-%m-01') AND
                    created_at < DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01')
            )
          ) / 
          NULLIF(
            (
              SELECT COUNT(*)
              FROM orders
              WHERE created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 2 MONTH, '%Y-%m-01') AND
                    created_at < DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01')
            ), 0
          ) * 100 as growth
      `),

      // Crescimento de produtos
      db.query(`
        SELECT 
          (
            (
              SELECT COUNT(*)
              FROM products
              WHERE created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01') AND
                    created_at < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
            ) - 
            (
              SELECT COUNT(*)
              FROM products
              WHERE created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 2 MONTH, '%Y-%m-01') AND
                    created_at < DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01')
            )
          ) / 
          NULLIF(
            (
              SELECT COUNT(*)
              FROM products
              WHERE created_at >= DATE_FORMAT(CURRENT_DATE - INTERVAL 2 MONTH, '%Y-%m-01') AND
                    created_at < DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01')
            ), 0
          ) * 100 as growth
      `),

      // Vendas recentes
      db.query(`
        SELECT 
          DATE_FORMAT(created_at, '%d/%m') as date,
          SUM(total_amount) as amount
        FROM orders
        WHERE 
          status = 'completed' AND
          created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
        GROUP BY DATE_FORMAT(created_at, '%d/%m')
        ORDER BY created_at DESC
        LIMIT 10
      `),

      // Produtos por categoria
      db.query(`
        SELECT 
          c.name as category,
          COUNT(p.id) as count
        FROM products p
        JOIN categories c ON p.category_id = c.id
        GROUP BY c.id, c.name
        ORDER BY count DESC
        LIMIT 6
      `),

      // Vendas mensais
      db.query(`
        SELECT 
          DATE_FORMAT(created_at, '%m/%Y') as month,
          SUM(total_amount) as sales
        FROM orders
        WHERE 
          status = 'completed' AND
          created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%m/%Y')
        ORDER BY created_at ASC
      `),
    ])

    // Formatar dados
    const stats = {
      totalSales: totalSalesResult[0]?.total || 0,
      totalCustomers: totalCustomersResult[0]?.total || 0,
      totalOrders: totalOrdersResult[0]?.total || 0,
      totalProducts: totalProductsResult[0]?.total || 0,
      salesGrowth: Number.parseFloat(salesGrowthResult[0]?.growth || 0).toFixed(2),
      customersGrowth: Number.parseFloat(customersGrowthResult[0]?.growth || 0).toFixed(2),
      ordersGrowth: Number.parseFloat(ordersGrowthResult[0]?.growth || 0).toFixed(2),
      productsGrowth: Number.parseFloat(productsGrowthResult[0]?.growth || 0).toFixed(2),
      recentSales: recentSalesResult || [],
      productCategories: productCategoriesResult || [],
      monthlySales: monthlySalesResult || [],
    }

    return NextResponse.json({ stats })
  } catch (dbError) {
    // Tratar erro específico de tabela inexistente
    if (dbError.code === 'ER_NO_SUCH_TABLE') {
      console.warn("Tabela 'orders' não existe. Retornando dados simulados.")
      // Retornar dados simulados temporários
      return NextResponse.json({
        stats: {
          totalSales: 0,
          totalCustomers: 0,
          totalOrders: 0,
          totalProducts: 0,
          salesGrowth: 0,
          customersGrowth: 0,
          ordersGrowth: 0,
          productsGrowth: 0,
          recentSales: [],
          productCategories: [],
          monthlySales: [],
        }
      })
    } else {
      console.error("Erro ao obter estatísticas do dashboard:", dbError)
      return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
    }
  }
}

