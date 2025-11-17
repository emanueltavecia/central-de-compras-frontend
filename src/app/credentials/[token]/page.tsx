import { Text, Stack, Paper, Title } from '@mantine/core'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

async function getData(token: string) {
  const res = await fetch(`${API_URL}/users/credentials/${token}`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    let message = 'Link inválido ou expirado'
    try {
      const err = await res.json()
      message = err?.message || message
    } catch {}
    return { error: message }
  }
  const json = await res.json()
  return { data: json?.data }
}

export default async function Page({ params }: { params: { token: string } }) {
  const { token } = params
  const result = await getData(token)

  if ('error' in result) {
    return (
      <Stack align="center" justify="center" style={{ minHeight: '60vh' }}>
        <Title order={3}>Compartilhamento de credenciais</Title>
        <Text c="red">{result.error}</Text>
      </Stack>
    )
  }

  const { fullName, email, password } = result.data || {}

  return (
    <Stack align="center" justify="center" style={{ minHeight: '60vh' }}>
      <Title order={3}>Compartilhamento de credenciais</Title>
      <Paper withBorder p="lg" radius="md" style={{ minWidth: 320 }}>
        <Stack gap="sm">
          <div>
            <Text size="sm" c="dimmed">
              Nome
            </Text>
            <Text fw={600}>{fullName}</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Email
            </Text>
            <Text fw={600}>{email}</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Senha
            </Text>
            <Text fw={600}>{password}</Text>
          </div>
        </Stack>
      </Paper>
    </Stack>
  )
}
