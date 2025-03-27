import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { db } from "./db"

// Função para verificar autenticação
export async function auth() {
  try {
    // Verificar se o token existe
    const token = await cookies().get("auth_token")?.value

    if (!token) {
      return null
    }

    // Verificar se o token é válido
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")

      // Verificar se o usuário ainda existe e está ativo
      const user = await db.query("SELECT id, name, email, role FROM users WHERE id = ? AND active = 1", [decoded.id])

      if (!user || user.length === 0) {
        return null
      }

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
export function checkRole(allowedRoles) {
  return async (request) => {
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

