import { Badge, Box, Card, Group, Stack, Text, Title } from '@mantine/core'

import { getCategories } from './action'

import { CategoriesTable } from '@/components/categories/categories-table'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Stack gap="xl" p="xl" className="mx-auto max-w-7xl">
        <Box>
          <Group justify="space-between" align="flex-start" mb="xs">
            <Box>
              <Title order={1} className="text-gray-900" mb="xs">
                Categorias
              </Title>
              <Text size="sm" c="dimmed">
                Gerencie as categorias de produtos do sistema
              </Text>
            </Box>
            <Badge size="lg" variant="light" color="blue" className="mt-1">
              {categories.length}{' '}
              {categories.length === 1 ? 'categoria' : 'categorias'}
            </Badge>
          </Group>
        </Box>

        <Card
          shadow="md"
          padding="xl"
          radius="lg"
          withBorder
          className="bg-white"
        >
          <CategoriesTable categories={categories} />
        </Card>
      </Stack>
    </Box>
  )
}
