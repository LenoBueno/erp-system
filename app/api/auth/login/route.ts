import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validar dados
    if (!email || !password) {
      return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar usuário
    const user = await db.query("SELECT * FROM users WHERE email = ?", [email])

    if (!user || user.length === 0) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user[0].password)
    if (!passwordMatch) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        role: user[0].role,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "8h" },
    )

    // Salvar token em cookie
    cookies().set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // 8 horas
    })

    // Retornar dados do usuário (sem a senha)
    const { password: _, ...userData } = user[0]

    return NextResponse.json({
      message: "Login realizado com sucesso",
      user: userData,
    })
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    console.error("Detalhes do erro:", JSON.stringify(error, null, 2))
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

