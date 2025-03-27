import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Remover cookie de autenticação
    const cookieStore = cookies()
    cookieStore.delete("auth_token")

    return NextResponse.json({
      message: "Logout realizado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao fazer logout:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

