export interface UpdateSaleModel {
  addressIndex: number
  turnId: string
  invoiceType: string
  paymentMethodId: string|null
  currencyCode: string
  observations: string
  emitionAt: Date,
  
  customerId: string|null
  createdAt: string
  discount: number|null
  isCredit: boolean
  igvPercent: number
  rcPercent: number

  workerId: string|null
  referredId: string|null
  specialtyId: string|null
}
