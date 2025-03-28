import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Buscar notificações do usuário
    const notifications = await db.query(
      `SELECT id, message, \`read\`, created_at 
       FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC
       LIMIT 10`, 
      [session.id]
    )

    return NextResponse.json({
      notifications: notifications || []
    })
  } catch (error) {
    console.error("Erro ao buscar notificações:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

// Marcar notificação como lida
export async function POST(request: Request) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Obter o ID da notificação do corpo da requisição
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json({ message: "ID da notificação é obrigatório" }, { status: 400 })
    }

    // Verificar se a notificação pertence ao usuário
    const notification = await db.query(
      "SELECT id FROM notifications WHERE id = ? AND user_id = ?", 
      [id, session.id]
    )

    if (!notification || notification.length === 0) {
      return NextResponse.json({ message: "Notificação não encontrada" }, { status: 404 })
    }

    // Marcar como lida
    await db.query(
      "UPDATE notifications SET read = TRUE WHERE id = ?", 
      [id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}