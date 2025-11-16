export interface OrderCalculationItem {
  productId: string
  productNameSnapshot: string
  quantity: number
  unitPrice: number
  unitPriceAdjusted: number
  totalPrice: number
  appliedCashbackAmount?: number
}

export interface SupplierStateConditionAdjustment {
  id: string
  state: string
  unitPriceAdjustment: number
  cashbackPercent: number
}

export interface PaymentConditionAdjustment {
  id: string
  name: string
  paymentMethod: string
}

export interface CampaignAdjustment {
  id: string
  name: string
  type: string
  cashbackPercent?: number
  giftProductId?: string
}

export interface AdjustmentDetails {
  supplierStateCondition?: SupplierStateConditionAdjustment
  paymentCondition?: PaymentConditionAdjustment
  campaigns?: CampaignAdjustment[]
}

export interface CalculatedItem {
  productId: string
  quantity: number
  unitPrice: number
  unitPriceAdjusted: number
  totalPrice: number
  appliedCashbackAmount: number
}

export interface OrderCalculationRequest {
  storeOrgId: string
  supplierOrgId: string
  shippingAddressId?: string
  paymentConditionId?: string
  storeState?: string
  cashbackUsed?: number
  items: OrderCalculationItem[]
}

export interface OrderCalculationResponse {
  subtotalAmount: number
  shippingCost: number
  adjustments: number
  totalAmount: number
  totalCashback: number
  appliedSupplierStateConditionId?: string
  adjustmentDetails: AdjustmentDetails
  calculatedItems: CalculatedItem[]
}
