'use client'

import { useState } from 'react'

import {
  Badge,
  Button,
  Card,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'

import { OrderStatus } from '@/utils/enums'

export function OrdersFilters() {
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([])

  const statuses = [
    { value: OrderStatus.PLACED, label: 'Pendente', color: 'orange' },
    { value: OrderStatus.CONFIRMED, label: 'Aprovado', color: 'blue' },
    { value: OrderStatus.SHIPPED, label: 'Em transporte', color: 'purple' },
    { value: OrderStatus.DELIVERED, label: 'Entregue', color: 'green' },
    { value: OrderStatus.CANCELLED, label: 'Cancelado', color: 'red' },
    { value: OrderStatus.REJECTED, label: 'Recusado', color: 'red' },
  ]

  const toggleStatus = (status: OrderStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    )
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="lg">
        <Title order={3}>Filtros</Title>

        <Stack gap="md">
          <div>
            <Text size="sm" fw={600} mb="xs">
              Data
            </Text>
            <TextInput type="date" placeholder="Selecione a data" />
          </div>

          <div>
            <Text size="sm" fw={600} mb="xs">
              Status
            </Text>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Badge
                  key={status.value}
                  variant={
                    selectedStatuses.includes(status.value) ? 'filled' : 'light'
                  }
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
              Valor
            </Text>
            <TextInput
              type="number"
              placeholder="Valor mínimo"
              prefix="R$ "
              mb="xs"
            />
            <TextInput type="number" placeholder="Valor máximo" prefix="R$ " />
          </div>

          <div>
            <Text size="sm" fw={600} mb="xs">
              Número Pedido
            </Text>
            <TextInput placeholder="Digite o número do pedido" />
          </div>
        </Stack>

        <Button fullWidth variant="light">
          Aplicar Filtros
        </Button>
      </Stack>
    </Card>
  )
}
