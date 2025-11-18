import { Card, Stack, Title } from '@mantine/core'

import { getCategories } from './action'

import { CategoriesTable } from '@/components/categories/categories-table'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <Stack gap="lg" p="xl">
      <Title order={2}>Categorias</Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <CategoriesTable categories={categories} />
      </Card>
    </Stack>
  )
}
