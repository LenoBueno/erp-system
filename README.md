<<<<<<< HEAD
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
=======
# Sistema ERP

Sistema de gestão empresarial completo desenvolvido com Next.js, TypeScript e React.

## Funcionalidades

- Gestão de Clientes
- Gestão de Vendas
- Gestão de Compras
- Gestão de Estoque
- Gestão Financeira
- Notas Fiscais
- Dashboard Administrativo

## Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI, Shadcn UI
- **Testes**: Jest, Playwright
- **API**: MSW
- **Banco de Dados**: PostgreSQL

## Estrutura do Projeto

```
src/
├── features/       # Funcionalidades do sistema
│   ├── admin/      # Dashboard administrativo
│   ├── clientes/   # Gestão de clientes
│   ├── nfe/        # Notas fiscais
│   ├── dashboard/  # Painel principal
│   ├── financeiro/ # Gestão financeira
│   ├── estoque/    # Gestão de estoque
│   └── vendas/     # Gestão de vendas
├── services/       # Serviços compartilhados
├── utils/          # Utilitários
├── hooks/          # Hooks personalizados
├── types/          # Tipos compartilhados
├── constants/      # Constantes globais
├── config/         # Configurações
└── lib/           # Bibliotecas compartilhadas
```

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/erp-system.git
cd erp-system
```

2. Instale as dependências:
```bash
pnpm install
```

3. Copie o arquivo de configuração:
```bash
cp .env.example .env
```

4. Configure as variáveis de ambiente no arquivo `.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/erp
```

5. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

## Desenvolvimento

### Testes

- Testes unitários:
```bash
pnpm test:unit
```

- Testes de integração:
```bash
pnpm test:integration
```

- Testes e2e:
```bash
pnpm test:e2e
```

### Documentação

- Documentação da API: `http://localhost:3000/api/docs`
- Documentação dos componentes: `http://localhost:3000/docs`
- Storybook: `http://localhost:6006`

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

MIT
>>>>>>> 54694604715e23933498cfb7052d0e3deaaa7309
