'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useForm } from 'react-hook-form'

import { createCategory, updateCategory } from './action'

import type { Category } from '@/types'
import { categorySchema, type CategoryFormData } from '@/utils/schemas/category'

interface CategoryModalProps {
  opened: boolean
  onClose: () => void
  category?: Category
  categories: Category[]
}

export function CategoryModal({
  opened,
  onClose,
  category,
  categories,
}: CategoryModalProps) {
  const isEditing = !!category

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      parentId: category?.parentId || '',
    },
  })

  const parentId = watch('parentId')

  useEffect(() => {
    if (opened) {
      reset({
        name: category?.name || '',
        description: category?.description || '',
        parentId: category?.parentId || '',
      })
    }
  }, [opened, category, reset])

  const onSubmit = async (data: CategoryFormData) => {
    const cleanData = {
      ...data,
      parentId: data.parentId || undefined,
      description: data.description || undefined,
    }

    const result = isEditing
      ? await updateCategory(category.id, cleanData)
      : await createCategory(cleanData)

    if (result.isSuccess) {
      notifications.show({
        title: 'Sucesso!',
        message: `Categoria ${isEditing ? 'atualizada' : 'criada'} com sucesso`,
        color: 'green',
      })
      onClose()
      reset()
    } else {
      notifications.show({
        title: 'Erro',
        message: result.error || 'Ocorreu um erro ao salvar a categoria',
        color: 'red',
      })
    }
  }

  const parentOptions = categories
    .filter((cat) => cat.id !== category?.id)
    .map((cat) => ({
      value: cat.id,
      label: cat.name,
    }))

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg">
          {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
        </Text>
      }
      size="lg"
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap="lg">
          <TextInput
            label="Nome"
            placeholder="Digite o nome da categoria"
            withAsterisk
            error={errors.name?.message}
            {...register('name')}
          />

          <Textarea
            label="Descrição"
            placeholder="Digite a descrição da categoria (opcional)"
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />

          <Select
            label="Categoria Pai"
            placeholder="Selecione a categoria pai (opcional)"
            data={parentOptions}
            value={parentId || null}
            onChange={(value) => setValue('parentId', value || '')}
            searchable
            clearable
            error={errors.parentId?.message}
          />

          <Group justify="flex-end" gap="sm" mt="md">
            <Button
              variant="default"
              onClick={onClose}
              disabled={isSubmitting}
              size="md"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              size="md"
              className="bg-primary hover:bg-primary-dark transition-colors"
            >
              {isEditing ? 'Atualizar Categoria' : 'Criar Categoria'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
