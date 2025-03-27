import mysql from "mysql2/promise"

// Configuração do pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "simple_ink_umbanda",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Função para executar queries
export const db = {
  query: async (sql, params) => {
    try {
      const [rows] = await pool.execute(sql, params)
      return rows
    } catch (error) {
      console.error("Erro na execução da query:", error)
      throw error
    }
  },

  // Função para transações
  transaction: async (callback) => {
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

