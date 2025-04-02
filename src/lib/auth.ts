import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { db } from "./db"
import { env } from "./env"

// Interfaces para tipos
interface JwtPayload {
  id: number;
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

// Função para verificar autenticação
export async function auth() {
  try {
    // Verificar se o token existe
    const cookieStore = cookies()
    const token = await cookieStore.get("auth_token")?.value

    if (!token) {
      return null
    }

    // Verificar se o token é válido
    try {
      // Usar a variável JWT_SECRET do módulo env
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload

      // Verificar se o usuário ainda existe e está ativo
      const user = await db.query("SELECT id, name, email, role FROM users WHERE id = ? AND active = 1", [decoded.id])

      if (!user || user.length === 0) {
        return null
      }

      // Log para verificar o usuário encontrado
      console.log("Usuário autenticado:", user[0])

      return {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role,
      }
    } catch (error) {
      return null
    }
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error)
    return null
  }
}

// Middleware para verificar permissões
export function checkRole(allowedRoles: string[]) {
  return async (request: any) => {
    const session = await auth()

    if (!session) {
      return {
        authorized: false,
        message: "Não autenticado",
      }
    }

    if (!allowedRoles.includes(session.role)) {
      return {
        authorized: false,
        message: "Não autorizado",
      }
    }

    return {
      authorized: true,
      user: session,
    }
  }
}