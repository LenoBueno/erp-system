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

    // Em ambiente de desenvolvimento, permitir qualquer login para fins de teste
    if (env.NODE_ENV === "development") {
      // Gerar o token JWT com dados de usuário fake
      const token = jwt.sign(
        {
          id: 1,
          email: email,
          name: "Usuário Teste",
          role: "admin",
        },
        env.JWT_SECRET,
        { expiresIn: "8h" }
      )

      // Criar a resposta JSON
      const res = NextResponse.json({
        message: "Login realizado com sucesso",
        user: { 
          id: 1,
          email: email,
          name: "Usuário Teste",
          role: "admin"
        },
      })

      // Adicionar o cookie JWT
      res.headers.set('Set-Cookie', `auth_token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 8}; SameSite=Lax`)

      return res
    }

    // Validate database connection first
    try {
      await db.query('SELECT 1');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ message: "Erro de conexão com o banco de dados", error: "Database connection failed" }, { status: 503 });
    }

    // Buscar usuário no banco de dados
    const result = await db.query("SELECT * FROM users WHERE email = ?", [email])

    // Verificar o resultado da consulta
    console.log("Resultado da consulta:", result)

    // Verificar se o usuário existe
    if (!result || result.length === 0) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    // Obter o usuário encontrado (primeiro elemento do array)
    // Corrigindo acesso ao array aninhado (resultado vem como array de arrays)
    const user = Array.isArray(result[0]) ? result[0][0] : result[0]
    
    // Log para verificar o usuário encontrado
    console.log("Usuário encontrado:", user)

    // Verificar a senha
    let passwordMatch = false;

    if (user && user.password) {
      // Verificar se a senha está criptografada com bcrypt
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
        // A senha está criptografada com bcrypt
        passwordMatch = await bcrypt.compare(password, user.password)
      } else {
        // A senha está em SHA-256, então precisamos comparar os hashes
        const crypto = require('crypto');
        const hashedPassword = crypto
          .createHash('sha256')
          .update(password)
          .digest('hex');
        passwordMatch = hashedPassword === user.password;
        console.log("Comparação de senha SHA-256:", {
          senhaFornecida: hashedPassword,
          senhaBanco: user.password,
          resultado: passwordMatch
        });
      }
    }

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
    // Configurar o atributo Secure corretamente como booleano e SameSite como string
    const isProduction = env.NODE_ENV === "production";
    res.headers.set('Set-Cookie', `auth_token=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 8}; SameSite=Lax${isProduction ? "; Secure" : ""}`)

    return res

  } catch (error) {
    // Tratamento de erro detalhado
    console.error("Erro ao fazer login:", error);
    
    // Converte o erro para o tipo Error para garantir acesso seguro às propriedades
    const err = error as any;
    
    if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
      return NextResponse.json({ message: "Erro de conexão com o banco de dados", error: "Database connection failed" }, { status: 503 });
    }
    
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Formato de requisição inválido", error: "Invalid request format" }, { status: 400 });
    }
    
    return NextResponse.json({ 
      message: "Erro interno do servidor", 
      error: process.env.NODE_ENV === 'development' ? (err.message || "Erro desconhecido") : "Internal server error" 
    }, { status: 500 })
  }
}
