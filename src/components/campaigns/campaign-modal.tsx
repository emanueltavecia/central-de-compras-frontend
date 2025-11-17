'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { Controller, useForm } from 'react-hook-form'

import { getCategories, getProducts } from './actions'

import {
  createCampaign,
  updateCampaign,
} from '@/app/(private-routes)/campaigns/action'
import type { Campaign, Category, Product } from '@/types'
import { CampaignScope, CampaignType } from '@/utils/enums'
import {
  campaignSchema,
  type CampaignFormInput,
} from '@/utils/schemas/campaign'

interface CampaignModalProps {
  opened: boolean
  onClose: () => void
  campaign?: Campaign
}

export function CampaignModal({
  opened,
  onClose,
  campaign,
}: CampaignModalProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)

  const isEditing = !!campaign

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<CampaignFormInput>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      type: CampaignType.CASHBACK,
      scope: undefined,
      minTotal: null,
      minQuantity: null,
      cashbackPercent: null,
      giftProductId: null,
      categoryId: null,
      productIds: null,
      startAt: null,
      endAt: null,
    },
  })

  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true)
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ])
        setCategories(categoriesData)
        setProducts(productsData)
      } catch (error) {
        console.error('Erro ao carregar opções:', error)
      } finally {
        setLoadingOptions(false)
      }
    }

    if (opened) {
      loadOptions()
    }
  }, [opened])

  useEffect(() => {
    if (campaign) {
      reset({
        name: campaign.name,
        type: campaign.type,
        scope: campaign.scope,
        minTotal: campaign.minTotal ?? null,
        minQuantity: campaign.minQuantity ?? null,
        cashbackPercent: campaign.cashbackPercent ?? null,
        giftProductId: campaign.giftProductId ?? null,
        categoryId: campaign.categoryId ?? null,
        productIds: campaign.productIds ?? null,
        startAt: campaign.startAt ?? null,
        endAt: campaign.endAt ?? null,
      })
    } else {
      reset({
        name: '',
        type: CampaignType.CASHBACK,
        scope: undefined,
        minTotal: null,
        minQuantity: null,
        cashbackPercent: null,
        giftProductId: null,
        categoryId: null,
        productIds: null,
        startAt: null,
        endAt: null,
      })
    }
  }, [campaign, reset])

  const selectedType = watch('type')
  const selectedScope = watch('scope')

  const onSubmit = async (values: CampaignFormInput) => {
    setLoading(true)
    try {
      const result = isEditing
        ? await updateCampaign(campaign.id, values)
        : await createCampaign(values)

      if (result.success) {
        notifications.show({
          title: 'Sucesso',
          message: result.message,
          color: 'green',
        })
        reset()
        onClose()
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
        message: 'Erro ao processar requisição',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }
  console.log('errors', errors)
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEditing ? 'Editar Campanha' : 'Nova Campanha'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap="md">
          <TextInput
            label="Nome"
            placeholder="Digite o nome da campanha"
            required
            {...register('name')}
            error={errors.name?.message}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Tipo"
                placeholder="Selecione o tipo"
                required
                data={[
                  { value: CampaignType.CASHBACK, label: 'Cashback' },
                  { value: CampaignType.GIFT, label: 'Brinde' },
                ]}
                {...field}
                error={errors.type?.message}
              />
            )}
          />

          <Controller
            name="scope"
            control={control}
            render={({ field }) => (
              <Select
                label="Escopo"
                placeholder="Selecione o escopo"
                required
                data={[
                  { value: CampaignScope.ALL, label: 'Todos' },
                  { value: CampaignScope.CATEGORY, label: 'Categoria' },
                  { value: CampaignScope.PRODUCT, label: 'Produto' },
                ]}
                clearable
                {...field}
                value={field.value || null}
                error={errors.scope?.message}
              />
            )}
          />

          {selectedType === CampaignType.CASHBACK && (
            <Controller
              name="cashbackPercent"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Porcentagem de Cashback"
                  placeholder="Digite a porcentagem"
                  required
                  min={0}
                  max={100}
                  suffix="%"
                  {...field}
                  value={field.value ?? undefined}
                  onChange={(value) =>
                    field.onChange(typeof value === 'number' ? value : null)
                  }
                  error={errors.cashbackPercent?.message}
                />
              )}
            />
          )}

          {selectedType === CampaignType.GIFT && (
            <Controller
              name="giftProductId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Produto Brinde"
                  placeholder="Selecione o produto brinde"
                  required
                  searchable
                  data={products.map((product) => ({
                    value: product.id,
                    label: product.name,
                  }))}
                  disabled={loadingOptions}
                  {...field}
                  value={field.value || null}
                  error={errors.giftProductId?.message}
                />
              )}
            />
          )}

          {selectedScope === CampaignScope.CATEGORY && (
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Categoria"
                  placeholder="Selecione a categoria"
                  required
                  searchable
                  data={categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  disabled={loadingOptions}
                  {...field}
                  value={field.value || null}
                  error={errors.categoryId?.message}
                />
              )}
            />
          )}

          {selectedScope === CampaignScope.PRODUCT && (
            <Controller
              name="productIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Produtos"
                  placeholder="Selecione os produtos"
                  required
                  searchable
                  data={products.map((product) => ({
                    value: product.id,
                    label: product.name,
                  }))}
                  disabled={loadingOptions}
                  {...field}
                  value={field.value || []}
                  onChange={(value) =>
                    field.onChange(value.length > 0 ? value : null)
                  }
                  error={errors.productIds?.message}
                />
              )}
            />
          )}

          <Controller
            name="minTotal"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Valor Mínimo"
                placeholder="Digite o valor mínimo"
                min={0}
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                {...field}
                value={field.value ?? undefined}
                onChange={(value) =>
                  field.onChange(typeof value === 'number' ? value : null)
                }
                error={errors.minTotal?.message}
              />
            )}
          />

          <Controller
            name="minQuantity"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Quantidade Mínima"
                placeholder="Digite a quantidade mínima"
                min={1}
                {...field}
                value={field.value ?? undefined}
                onChange={(value) =>
                  field.onChange(typeof value === 'number' ? value : null)
                }
                error={errors.minQuantity?.message}
              />
            )}
          />

          <Controller
            name="startAt"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                label="Data de Início"
                placeholder="Selecione a data de início"
                valueFormat="DD/MM/YYYY"
                clearable
                value={field.value ? new Date(field.value) : null}
                onChange={(date) => {
                  if (date && typeof date === 'object') {
                    field.onChange((date as unknown as Date).toISOString())
                  } else {
                    field.onChange(null)
                  }
                }}
                error={errors.startAt?.message}
              />
            )}
          />

          <Controller
            name="endAt"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                label="Data de Término"
                placeholder="Selecione a data de término"
                valueFormat="DD/MM/YYYY"
                clearable
                value={field.value ? new Date(field.value) : null}
                onChange={(date) => {
                  if (date && typeof date === 'object') {
                    field.onChange((date as unknown as Date).toISOString())
                  } else {
                    field.onChange(null)
                  }
                }}
                error={errors.endAt?.message}
              />
            )}
          />

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
