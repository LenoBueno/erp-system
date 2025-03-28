import bcrypt from 'bcrypt'
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { env } from "@/lib/env"

export async function POST(request: Request) {
  try {
    // Pegar email e senha do corpo da requisição
    const { email, password } = await request.json()

    // Validar dados de entrada
    if (!email || !password) {
      return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar usuário no banco de dados
    const result = await db.query("SELECT * FROM users WHERE email = ?", [email])

    // Verificar o resultado da consulta
    console.log("Resultado da consulta:", result)

    // Verificar se o usuário existe (acessando o primeiro elemento do array)
    if (!result[0] || result[0].length === 0) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    // Obter o usuário encontrado (acessando o primeiro elemento do array)
    const user = result[0][0]

    // Log para verificar o usuário encontrado
    console.log("Usuário encontrado:", user)

    // Verificar a senha
    let passwordMatch = false;

    if (user && user.password) {
      // Verificar se a senha começa com $2b$ ou $2a$ (formato bcrypt)
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
        // A senha está criptografada com bcrypt
        passwordMatch = await bcrypt.compare(password, user.password)
      } else {
        // A senha não está criptografada, comparando diretamente
        passwordMatch = password === user.password
      }
    }

    // Log para verificar as senhas e o resultado da comparação
    console.log("Senha fornecida:", password)
    console.log("Senha do banco:", user.password)
    console.log("Senha corresponde:", passwordMatch)

    // Se a senha não corresponder, retorna erro 401
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
      env.JWT_SECRET,  // Certifique-se de que a chave secreta está definida corretamente no seu .env
      { expiresIn: "8h" }
    )

    // Criar a resposta JSON
    const res = NextResponse.json({
      message: "Login realizado com sucesso",
      user: { ...user, password: undefined }, // Remove a senha antes de retornar os dados do usuário
    })

    // Adicionar o cookie JWT manualmente no cabeçalho 'Set-Cookie'
    res.headers.set('Set-Cookie', `auth_token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 8}; SameSite=Strict; Secure=${env.NODE_ENV === "production"}`)

    return res

  } catch (error) {
    // Melhor tratamento de erro
    console.error("Erro ao fazer login:", error)
    return NextResponse.json({ message: "Erro interno do servidor", error: (error instanceof Error) ? error.message : "Desconhecido" }, { status: 500 })
  }
}
