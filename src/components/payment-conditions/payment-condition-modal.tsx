'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Controller, useForm } from 'react-hook-form'

import {
  createPaymentCondition,
  updatePaymentCondition,
} from '@/app/(private-routes)/payment-conditions/action'
import type { PaymentCondition } from '@/types'
import { PaymentMethod } from '@/utils/enums'
import {
  paymentConditionSchema,
  type PaymentConditionFormInput,
} from '@/utils/schemas/payment-condition'

interface PaymentConditionModalProps {
  opened: boolean
  onClose: () => void
  paymentCondition?: PaymentCondition
}

const paymentMethodOptions = [
  { value: PaymentMethod.CREDIT_CARD, label: 'Cartão de Crédito' },
  { value: PaymentMethod.BOLETO, label: 'Boleto' },
  { value: PaymentMethod.PIX, label: 'PIX' },
]

export function PaymentConditionModal({
  opened,
  onClose,
  paymentCondition,
}: PaymentConditionModalProps) {
  const [loading, setLoading] = useState(false)

  const isEditing = !!paymentCondition

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PaymentConditionFormInput>({
    resolver: zodResolver(paymentConditionSchema),
    defaultValues: {
      name: '',
      paymentTermDays: undefined,
      paymentMethod: PaymentMethod.PIX,
      notes: '',
    },
  })

  useEffect(() => {
    if (paymentCondition) {
      reset({
        name: paymentCondition.name || '',
        paymentTermDays: paymentCondition.paymentTermDays || undefined,
        paymentMethod: paymentCondition.paymentMethod,
        notes: paymentCondition.notes || '',
      })
    } else {
      reset({
        name: '',
        paymentTermDays: undefined,
        paymentMethod: PaymentMethod.PIX,
        notes: '',
      })
    }
  }, [paymentCondition, reset])

  const onSubmit = async (data: PaymentConditionFormInput) => {
    setLoading(true)

    try {
      let result

      if (isEditing) {
        result = await updatePaymentCondition(paymentCondition.id, data)
      } else {
        result = await createPaymentCondition(data)
      }

      if (result.success) {
        notifications.show({
          title: 'Sucesso',
          message: result.message,
          color: 'green',
        })
        onClose()
        reset()
      } else {
        notifications.show({
          title: 'Erro',
          message: result.message,
          color: 'red',
        })
      }
    } catch (error) {
      console.error('Erro ao salvar condição de pagamento:', error)
      notifications.show({
        title: 'Erro',
        message: 'Erro ao salvar condição de pagamento',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      reset()
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        isEditing
          ? 'Editar Condição de Pagamento'
          : 'Nova Condição de Pagamento'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap="md">
          <TextInput
            label="Nome"
            placeholder="Ex: À vista com desconto"
            {...register('name')}
            error={errors.name?.message}
          />

          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <Select
                label="Método de Pagamento"
                placeholder="Selecione o método"
                data={paymentMethodOptions}
                value={field.value}
                onChange={(value) => field.onChange(value as PaymentMethod)}
                error={errors.paymentMethod?.message}
                required
              />
            )}
          />

          <Controller
            name="paymentTermDays"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Prazo de Pagamento (dias)"
                placeholder="Ex: 30"
                min={0}
                value={field.value as number}
                onChange={(value) => field.onChange(value)}
                error={errors.paymentTermDays?.message}
              />
            )}
          />

          <Textarea
            label="Observações"
            placeholder="Adicione observações sobre esta condição"
            rows={3}
            {...register('notes')}
            error={errors.notes?.message}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {isEditing ? 'Salvar Alterações' : 'Criar Condição'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
