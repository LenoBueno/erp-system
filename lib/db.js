// lib/db.js
import mysql from 'mysql2/promise';

// Crie a conexão com o banco de dados
export const db = mysql.createPool({
  host: 'localhost', // Seu host de banco de dados (pode ser localhost ou outro endereço)
  user: 'leno', // Seu usuário do banco
  password: '148750', // Sua senha do banco
  database: 'erp_system', // O nome do banco de dados
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
