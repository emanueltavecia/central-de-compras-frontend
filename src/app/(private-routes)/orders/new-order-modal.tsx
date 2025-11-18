'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Modal,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useForm } from 'react-hook-form'

import { calculateOrder, createOrder } from './action'

import { getPaymentConditionsBySupplier } from '@/app/(private-routes)/payment-conditions/action'
import { getProductsBySupplier } from '@/app/(private-routes)/products/action'
import type {
  Organization,
  OrderCalculationResponse,
  PaymentCondition,
  Product,
} from '@/types'
import { UserRole } from '@/utils/enums'
import {
  createOrderSchema,
  type CreateOrderInput,
} from '@/utils/schemas/orders'

interface NewOrderModalProps {
  suppliers: Organization[]
  userRole?: UserRole
}

export function NewOrderModal({ suppliers, userRole }: NewOrderModalProps) {
  if (userRole !== UserRole.STORE) {
    return null
  }
  const [opened, setOpened] = useState(false)
  const [currentProductId, setCurrentProductId] = useState('')
  const [currentQuantity, setCurrentQuantity] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [paymentConditions, setPaymentConditions] = useState<
    PaymentCondition[]
  >([])
  const [loadingPaymentConditions, setLoadingPaymentConditions] =
    useState(false)
  const [orderCalculation, setOrderCalculation] =
    useState<OrderCalculationResponse | null>(null)
  const [loadingCalculation, setLoadingCalculation] = useState(false)

  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      items: [],
      supplierOrgId: '',
      paymentConditionId: '',
      cashbackUsed: 0,
    },
  })

  const items = watch('items') || []
  const selectedSupplierId = watch('supplierOrgId')
  const selectedPaymentConditionId = watch('paymentConditionId')
  const cashbackUsed = watch('cashbackUsed')

  const [debouncedItems] = useDebouncedValue(items, 500)
  const [debouncedPaymentConditionId] = useDebouncedValue(
    selectedPaymentConditionId,
    500,
  )
  const [debouncedCashbackUsed] = useDebouncedValue(cashbackUsed, 500)

  useEffect(() => {
    const calculateOrderSummary = async () => {
      if (
        !selectedSupplierId ||
        debouncedItems.length === 0 ||
        products.length === 0
      ) {
        setOrderCalculation(null)
        return
      }

      setLoadingCalculation(true)

      try {
        const calculationItems = debouncedItems.map((item) => {
          const product = products.find((p) => p.id === item.productId)
          return {
            productId: item.productId,
            productNameSnapshot: product?.name || '',
            quantity: item.quantity,
            unitPrice: product?.basePrice || 0,
            unitPriceAdjusted: product?.basePrice || 0,
            totalPrice: (product?.basePrice || 0) * item.quantity,
          }
        })

        const result = await calculateOrder({
          supplierOrgId: selectedSupplierId,
          paymentConditionId: debouncedPaymentConditionId || undefined,
          cashbackUsed: debouncedCashbackUsed || 0,
          items: calculationItems,
        })

        if (result.success && result.calculation) {
          setOrderCalculation(result.calculation)
        } else {
          console.log('Erro no cálculo:', result.error)
          setOrderCalculation(null)
          if (result.error) {
            notifications.show({
              title: 'Erro ao calcular',
              message: result.error,
              color: 'red',
            })
          }
        }
      } catch (error) {
        console.error('Erro ao calcular pedido:', error)
        setOrderCalculation(null)
        notifications.show({
          title: 'Erro',
          message: 'Erro inesperado ao calcular pedido',
          color: 'red',
        })
      } finally {
        setLoadingCalculation(false)
      }
    }

    calculateOrderSummary()
  }, [
    selectedSupplierId,
    debouncedItems,
    debouncedPaymentConditionId,
    debouncedCashbackUsed,
    products,
  ])

  useEffect(() => {
    const loadSupplierData = async () => {
      if (!selectedSupplierId) {
        setProducts([])
        setPaymentConditions([])
        setValue('paymentConditionId', '')
        setValue('items', [])
        return
      }

      setLoadingProducts(true)
      setLoadingPaymentConditions(true)

      try {
        const [productsData, conditionsData] = await Promise.all([
          getProductsBySupplier(selectedSupplierId),
          getPaymentConditionsBySupplier(selectedSupplierId),
        ])

        setProducts(productsData)
        setPaymentConditions(conditionsData)

        setValue('paymentConditionId', '')
        setValue('items', [])
        setCurrentProductId('')
        setCurrentQuantity(1)

        if (productsData.length === 0) {
          notifications.show({
            title: 'Aviso',
            message: 'Este fornecedor não possui produtos ativos',
            color: 'yellow',
          })
        }

        if (conditionsData.length === 0) {
          notifications.show({
            title: 'Aviso',
            message: 'Este fornecedor não possui condições de pagamento ativas',
            color: 'yellow',
          })
        } else if (conditionsData.length === 1) {
          setValue('paymentConditionId', conditionsData[0].id)
        }
      } catch (error) {
        notifications.show({
          title: 'Erro',
          message: 'Erro ao carregar dados do fornecedor',
          color: 'red',
        })
        setProducts([])
        setPaymentConditions([])
      } finally {
        setLoadingProducts(false)
        setLoadingPaymentConditions(false)
      }
    }

    loadSupplierData()
  }, [selectedSupplierId, setValue])

  const addItem = () => {
    if (!currentProductId || currentQuantity <= 0) {
      notifications.show({
        title: 'Erro',
        message: 'Selecione um produto e quantidade válida',
        color: 'red',
      })
      return
    }

    setValue('items', [
      ...items,
      { productId: currentProductId, quantity: currentQuantity },
    ])
    setCurrentProductId('')
    setCurrentQuantity(1)
  }

  const removeItem = (index: number) => {
    setValue(
      'items',
      items.filter((_, i) => i !== index),
    )
  }

  const onSubmit = async (data: CreateOrderInput) => {
    if (data.items.length === 0) {
      notifications.show({
        title: 'Erro',
        message: 'Adicione pelo menos um item ao pedido',
        color: 'red',
      })
      return
    }

    try {
      const result = await createOrder(data)

      if (result.success) {
        notifications.show({
          title: 'Sucesso',
          message: 'Pedido criado com sucesso!',
          color: 'green',
        })
        setOpened(false)
        reset()
        setCurrentProductId('')
        setCurrentQuantity(1)
        setProducts([])
        setPaymentConditions([])
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
          setCurrentProductId('')
          setCurrentQuantity(1)
          setProducts([])
          setPaymentConditions([])
        }}
        title="Novo Pedido"
        size="xl"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Select
            label="Fornecedor"
            placeholder="Selecione o fornecedor"
            data={suppliers.map((s) => ({
              value: s.id,
              label: s.tradeName || s.legalName,
            }))}
            {...register('supplierOrgId')}
            value={watch('supplierOrgId')}
            onChange={(value) => setValue('supplierOrgId', value || '')}
            error={errors.supplierOrgId?.message}
            withAsterisk
          />

          <Select
            label="Condição de Pagamento"
            placeholder={
              loadingPaymentConditions
                ? 'Carregando...'
                : !selectedSupplierId
                  ? 'Selecione um fornecedor primeiro'
                  : 'Selecione a condição de pagamento'
            }
            data={paymentConditions.map((pc) => ({
              value: pc.id,
              label: pc.name || '',
            }))}
            {...register('paymentConditionId')}
            value={watch('paymentConditionId')}
            onChange={(value) => setValue('paymentConditionId', value || '')}
            error={errors.paymentConditionId?.message}
            disabled={!selectedSupplierId || loadingPaymentConditions}
            withAsterisk
          />

          <NumberInput
            label="Cashback Utilizado"
            placeholder="0"
            min={0}
            step={0.01}
            decimalScale={2}
            value={watch('cashbackUsed')}
            onChange={(value) => setValue('cashbackUsed', Number(value) || 0)}
            error={errors.cashbackUsed?.message}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Itens do Pedido</label>

            <div className="flex gap-2">
              <Select
                placeholder={
                  loadingProducts
                    ? 'Carregando produtos...'
                    : !selectedSupplierId
                      ? 'Selecione um fornecedor primeiro'
                      : 'Selecione um produto'
                }
                data={products.map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
                value={currentProductId}
                onChange={(value) => setCurrentProductId(value || '')}
                className="flex-1"
                disabled={!selectedSupplierId || loadingProducts}
              />

              <NumberInput
                placeholder="Qtd"
                min={1}
                value={currentQuantity}
                onChange={(value) => setCurrentQuantity(Number(value) || 1)}
                className="w-24"
                disabled={!currentProductId}
              />

              <Button
                onClick={addItem}
                variant="light"
                disabled={!currentProductId || currentQuantity <= 0}
              >
                Adicionar
              </Button>
            </div>

            {items.length > 0 && (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Produto</Table.Th>
                    <Table.Th>Quantidade</Table.Th>
                    <Table.Th>Ações</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {items.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{getProductName(item.productId)}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          onClick={() => removeItem(index)}
                        >
                          Remover
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </div>

          {(loadingCalculation || orderCalculation) && items.length > 0 && (
            <Card withBorder shadow="sm" radius="md" p="md">
              <Group justify="space-between" mb="xs">
                <Text fw={600} size="lg">
                  Resumo do Pedido
                </Text>
                {loadingCalculation && <Loader size="sm" />}
              </Group>

              {orderCalculation && !loadingCalculation && (
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Subtotal
                    </Text>
                    <Text size="sm" fw={500}>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(orderCalculation.subtotalAmount)}
                    </Text>
                  </Group>

                  {orderCalculation.shippingCost > 0 && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Frete
                      </Text>
                      <Text size="sm" fw={500}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(orderCalculation.shippingCost)}
                      </Text>
                    </Group>
                  )}

                  {orderCalculation.adjustments !== 0 && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Ajustes
                      </Text>
                      <Text
                        size="sm"
                        fw={500}
                        c={orderCalculation.adjustments > 0 ? 'red' : 'green'}
                      >
                        {orderCalculation.adjustments > 0 ? '+' : ''}
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(orderCalculation.adjustments)}
                      </Text>
                    </Group>
                  )}

                  <Divider />

                  <Group justify="space-between">
                    <Text size="lg" fw={700}>
                      Total
                    </Text>
                    <Text size="lg" fw={700} c="blue">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(orderCalculation.totalAmount)}
                    </Text>
                  </Group>

                  {orderCalculation.totalCashback > 0 && (
                    <>
                      <Divider />
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          Cashback a Receber
                        </Text>
                        <Badge color="green" size="lg" variant="light">
                          +
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(orderCalculation.totalCashback)}
                        </Badge>
                      </Group>
                    </>
                  )}

                  {orderCalculation.adjustmentDetails
                    .supplierStateCondition && (
                    <>
                      <Divider />
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>
                          Condições Aplicadas:
                        </Text>
                        <Group gap="xs">
                          <Badge variant="light" color="blue">
                            Estado:{' '}
                            {
                              orderCalculation.adjustmentDetails
                                .supplierStateCondition.state
                            }
                          </Badge>
                          {orderCalculation.adjustmentDetails
                            .supplierStateCondition.cashbackPercent > 0 && (
                            <Badge variant="light" color="green">
                              Cashback:{' '}
                              {
                                orderCalculation.adjustmentDetails
                                  .supplierStateCondition.cashbackPercent
                              }
                              %
                            </Badge>
                          )}
                        </Group>
                      </Stack>
                    </>
                  )}

                  {orderCalculation.adjustmentDetails.paymentCondition && (
                    <>
                      <Divider />
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>
                          Forma de Pagamento:
                        </Text>
                        <Badge variant="light" color="violet">
                          {
                            orderCalculation.adjustmentDetails.paymentCondition
                              .name
                          }{' '}
                          (
                          {
                            orderCalculation.adjustmentDetails.paymentCondition
                              .paymentMethod
                          }
                          )
                        </Badge>
                      </Stack>
                    </>
                  )}

                  {orderCalculation.adjustmentDetails.campaigns &&
                    orderCalculation.adjustmentDetails.campaigns.length > 0 && (
                      <>
                        <Divider />
                        <Stack gap="xs">
                          <Text size="sm" fw={500}>
                            Campanhas Ativas:
                          </Text>
                          <Group gap="xs">
                            {orderCalculation.adjustmentDetails.campaigns.map(
                              (campaign) => (
                                <Badge
                                  key={campaign.id}
                                  variant="light"
                                  color="orange"
                                >
                                  {campaign.name}
                                  {campaign.cashbackPercent &&
                                    ` (${campaign.cashbackPercent}% cashback)`}
                                  {campaign.giftProductId && ' (Brinde)'}
                                </Badge>
                              ),
                            )}
                          </Group>
                        </Stack>
                      </>
                    )}

                  {orderCalculation.calculatedItems.length > 0 && (
                    <>
                      <Divider />
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>
                          Detalhamento dos Itens:
                        </Text>
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Produto</Table.Th>
                              <Table.Th>Qtd</Table.Th>
                              <Table.Th>Preço Unit.</Table.Th>
                              <Table.Th>Total</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {orderCalculation.calculatedItems.map((item) => (
                              <Table.Tr key={item.productId}>
                                <Table.Td>
                                  {getProductName(item.productId)}
                                </Table.Td>
                                <Table.Td>{item.quantity}</Table.Td>
                                <Table.Td>
                                  {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  }).format(item.unitPriceAdjusted)}
                                </Table.Td>
                                <Table.Td>
                                  {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  }).format(item.totalPrice)}
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </Stack>
                    </>
                  )}
                </Stack>
              )}
            </Card>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="light"
              onClick={() => {
                setOpened(false)
                reset()
                setCurrentProductId('')
                setCurrentQuantity(1)
                setProducts([])
                setPaymentConditions([])
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
