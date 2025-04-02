import mysql from "mysql2/promise"
import { DbConnection, DbPool, QueryResult } from "./types"
import { env } from "./env"

// Validate required environment variables
if (!env.DB_HOST || !env.DB_USER || !env.DB_PASSWORD || !env.DB_NAME) {
  throw new Error('Missing required database environment variables');
}

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
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}) as DbPool

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connection established successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
    throw err;
  });

// Função para executar queries
export const db = {
  query: async <T = any>(sql: string, params?: any[]): Promise<T[]> => {  // Ajuste da tipagem para um array de resultados
    try {
      const [rows] = await pool.execute(sql, params)
      return rows as T[]  // Agora retorna um array do tipo T
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
