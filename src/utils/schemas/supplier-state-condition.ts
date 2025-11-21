import { z } from 'zod'

import { VALIDATION_MESSAGES } from '@/utils/constants/validation-messages'

export const BRAZILIAN_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
] as const

export const supplierStateConditionSchema = z.object({
  state: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  cashbackPercent: z
    .number()
    .min(0, VALIDATION_MESSAGES.NUMBER_POSITIVE)
    .max(100, VALIDATION_MESSAGES.NUMBER_MAX(100))
    .optional()
    .or(z.literal(undefined)),
  paymentTermDays: z
    .number()
    .min(0, VALIDATION_MESSAGES.NUMBER_POSITIVE)
    .optional()
    .or(z.literal(undefined)),
  unitPriceAdjustment: z.number().optional().or(z.literal(undefined)),
  effectiveFrom: z.string().optional(),
  effectiveTo: z.string().optional(),
})

export type SupplierStateConditionFormInput = z.infer<
  typeof supplierStateConditionSchema
>
