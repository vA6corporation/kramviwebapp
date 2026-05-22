import { InvoiceCode } from './invoice-code.enum'

export interface SaleForm {
  invoiceCode: InvoiceCode
  currencyCode: string
  observation: string
  cash: number | null
  discount: number | null
  createdAt: Date
  isConsumption: boolean
  isRetainer: boolean

  paymentMethodId: any | null
}
