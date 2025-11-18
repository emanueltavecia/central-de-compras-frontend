'use client'

import { useEffect, useState } from 'react'

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
import { useForm, Controller } from 'react-hook-form'

import { createProduct, getCategories } from './action'

import type { Category } from '@/types'
import {
  createProductFormSchema,
  type CreateProductFormInput,
} from '@/utils/schemas/products'

export function ProductsPageClient() {
  const [opened, setOpened] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<CreateProductFormInput>({
    resolver: zodResolver(createProductFormSchema),
  })

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        notifications.show({
          title: 'Erro',
          message: 'Erro ao carregar categorias',
          color: 'red',
        })
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const onSubmit = async (data: CreateProductFormInput) => {
    setIsSubmitting(true)

    try {
      const result = await createProduct(data)

      if (result.success) {
        notifications.show({
          title: 'Sucesso',
          message: 'Produto criado com sucesso!',
          color: 'green',
        })
        setOpened(false)
        reset()
      } else {
        notifications.show({
          title: 'Erro',
          message: result.error || 'Erro ao criar produto',
          color: 'red',
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro inesperado ao criar produto',
        color: 'red',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpened(true)}>Novo Produto</Button>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false)
          reset()
        }}
        title="Novo Produto"
        size="lg"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
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

          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Categoria"
                placeholder="Selecione uma categoria"
                data={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
                error={errors.categoryId?.message}
                searchable
                clearable
                disabled={loadingCategories}
              />
            )}
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
            onChange={(value) => setValue('basePrice', Number(value) || 0)}
            error={errors.basePrice?.message}
            required
          />

          <NumberInput
            label="Quantidade Disponível"
            placeholder="0"
            min={0}
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
                setOpened(false)
                reset()
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Criar Produto
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
