# Instruções de Desenvolvimento - Central de Compras Frontend

## Tecnologias e Arquitetura

Este é um projeto **Next.js 15** utilizando **App Router**. O nome do sistema é "Central de Compras". Siga as diretrizes abaixo para manter a consistência e qualidade do código.

## Estrutura de Componentes

### Componentes do Servidor (Padrão)
- **SEMPRE** prefira componentes que rodem no servidor
- **EVITE** usar `'use client'` a menos que seja absolutamente necessário
- Use `'use client'` apenas quando precisar de:
  - Interatividade com eventos (onClick, onSubmit, etc.)
  - Hooks do React (useState, useEffect, etc.)
  - APIs do navegador (localStorage, sessionStorage, etc.)

### Estrutura de Layout
- **Header, Sidebar e Containers de página**: implementar manualmente usando Tailwind
- **Componentes de UI**: usar biblioteca Mantine preferencialmente
- **Layouts**: aproveitar o sistema de layouts do App Router

## Bibliotecas de Componentes

### Mantine
- **Use** para componentes de UI como:
  - Botões, Inputs, Modals
  - Tabelas, Cards, Badges
  - Notifications, DatePickers
  - Dropdowns, Selects

### Implementação Manual
- **Header**: navegação principal customizada, se houver
- **Sidebar**: menu lateral customizado, se houver
- **Page Containers**: wrappers de página customizados
- **Layouts específicos**: estruturas de página únicas

```tsx
// ✅ Usando Mantine para componentes de UI
import { Button, Modal, TextInput } from '@mantine/core'

export default function UserForm() {
  return (
    <form>
      <TextInput label="Nome" />
      <Button type="submit">Salvar</Button>
    </form>
  )
}

// ✅ Header customizado com Tailwind
export default function Header() {
  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* navegação customizada */}
      </div>
    </header>
  )
}
```

## Estilização

### Tailwind CSS
- **CSS Framework principal** para toda estilização
- Use classes utilitárias para spacing, layout, responsividade
- Combine com variáveis CSS customizadas para cores

### Variáveis de Cores
Defina todas as cores no arquivo `src/app/globals.css`:

```css
:root {
  /* Cores primárias */
  --primary: #1976d2;
  --primary-light: #42a5f5;
  --primary-dark: #1565c0;
  
  /* Cores secundárias */
  --secondary: #dc004e;
  --secondary-light: #ff5983;
  --secondary-dark: #9a0036;
  
  /* Cores neutras */
  --background: #ffffff;
  --surface: #f5f5f5;
  --text-primary: #212121;
  --text-secondary: #757575;
  
  /* Estados */
  --success: #4caf50;
  --warning: #ff9800;
  --error: #f44336;
  --info: #2196f3;
}
```

## Formulários

### React Hook Form + Zod
- **SEMPRE** use `react-hook-form` para gerenciamento de formulários
- **SEMPRE** use `zod` para validação e tipagem
- Combine com componentes Mantine para UI

### Mensagens de Validação
- **TODAS** as mensagens de erro de validação devem estar centralizadas em `src/lib/validations/messages.ts`
- **NÃO** escreva mensagens de erro diretamente nos schemas Zod
- Importe as mensagens do arquivo centralizado para manter consistência

## Exportações de Componentes

### Regras de Exportação
- **Export Default**: use APENAS para componentes que são páginas/rotas do Next.js (`page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, etc.)
- **Named Export**: use para TODOS os outros componentes reutilizáveis
- Isso facilita refatoração, autocomplete e importações consistentes

## Boas Práticas App Router

### Server Actions

- Utilizar server actions sempre que possível

```tsx
// actions/user.ts
'use server'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

export async function createUser(formData: FormData) {
  const validatedFields = createUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return { error: 'Dados inválidos' }
  }

  // Lógica de criação do usuário
}
```

### Cache e Revalidação de Dados

O Next.js 15 introduziu o `'use cache'` e sistema de tags para gerenciamento de cache. Siga estas diretrizes:

#### Tags de Cache
- **TODAS** as tags de cache devem estar centralizadas em `src/lib/constants/cache-tags.ts`
- **NÃO** escreva strings de tags diretamente no código
- Use constantes para evitar erros de digitação e facilitar manutenção

#### Implementação de Cache em Funções

```tsx
// app/dashboard/page.tsx
import { cacheTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/constants/cache-tags'

async function getData() {
  'use cache'
  cacheTag(CACHE_TAGS.DASHBOARD.DATA)
  
  // Buscar dados do servidor
  const response = await fetch('https://api.example.com/data')
  return response.json()
}

export default async function DashboardPage() {
  const data = await getData()
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Data: {data}</p>
    </div>
  )
}
```

#### Revalidação de Cache

- **SEMPRE** use `{expire: 0}` no `revalidateTag` para forçar revalidação imediata
- Implemente revalidação em Server Actions quando dados forem modificados

```tsx
// components/dashboard/action.ts
'use server'

import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/constants/cache-tags'

export async function dashboardAction() {
  // Executar lógica de negócio
  await fetch()
  
  // Revalidar cache com expire: 0
  revalidateTag(CACHE_TAGS.DASHBOARD.DATA, { expire: 0 })
}
```

#### Componente com Revalidação Manual

```tsx
// components/dashboard/button.tsx
'use client'

import { Button } from '@mantine/core'
import { dashboardAction } from './action'

export function DashboardButton() {
  return (
    <Button onClick={dashboardAction}>
      Atualizar Dados
    </Button>
  )
}
```

#### Boas Práticas de Cache

1. **Sempre use cache tags**: facilita revalidação granular
2. **Centralize as tags**: use o arquivo `cache-tags.ts`
3. **Revalide após mutações**: sempre que criar, atualizar ou deletar dados
4. **Use `{expire: 0}`**: garante revalidação imediata
5. **Nomeie tags descritivamente**: use padrão `modulo-acao` (ex: `users-list`, `product-detail`)

### Loading e Error States
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-surface rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-surface rounded w-1/2"></div>
    </div>
  )
}

// app/dashboard/error.tsx
'use client'
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="text-center py-8">
      <h2 className="text-error text-xl mb-4">Algo deu errado!</h2>
      <button
        onClick={reset}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
      >
        Tentar novamente
      </button>
    </div>
  )
}
```

## Responsividade

- Use classes responsivas do Tailwind: `sm:`, `md:`, `lg:`, `xl:`
- Implemente mobile-first approach
- Teste em diferentes tamanhos de tela

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
  {/* Conteúdo responsivo */}
</div>
```

## Performance

- Aproveite componentes servidor quando possível
- Use `loading.tsx` para estados de carregamento
- Implemente Suspense boundaries quando necessário
- Otimize imagens com `next/image`

```tsx
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  className="rounded-lg"
/>
```