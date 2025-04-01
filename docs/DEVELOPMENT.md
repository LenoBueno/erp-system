# Guia de Desenvolvimento

## Estrutura de Diretórios

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

## Convenções de Código

### Nomenclatura

- Componentes: PascalCase
- Arquivos: kebab-case
- Variáveis: camelCase
- Constantes: UPPER_SNAKE_CASE

### Estrutura de Componentes

```tsx
// Exemplo de componente
import { useState } from 'react';

interface Props {
  // Propriedades do componente
}

export function ComponentName(props: Props) {
  // Estado
  const [state, setState] = useState(initialState);

  // Efeitos
  useEffect(() => {
    // Lógica de efeito
  }, [dependencies]);

  // Funções
  const handleAction = () => {
    // Lógica da função
  };

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### TypeScript

- Sempre use tipos explícitos
- Evite `any` e `unknown`
- Use interfaces para tipos complexos
- Use enums para valores constantes

## Testes

### Testes Unitários

```typescript
// Exemplo de teste unitário
describe('ComponentName', () => {
  it('deve renderizar corretamente', () => {
    // Arrange
    const props = {
      // Propriedades do componente
    };

    // Act
    const { getByText } = render(<ComponentName {...props} />);

    // Assert
    expect(getByText('Texto esperado')).toBeInTheDocument();
  });
});
```

### Testes e2e

```typescript
// Exemplo de teste e2e
test('deve permitir cadastrar um novo cliente', async ({ page }) => {
  // Arrange
  await page.goto('/clientes');

  // Act
  await page.getByRole('button', { name: 'Novo Cliente' }).click();
  await page.getByLabel('Nome').fill('Cliente Teste');
  await page.getByRole('button', { name: 'Salvar' }).click();

  // Assert
  await expect(page.getByText('Cliente Teste')).toBeVisible();
});
```

## Estilos

### Tailwind CSS

- Use classes utilitárias para estilos básicos
- Crie componentes reutilizáveis para estilos complexos
- Evite classes inline

### Componentes UI

- Use Shadcn UI para componentes base
- Customização através de variantes
- Mantenha consistência visual

## Performance

### Otimizações

- Implemente lazy loading para componentes
- Use memoização para funções puras
- Implemente cache para dados estáticos
- Otimização de imagens

### Melhores Práticas

- Use React.memo para componentes puros
- Implemente virtualização para listas grandes
- Use Intersection Observer para carregamento lazy
- Implemente cache HTTP

## Segurança

### Melhores Práticas

- Valide todos os inputs
- Use autenticação JWT
- Implemente rate limiting
- Use HTTPS
- Valide tokens de acesso

## Deploy

### Procedimento

1. Atualize o changelog
2. Crie uma tag de versão
3. Push para o repositório
4. Execute o pipeline de CI/CD

### Checklist

- [ ] Atualizar documentação
- [ ] Verificar testes
- [ ] Validar segurança
- [ ] Otimizar performance
- [ ] Testar em ambiente de staging

## Contribuição

### Guidelines

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

### Checklist para PR

- [ ] Código documentado
- [ ] Testes implementados
- [ ] Documentação atualizada
- [ ] Performance otimizada
- [ ] Segurança verificada
