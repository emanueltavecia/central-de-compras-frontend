export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productNameSnapshot: string
  unitPrice: number
  unitPriceAdjusted: number
  quantity: number
  totalPrice: number
  appliedCashbackAmount?: number
  createdAt: string
}
