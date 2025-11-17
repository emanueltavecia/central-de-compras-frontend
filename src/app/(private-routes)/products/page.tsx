import { Card, Group, Stack, Text, Title } from '@mantine/core'

import { getCategories, getProducts } from './action'
import { ProductsPageClient } from './products-page-client'

import { ProductsTable } from '@/components/products/products-table'

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  const categoriesMap = new Map(categories.map((cat) => [cat.id, cat.name]))

  return (
    <Stack gap="lg" p="xl" suppressHydrationWarning>
      <Group justify="space-between" align="center">
        <Title order={2}>Produtos</Title>
        <ProductsPageClient />
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {products.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Nenhum produto encontrado
          </Text>
        ) : (
          <ProductsTable products={products} categoriesMap={categoriesMap} />
        )}
      </Card>
    </Stack>
  )
}
