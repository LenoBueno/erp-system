// Exporta as variáveis de ambiente para uso em outros arquivos
export const env = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  DB_USER: process.env.DB_USER || 'leno',
  DB_PASSWORD: process.env.DB_PASSWORD || '148750',
  DB_NAME: process.env.DB_NAME || 'erp_system',
  JWT_SECRET: process.env.JWT_SECRET || 'Ftec@148750W559rt',
  NODE_ENV: process.env.NODE_ENV || 'development'
};