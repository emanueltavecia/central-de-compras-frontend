'use client'

import { useState } from 'react'

import { ActionIcon, Menu } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { MoreVertical } from 'lucide-react'

import { EditProductModal } from './edit-product-modal'

import { toggleProductStatus } from '@/app/(private-routes)/products/action'
import type { Product } from '@/types'

interface ProductActionsMenuProps {
  product: Product
  categoriesMap: Map<string, string>
}

export function ProductActionsMenu({
  product,
  categoriesMap,
}: ProductActionsMenuProps) {
  const [modalOpened, setModalOpened] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleToggleStatus = async () => {
    setLoading(true)
    try {
      const result = await toggleProductStatus(product.id, !product.active)

      if (result.success) {
        notifications.show({
          title: 'Sucesso',
          message: result.message,
          color: 'green',
        })
      } else {
        notifications.show({
          title: 'Erro',
          message: result.message,
          color: 'red',
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao atualizar status',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray" disabled={loading}>
            <MoreVertical size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={() => setModalOpened(true)}>Editar</Menu.Item>

          {product.active ? (
            <Menu.Item
              onClick={handleToggleStatus}
              color="orange"
              disabled={loading}
            >
              Desativar
            </Menu.Item>
          ) : (
            <Menu.Item
              onClick={handleToggleStatus}
              color="green"
              disabled={loading}
            >
              Ativar
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>

      <EditProductModal
        product={product}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        categoriesMap={categoriesMap}
      />
    </>
  )
}
