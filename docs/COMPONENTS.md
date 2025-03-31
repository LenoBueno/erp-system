# Guia de Componentes

## Estrutura Básica

```tsx
// Exemplo de componente base
import { useState, useEffect } from 'react';

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
    <div className="p-4">
      {/* JSX */}
    </div>
  );
}
```

## Componentes UI

### Cards

```tsx
// Exemplo de card
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function CardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título do Card</CardTitle>
      </CardHeader>
      <CardContent>
        Conteúdo do card
      </CardContent>
    </Card>
  )
}
```

### Formulários

```tsx
// Exemplo de formulário
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function FormExample() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div>
            <Input
              placeholder="Nome"
              {...form.register("name")}
            />
          </div>
          <div>
            <Input
              placeholder="Email"
              type="email"
              {...form.register("email")}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
```

### Tabelas

```tsx
// Exemplo de tabela
import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table"

interface Data {
  id: string
  name: string
  email: string
}

export function TableExample() {
  const data: Data[] = [
    // Dados da tabela
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Nome</TableCell>
          <TableCell>Email</TableCell>
        </TableRow>
      </TableHeader>
      <tbody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  )
}
```

## Componentes de Layout

### MainLayout

```tsx
// Layout principal
import { MainLayout } from "@/components/layout/main-layout"

export function Page() {
  return (
    <MainLayout>
      <div className="p-4">
        {/* Conteúdo da página */}
      </div>
    </MainLayout>
  )
}
```

### Sidebar

```tsx
// Navegação lateral
import { Sidebar } from "@/components/layout/sidebar"

export function Page() {
  return (
    <Sidebar>
      {/* Conteúdo da página */}
    </Sidebar>
  )
}
```

## Componentes de UI

### Botões

```tsx
// Tipos de botões
import { Button } from "@/components/ui/button"

export function ButtonExample() {
  return (
    <div className="flex gap-2">
      <Button>Padrão</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secundário</Button>
      <Button variant="destructive">Destrutivo</Button>
    </div>
  )
}
```

### Inputs

```tsx
// Tipos de inputs
import { Input } from "@/components/ui/input"

export function InputExample() {
  return (
    <div className="flex flex-col gap-2">
      <Input placeholder="Texto" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Senha" />
    </div>
  )
}
```

## Componentes de Feedback

### Toasts

```tsx
// Notificações
import { useToast } from "@/hooks/use-toast"

export function ToastExample() {
  const { toast } = useToast()

  const showToast = () => {
    toast({
      title: "Sucesso",
      description: "Operação realizada com sucesso",
    })
  }

  return (
    <Button onClick={showToast}>Mostrar Toast</Button>
  )
}
```

### Loading

```tsx
// Estados de carregamento
import { Loader2 } from "lucide-react"

export function LoadingExample() {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Carregando...
    </div>
  )
}
```

## Componentes de Integração

### API

```tsx
// Integração com API
import { api } from "@/lib/api"

export async function fetchData() {
  try {
    const response = await api.get('/data')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    throw error
  }
}
```

### Auth

```tsx
// Autenticação
import { useAuth } from "@/hooks/use-auth"

export function ProtectedComponent() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <div>Por favor, faça login</div>
  }

  return (
    <div>Conteúdo protegido</div>
  )
}
```

## Componentes de Utilidade

### Formatação

```tsx
// Formatação de dados
import { formatCurrency, formatDate } from "@/utils/format"

export function FormatExample() {
  const value = 1234.56
  const date = new Date()

  return (
    <div>
      <p>Valor: {formatCurrency(value)}</p>
      <p>Data: {formatDate(date)}</p>
    </div>
  )
}
```

### Validação

```tsx
// Validação de dados
import { validateEmail, validateCPF } from "@/utils/validation"

export function ValidationExample() {
  const email = "teste@email.com"
  const cpf = "123.456.789-00"

  return (
    <div>
      <p>Email válido: {validateEmail(email).toString()}</p>
      <p>CPF válido: {validateCPF(cpf).toString()}</p>
    </div>
  )
}
```

## Melhores Práticas

1. **Reutilização**
   - Crie componentes genéricos
   - Use props para personalização
   - Implemente variantes

2. **Performance**
   - Use memoização
   - Implemente lazy loading
   - Otimização de renderização

3. **Acessibilidade**
   - Use ARIA labels
   - Implemente navegação por teclado
   - Suporte a leitores de tela

4. **Segurança**
   - Valide inputs
   - Use sanitização
   - Implemente rate limiting
