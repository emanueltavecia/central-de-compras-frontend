'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Badge,
  Button,
  Modal,
  NumberInput,
  Table,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useForm } from 'react-hook-form'

import { updateProduct } from '@/app/(private-routes)/products/action'
import type { Product } from '@/types'
import {
  updateProductSchema,
  type UpdateProductInput,
} from '@/utils/schemas/products'

interface ProductsTableProps {
  products: Product[]
}

interface EditProductModalProps {
  product: Product
  opened: boolean
  onClose: () => void
}

function EditProductModal({ product, opened, onClose }: EditProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description || '',
      unit: product.unit || '',
      basePrice: product.basePrice,
      availableQuantity: product.availableQuantity || 0,
      active: product.active ?? true,
    },
  })

  const onSubmit = async (data: UpdateProductInput) => {
    setIsSubmitting(true)

    try {
      const result = await updateProduct(product.id, data)

      if (result.success) {
        notifications.show({
          title: 'Sucesso',
          message: 'Produto atualizado com sucesso!',
          color: 'green',
        })
        onClose()
      } else {
        notifications.show({
          title: 'Erro',
          message: result.error || 'Erro ao atualizar produto',
          color: 'red',
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro inesperado ao atualizar produto',
        color: 'red',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={() => {
        onClose()
        reset()
      }}
      title="Editar Produto"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          label="Nome"
          placeholder="Digite o nome do produto"
          {...register('name')}
          error={errors.name?.message}
          required
        />

        <Textarea
          label="Descrição"
          placeholder="Digite a descrição do produto"
          {...register('description')}
          error={errors.description?.message}
          rows={3}
        />

        <TextInput
          label="Categoria"
          placeholder="Digite a categoria do produto"
          {...register('categoryId')}
          error={errors.categoryId?.message}
        />

        <TextInput
          label="Unidade"
          placeholder="Ex: un, kg, L"
          {...register('unit')}
          error={errors.unit?.message}
          required
        />

        <NumberInput
          label="Preço Base"
          placeholder="0.00"
          decimalScale={2}
          fixedDecimalScale
          prefix="R$ "
          min={0}
          defaultValue={product.basePrice}
          onChange={(value) => setValue('basePrice', Number(value) || 0)}
          error={errors.basePrice?.message}
          required
        />

        <NumberInput
          label="Quantidade Disponível"
          placeholder="0"
          min={0}
          defaultValue={product.availableQuantity || 0}
          onChange={(value) =>
            setValue('availableQuantity', Number(value) || 0)
          }
          error={errors.availableQuantity?.message}
          required
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="light"
            onClick={() => {
              onClose()
              reset()
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  function formatCurrency(value?: number): string {
    if (!value) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <thead>
          <tr>
            <th className="pl-8">Nome</th>
            <th className="pl-8">Categoria</th>
            <th className="pl-8">Unidade</th>
            <th className="pl-8">Preço Base</th>
            <th className="pl-8">Quantidade</th>
            <th className="pl-8">Status</th>
            <th className="pl-8">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="pl-8">
                <Text fw={500}>{product.name}</Text>
                {product.description && (
                  <Text size="xs" c="dimmed">
                    {product.description}
                  </Text>
                )}
              </td>
              <td className="pl-8">{product.categoryId || '-'}</td>
              <td className="pl-8">{product.unit}</td>
              <td className="pl-8">{formatCurrency(product.basePrice)}</td>
              <td className="pl-8">{product.availableQuantity}</td>
              <td className="pl-8">
                <Badge
                  variant="light"
                  color={product.active ? 'green' : 'gray'}
                >
                  {product.active ? 'ATIVO' : 'INATIVO'}
                </Badge>
              </td>
              <td className="pl-8">
                <Button
                  variant="light"
                  color="blue"
                  size="xs"
                  onClick={() => setEditingProduct(product)}
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          opened={!!editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </>
  )
}
