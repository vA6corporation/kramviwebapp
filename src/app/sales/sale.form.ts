export interface SaleForm {
  addressIndex: number
  invoiceType: string
  currencyCode: string
  observations: string
  cash: number|null
  discount: number|null
  deliveryAt: Date|null
  emitionAt: Date
  isConsumption: boolean
  isRetainer: boolean
  
  paymentMethodId: string|null
  workerId: string|null
  referredId: string|null
  specialtyId: string|null
}