// Tipos para o banco de dados e resultados de consultas

// Interface para usuário retornado do banco de dados
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  [key: string]: any; // Para campos adicionais que possam existir
}

// Interface para resultados de consultas SQL
export interface QueryResult<T = any> {
  [index: number]: T;
  length: number;
}

// Interface para conexão de banco de dados
export interface DbConnection {
  execute: (sql: string, params?: any[]) => Promise<[any[], any]>;
  beginTransaction: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  release: () => void;
}

// Interface para o pool de conexões
export interface DbPool {
  execute: (sql: string, params?: any[]) => Promise<[any[], any]>;
  getConnection: () => Promise<DbConnection>;
}