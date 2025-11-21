'use client'

import { Table, Text } from '@mantine/core'

import { ProductActionsMenu } from './product-actions-menu'

import type { Product } from '@/types'

interface ProductsTableProps {
  products: Product[]
  categoriesMap: Map<string, string>
}

function formatCurrency(value?: number): string {
  if (!value) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function ProductsTable({ products, categoriesMap }: ProductsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table
          highlightOnHover
          verticalSpacing="sm"
          horizontalSpacing="md"
          className="min-w-5xl"
        >
          <Table.Thead>
            <Table.Tr className="border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
              <Table.Th className="font-semibold text-gray-700">Nome</Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Categoria
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Unidade
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Preço Base
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Quantidade
              </Table.Th>
              <Table.Th
                ta="center"
                className="sticky right-0 w-20 bg-gray-100 from-gray-50 to-gray-100 font-semibold text-gray-700 drop-shadow-[-8px_0_16px_rgba(0,0,0,0.1)] lg:static lg:bg-transparent lg:drop-shadow-none"
              >
                Ações
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {products.map((product) => (
              <Table.Tr
                key={product.id}
                className="border-b border-gray-100 transition-colors duration-150 hover:bg-blue-50/50"
              >
                <Table.Td>
                  <Text fw={600} size="sm" className="text-gray-900">
                    {product.name}
                  </Text>
                  {product.description && (
                    <Text size="xs" c="dimmed">
                      {product.description}
                    </Text>
                  )}
                </Table.Td>
                <Table.Td className="text-center">
                  <Text size="sm" c="dimmed" ta="center">
                    {product.categoryId
                      ? categoriesMap.get(product.categoryId) || '-'
                      : '-'}
                  </Text>
                </Table.Td>
                <Table.Td className="text-center">
                  <Text size="sm" c="dimmed" ta="center">
                    {product.unit}
                  </Text>
                </Table.Td>
                <Table.Td className="text-center">
                  <Text
                    size="sm"
                    fw={500}
                    className="text-gray-900"
                    ta="center"
                  >
                    {formatCurrency(product.basePrice)}
                  </Text>
                </Table.Td>
                <Table.Td className="text-center">
                  <Text size="sm" c="dimmed" ta="center">
                    {product.availableQuantity}
                  </Text>
                </Table.Td>
                <Table.Td className="lg:static-none sticky right-0 bg-white text-center drop-shadow-[-8px_0_16px_rgba(0,0,0,0.1)] lg:static lg:bg-transparent lg:drop-shadow-none">
                  <ProductActionsMenu
                    product={product}
                    categoriesMap={categoriesMap}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  )
}
