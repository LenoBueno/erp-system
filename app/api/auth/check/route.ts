import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { User } from "@/lib/types"
import { env } from "@/lib/env" // Importe o env para consistência com seu login

export async function GET() {
  try {
    // Verificar se o token existe nos cookies de forma assíncrona
    const cookieStore = cookies() // Chama cookies() para obter os cookies
    const token = await cookieStore.get("auth_token")?.value

    // Se o token não estiver presente, retorna erro de não autenticado
    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 })
    }

    // Garantir que JWT_SECRET está definido no ambiente
    if (!env.JWT_SECRET) {
      throw new Error("Chave secreta JWT não configurada no ambiente")
    }

    // Verificar e decodificar o token JWT
    const decoded = jwt.verify(token, env.JWT_SECRET) as User

    // Retornar a resposta de sucesso com as informações do usuário
    return NextResponse.json({
      authenticated: true,
      user: decoded,
    })

  } catch (error) {
    // Verificar se o erro é de token inválido ou expirado
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      // Se o token for inválido ou expirado, deletar o cookie
      const cookieStore = cookies() // Chama cookies() novamente para manipular o cookie
      await cookieStore.delete("auth_token") // Deleta o cookie de autenticação
      return NextResponse.json({ message: "Token inválido ou expirado" }, { status: 401 })
    }

    // Caso contrário, se for outro erro, logar o erro e retornar uma resposta interna
    console.error("Erro ao verificar autenticação:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor", error: (error instanceof Error) ? error.message : "Desconhecido" },
      { status: 500 }
    )
  }
}
