'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Modal,
  NumberInput,
  Select,
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

interface EditProductModalProps {
  product: Product
  opened: boolean
  onClose: () => void
  categoriesMap: Map<string, string>
}

export function EditProductModal({
  product,
  opened,
  onClose,
  categoriesMap,
}: EditProductModalProps) {
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

        <Select
          label="Categoria"
          placeholder="Selecione uma categoria"
          data={Array.from(categoriesMap.entries()).map(([id, name]) => ({
            value: id,
            label: name,
          }))}
          value={product.categoryId || null}
          onChange={(value) => setValue('categoryId', value || undefined)}
          error={errors.categoryId?.message}
          searchable
          clearable
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
