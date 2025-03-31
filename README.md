# ERP System

## Configuração do Ambiente

### Pré-requisitos

1. **MySQL Server**
   - Faça o download e instale o MySQL Server da [página oficial](https://dev.mysql.com/downloads/mysql/)
   - Durante a instalação, defina a senha do root como '148750'
   - Crie um usuário 'leno' com a senha '148750'

2. **Node.js**
   - Certifique-se de que o Node.js está instalado

### Configuração do Banco de Dados

1. Após instalar o MySQL, execute os seguintes comandos:

```sql
-- Conecte ao MySQL como root
mysql -u root -p

-- Crie o usuário
CREATE USER 'leno'@'localhost' IDENTIFIED BY '148750';

-- Conceda privilégios
GRANT ALL PRIVILEGES ON erp_system.* TO 'leno'@'localhost';
FLUSH PRIVILEGES;

-- Crie o banco de dados
CREATE DATABASE erp_system;
```

2. Importe o schema do banco de dados:
```bash
mysql -u leno -p148750 erp_system < database/schema.sql
```

### Configuração do Projeto

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Solução de Problemas

Se você encontrar o erro 503 (Service Unavailable):

1. Verifique se o MySQL Server está em execução
2. Confirme se as credenciais no arquivo `lib/env.ts` estão corretas
3. Certifique-se de que o banco de dados `erp_system` foi criado
4. Verifique se todas as tabelas foram criadas corretamente

Se o problema persistir, verifique os logs do servidor para mais detalhes.