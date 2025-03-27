import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "@/lib/types"
import { env } from "@/lib/env"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validar dados de entrada
    if (!email || !password) {
      return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar usuário no banco de dados
    const result = await db.query<User>("SELECT * FROM users WHERE email = ?", [email])

    // Verificar se o usuário existe
    if (result.length === 0) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    // Verificar se a senha fornecida corresponde à senha criptografada no banco
    const user = result[0]
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar o token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      env.JWT_SECRET,  // Certifique-se de que a chave secreta está definida corretamente
      { expiresIn: "8h" }
    )

    // Criar a resposta JSON
    const res = NextResponse.json({
      message: "Login realizado com sucesso",
      user: { ...user, password: undefined }, // Remove a senha antes de retornar os dados do usuário
    })

    // Adicionar o cookie JWT manualmente no cabeçalho 'Set-Cookie'
    res.headers.set('Set-Cookie', `auth_token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 8}; SameSite=strict; Secure=${env.NODE_ENV === "production"}`);

    return res

  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
