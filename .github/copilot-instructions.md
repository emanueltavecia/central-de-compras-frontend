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

```tsx
// ✅ Componente servidor (preferido)
export default function ProductList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* conteúdo */}
    </div>
  )
}

// ❌ Evitar uso desnecessário de 'use client'
'use client'
export default function StaticComponent() {
  return <div>Conteúdo estático</div>
}
```

## Bibliotecas de Componentes

### Mantine
- **Use** para componentes de UI como:
  - Botões, Inputs, Modals
  - Tabelas, Cards, Badges
  - Notifications, DatePickers
  - Dropdowns, Selects

### Implementação Manual
- **Header**: navegação principal customizada
- **Sidebar**: menu lateral customizado
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

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextInput, Button } from '@mantine/core'

const userSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
})

type UserForm = z.infer<typeof userSchema>

export default function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit = (data: UserForm) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextInput
        label="Nome"
        error={errors.name?.message}
        {...register('name')}
      />
      <TextInput
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Button type="submit" className="bg-primary hover:bg-primary-dark">
        Salvar
      </Button>
    </form>
  )
}
```

## Estrutura de Pastas

```
src/
├── app/                    # App Router
│   ├── (auth)/            # Grupo de rotas
│   ├── dashboard/         # Páginas
│   ├── globals.css        # Estilos globais + variáveis
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (com Mantine)
│   ├── forms/            # Componentes de formulário
│   ├── layout/           # Header, Sidebar customizados
│   └── features/         # Componentes específicos de funcionalidade
├── lib/                  # Utilitários e configurações
│   ├── validations/      # Schemas Zod
│   └── utils.ts          # Funções utilitárias
└── types/                # Tipos TypeScript
```

## Boas Práticas App Router

### Server Actions
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