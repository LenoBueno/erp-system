import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { User } from "@/lib/types"

export async function GET() {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Buscar dados completos do usuário
    const user = await db.query<User>(
      "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?", 
      [session.id]
    )

    if (!user || user.length === 0) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      user: user[0]
    })
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const { name, email } = await request.json()

    // Validar dados
    if (!name || !email) {
      return NextResponse.json({ message: "Nome e email são obrigatórios" }, { status: 400 })
    }

    // Atualizar usuário
    await db.query(
      "UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?",
      [name, email, session.id]
    )

    return NextResponse.json({
      message: "Perfil atualizado com sucesso",
      user: {
        ...session,
        name,
        email
      }
    })
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}