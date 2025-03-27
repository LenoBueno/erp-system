import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { User } from "@/lib/types"

export async function GET() {
  try {
    // Verificar se o token existe
    const token = await cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 })
    }

    // Verificar se o token é válido
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
      return NextResponse.json({
        authenticated: true,
        user: decoded,
      })
    } catch (error) {
      await cookies().delete("auth_token")
      return NextResponse.json({ message: "Token inválido ou expirado" }, { status: 401 })
    }
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

