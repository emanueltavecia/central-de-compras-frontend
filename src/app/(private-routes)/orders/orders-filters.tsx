'use client'

import { useState, useTransition } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Badge,
  Button,
  Card,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconFilter, IconFilterOff } from '@tabler/icons-react'

import { OrderStatus } from '@/utils/enums'

export function OrdersFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    (searchParams.get('status') as OrderStatus) || null,
  )
  const [dateFrom, setDateFrom] = useState<string | null>(
    searchParams.get('placedAtFrom') || null,
  )
  const [dateTo, setDateTo] = useState<string | null>(
    searchParams.get('placedAtTo') || null,
  )
  const [minAmount, setMinAmount] = useState(
    searchParams.get('minAmount') || '',
  )
  const [maxAmount, setMaxAmount] = useState(
    searchParams.get('maxAmount') || '',
  )
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '')

  const statuses = [
    { value: OrderStatus.PLACED, label: 'Pendente', color: 'orange' },
    { value: OrderStatus.CONFIRMED, label: 'Aprovado', color: 'blue' },
    { value: OrderStatus.SHIPPED, label: 'Em transporte', color: 'purple' },
    { value: OrderStatus.DELIVERED, label: 'Entregue', color: 'green' },
    { value: OrderStatus.CANCELLED, label: 'Cancelado', color: 'red' },
    { value: OrderStatus.REJECTED, label: 'Recusado', color: 'red' },
  ]

  const toggleStatus = (status: OrderStatus) => {
    setSelectedStatus((prev) => (prev === status ? null : status))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (selectedStatus) params.set('status', selectedStatus)
    if (dateFrom) params.set('placedAtFrom', dateFrom)
    if (dateTo) params.set('placedAtTo', dateTo)
    if (minAmount) params.set('minAmount', minAmount)
    if (maxAmount) params.set('maxAmount', maxAmount)
    if (orderId) params.set('orderId', orderId)

    startTransition(() => {
      router.push(`/orders?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    setSelectedStatus(null)
    setDateFrom(null)
    setDateTo(null)
    setMinAmount('')
    setMaxAmount('')
    setOrderId('')

    startTransition(() => {
      router.push('/orders')
    })
  }

  const hasActiveFilters =
    selectedStatus || dateFrom || dateTo || minAmount || maxAmount || orderId

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="lg">
        <div className="flex items-center justify-between">
          <Title order={3}>Filtros</Title>
          {hasActiveFilters && (
            <Badge color="blue" variant="light">
              Ativos
            </Badge>
          )}
        </div>

        <Stack gap="md">
          <div>
            <Text size="sm" fw={600} mb="xs">
              Data do Pedido
            </Text>
            <DatePickerInput
              placeholder="Data inicial"
              value={dateFrom}
              onChange={(value) => setDateFrom(value || null)}
              mb="xs"
              clearable
            />
            <DatePickerInput
              placeholder="Data final"
              value={dateTo}
              onChange={(value) => setDateTo(value || null)}
              clearable
            />
          </div>

          <div>
            <Text size="sm" fw={600} mb="xs">
              Status
            </Text>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Badge
                  key={status.value}
                  variant={selectedStatus === status.value ? 'filled' : 'light'}
                  color={status.color}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleStatus(status.value)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Text size="sm" fw={600} mb="xs">
              Valor Total
            </Text>
            <TextInput
              type="number"
              placeholder="Valor mínimo"
              leftSection="R$"
              mb="xs"
              value={minAmount}
              onChange={(e) => setMinAmount(e.currentTarget.value)}
            />
            <TextInput
              type="number"
              placeholder="Valor máximo"
              leftSection="R$"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.currentTarget.value)}
            />
          </div>

          <div>
            <Text size="sm" fw={600} mb="xs">
              Número do Pedido
            </Text>
            <TextInput
              placeholder="Digite o ID do pedido"
              value={orderId}
              onChange={(e) => setOrderId(e.currentTarget.value)}
            />
          </div>
        </Stack>

        <div className="flex gap-2">
          <Button
            fullWidth
            variant="light"
            leftSection={<IconFilter size={16} />}
            onClick={applyFilters}
            loading={isPending}
          >
            Aplicar
          </Button>
          {hasActiveFilters && (
            <Button
              variant="subtle"
              color="gray"
              onClick={clearFilters}
              loading={isPending}
            >
              <IconFilterOff size={16} />
            </Button>
          )}
        </div>
      </Stack>
    </Card>
  )
}
