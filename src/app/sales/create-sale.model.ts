export interface CreateSaleModel {
  addressIndex: number
  invoiceType: string
  paymentMethodId: string|null
  observations: string
  cash: number|null
  currencyCode: string
  discount: number|null
  deliveryAt: Date|null,
  emitionAt: Date|null,
  igvPercent: number
  rcPercent: number
  isRetainer: boolean

  turnId: string
  customerId: string|null
  workerId: string|null
  referredId: string|null
  specialtyId: string|null
}