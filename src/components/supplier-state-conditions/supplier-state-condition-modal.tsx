'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Modal, NumberInput, Select, Stack } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { Controller, useForm } from 'react-hook-form'

import {
  createSupplierStateCondition,
  updateSupplierStateCondition,
} from '@/app/(private-routes)/supplier-state-conditions/action'
import type { SupplierStateCondition } from '@/types'
import {
  BRAZILIAN_STATES,
  supplierStateConditionSchema,
  type SupplierStateConditionFormInput,
} from '@/utils/schemas/supplier-state-condition'

interface SupplierStateConditionModalProps {
  opened: boolean
  onClose: () => void
  condition?: SupplierStateCondition
}

export function SupplierStateConditionModal({
  opened,
  onClose,
  condition,
}: SupplierStateConditionModalProps) {
  const [loading, setLoading] = useState(false)

  const isEditing = !!condition

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SupplierStateConditionFormInput>({
    resolver: zodResolver(supplierStateConditionSchema),
    defaultValues: {
      state: '',
      cashbackPercent: 0,
      paymentTermDays: 0,
      unitPriceAdjustment: 0,
      effectiveFrom: undefined,
      effectiveTo: undefined,
    },
  })

  useEffect(() => {
    if (condition) {
      reset({
        state: condition.state,
        cashbackPercent: condition.cashbackPercent || 0,
        paymentTermDays: condition.paymentTermDays || 0,
        unitPriceAdjustment: condition.unitPriceAdjustment || 0,
        effectiveFrom: condition.effectiveFrom || undefined,
        effectiveTo: condition.effectiveTo || undefined,
      })
    } else {
      reset({
        state: '',
        cashbackPercent: 0,
        paymentTermDays: 0,
        unitPriceAdjustment: 0,
        effectiveFrom: undefined,
        effectiveTo: undefined,
      })
    }
  }, [condition, reset])

  const onSubmit = async (values: SupplierStateConditionFormInput) => {
    setLoading(true)
    try {
      const result = isEditing
        ? await updateSupplierStateCondition(condition.id, values)
        : await createSupplierStateCondition(values)

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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEditing ? 'Editar Condição' : 'Nova Condição por Estado'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap="md">
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Select
                label="Estado"
                placeholder="Selecione o estado"
                required
                searchable
                data={BRAZILIAN_STATES.map((state) => ({
                  value: state.value,
                  label: state.label,
                }))}
                disabled={isEditing}
                {...field}
                error={errors.state?.message}
              />
            )}
          />

          <Controller
            name="cashbackPercent"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Porcentagem de Cashback"
                placeholder="Digite a porcentagem"
                min={0}
                max={100}
                suffix="%"
                decimalScale={2}
                {...field}
                value={field.value ?? undefined}
                onChange={(value) =>
                  field.onChange(typeof value === 'number' ? value : undefined)
                }
                error={errors.cashbackPercent?.message}
              />
            )}
          />

          <Controller
            name="paymentTermDays"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Prazo de Pagamento (dias)"
                placeholder="Digite o prazo em dias"
                min={0}
                {...field}
                value={field.value ?? undefined}
                onChange={(value) =>
                  field.onChange(typeof value === 'number' ? value : undefined)
                }
                error={errors.paymentTermDays?.message}
              />
            )}
          />

          <Controller
            name="unitPriceAdjustment"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Ajuste de Preço Unitário"
                placeholder="Digite o ajuste (positivo ou negativo)"
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                {...field}
                value={field.value ?? undefined}
                onChange={(value) =>
                  field.onChange(typeof value === 'number' ? value : undefined)
                }
                error={errors.unitPriceAdjustment?.message}
              />
            )}
          />

          <Controller
            name="effectiveFrom"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                label="Data de Início"
                placeholder="Selecione a data de início"
                valueFormat="DD/MM/YYYY"
                clearable
                value={field.value || null}
                onChange={(date) => {
                  field.onChange(date || undefined)
                }}
                error={errors.effectiveFrom?.message}
              />
            )}
          />

          <Controller
            name="effectiveTo"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                label="Data de Término"
                placeholder="Selecione a data de término"
                valueFormat="DD/MM/YYYY"
                clearable
                value={field.value || null}
                onChange={(date) => {
                  field.onChange(date || undefined)
                }}
                error={errors.effectiveTo?.message}
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
