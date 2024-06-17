export interface CreateCreditModel {
  addressIndex: number
  invoiceType: string
  turnId: string
  customerId: string|null
  currencyCode: string
  discount: number|null
  deliveryAt: Date|null
  emitionAt: Date|null
  observations: string
  igvPercent: number
  rcPercent: number
  isRetainer: boolean
  isCredit: boolean

  workerId: string
  referredId: string
  specialtyId: string
}