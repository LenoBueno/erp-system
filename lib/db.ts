import mysql from "mysql2/promise"
import { DbConnection, DbPool, QueryResult } from "./types"
import { env } from "./env"

// Configuração do pool de conexões
const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}) as DbPool

// Função para executar queries
export const db = {
  query: async <T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> => {
    try {
      const [rows] = await pool.execute(sql, params)
      return rows as QueryResult<T>
    } catch (error) {
      console.error("Erro na execução da query:", error)
      throw error
    }
  },

  // Função para transações
  transaction: async <T>(callback: (connection: DbConnection) => Promise<T>): Promise<T> => {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      const result = await callback(connection)
      await connection.commit()
      return result
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  },
}

