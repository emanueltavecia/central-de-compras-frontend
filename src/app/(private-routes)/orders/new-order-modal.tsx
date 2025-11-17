'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Modal, NumberInput, Select, Table } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useForm } from 'react-hook-form'

import { createOrder } from './action'

import type { Product } from '@/types'
import { UserRole } from '@/utils/enums'
import {
  createOrderSchema,
  type CreateOrderInput,
  type OrderItemInput,
} from '@/utils/schemas/orders'

interface NewOrderModalProps {
  products: Product[]
  userRole?: UserRole
}

export function NewOrderModal({ products, userRole }: NewOrderModalProps) {
  if (userRole !== UserRole.STORE) {
    return null
  }
  const [opened, setOpened] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [items, setItems] = useState<OrderItemInput[]>([])
  const [currentItem, setCurrentItem] = useState<{
    productId: string
    quantity: number
  }>({
    productId: '',
    quantity: 1,
  })

  const { handleSubmit, reset } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
  })

  const addItem = () => {
    if (!currentItem.productId || currentItem.quantity <= 0) {
      notifications.show({
        title: 'Erro',
        message: 'Selecione um produto e quantidade válida',
        color: 'red',
      })
      return
    }

    setItems([...items, currentItem])
    setCurrentItem({ productId: '', quantity: 1 })
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: CreateOrderInput) => {
    if (items.length === 0) {
      notifications.show({
        title: 'Erro',
        message: 'Adicione pelo menos um item ao pedido',
        color: 'red',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createOrder({
        ...data,
        items,
      })

      if (result.success) {
        notifications.show({
          title: 'Sucesso',
          message: 'Pedido criado com sucesso!',
          color: 'green',
        })
        setOpened(false)
        reset()
        setItems([])
      } else {
        notifications.show({
          title: 'Erro',
          message: result.error || 'Erro ao criar pedido',
          color: 'red',
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro inesperado ao criar pedido',
        color: 'red',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product?.name || productId
  }

  return (
    <>
      <Button onClick={() => setOpened(true)}>Novo Pedido</Button>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false)
          reset()
          setItems([])
        }}
        title="Novo Pedido"
        size="xl"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Itens do Pedido</label>

            <div className="flex gap-2">
              <Select
                placeholder="Selecione um produto"
                data={products.map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
                value={currentItem.productId}
                onChange={(value) =>
                  setCurrentItem({ ...currentItem, productId: value || '' })
                }
                className="flex-1"
              />

              <NumberInput
                placeholder="Qtd"
                min={1}
                value={currentItem.quantity}
                onChange={(value) =>
                  setCurrentItem({
                    ...currentItem,
                    quantity: Number(value) || 1,
                  })
                }
                className="w-24"
              />

              <Button onClick={addItem} variant="light">
                Adicionar
              </Button>
            </div>

            {items.length > 0 && (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Produto</Table.Th>
                    <Table.Th>Quantidade</Table.Th>
                    <Table.Th>Ações</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {items.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{getProductName(item.productId)}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          onClick={() => removeItem(index)}
                        >
                          Remover
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="light"
              onClick={() => {
                setOpened(false)
                reset()
                setItems([])
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Criar Pedido
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
