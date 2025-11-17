'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Modal,
  NumberInput,
  Select,
  Table,
  TextInput,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useForm } from 'react-hook-form'

import { createOrder } from './action'

import type { Product } from '@/types'
import {
  createOrderSchema,
  type CreateOrderInput,
  type OrderItemInput,
} from '@/utils/schemas/orders'

interface NewOrderModalProps {
  products: Product[]
}

export function NewOrderModal({ products }: NewOrderModalProps) {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateOrderInput>({
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
          <TextInput
            label="ID da Loja"
            placeholder="Digite o ID da loja"
            {...register('storeOrgId')}
            error={errors.storeOrgId?.message}
            required
          />

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
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{getProductName(item.productId)}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          onClick={() => removeItem(index)}
                        >
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>

          <NumberInput
            label="Custo de Envio (Opcional)"
            placeholder="0.00"
            decimalScale={2}
            fixedDecimalScale
            prefix="R$ "
            min={0}
            onChange={(value) => setValue('shippingCost', Number(value) || 0)}
            error={errors.shippingCost?.message}
          />

          <TextInput
            label="ID do Endereço de Envio (Opcional)"
            placeholder="Digite o ID do endereço"
            {...register('shippingAddressId')}
            error={errors.shippingAddressId?.message}
          />

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
