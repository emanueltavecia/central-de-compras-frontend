import { Card, Stack, Text, Title } from '@mantine/core'

import { getCategories, getProductsBySupplier } from './action'
import { ProductsPageClient } from './products-page-client'

import { ProductsTable } from '@/components/products/products-table'
import { getSession } from '@/lib/auth'

export default async function ProductsPage() {
  const { user } = await getSession()
  const [products, categories] = await Promise.all([
    getProductsBySupplier(user?.organizationId as string),
    getCategories(),
  ])

  const categoriesMap = new Map(categories.map((cat) => [cat.id, cat.name]))

  const activeProducts = products.filter((product) => product.active)
  const inactiveProducts = products.filter((product) => !product.active)

  return (
    <Stack gap="xl" p="xl">
      <div className="flex items-center justify-between">
        <Title order={2}>Produtos</Title>
        <ProductsPageClient />
      </div>

      <div className="space-y-8">
        <div>
          <Title order={3} mb="md">
            Produtos Ativos
          </Title>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {activeProducts.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                Nenhum produto ativo encontrado
              </Text>
            ) : (
              <ProductsTable
                products={activeProducts}
                categoriesMap={categoriesMap}
              />
            )}
          </Card>
        </div>

        <div>
          <Title order={3} mb="md" className="text-gray-600">
            Produtos Inativos
          </Title>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {inactiveProducts.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                Nenhum produto inativo encontrado
              </Text>
            ) : (
              <ProductsTable
                products={inactiveProducts}
                categoriesMap={categoriesMap}
              />
            )}
          </Card>
        </div>
      </div>
    </Stack>
  )
}
