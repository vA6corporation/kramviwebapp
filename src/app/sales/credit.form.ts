export interface CreditForm {
  addressIndex: number
  invoiceType: string
  observations: string
  cash: number|null
  currencyCode: string
  discount: any
  isConsumption: boolean
  deliveryAt: Date|null
  emitionAt: Date|null
  isRetainer: boolean

  workerId: any
  referredId: any
  specialtyId: any
}