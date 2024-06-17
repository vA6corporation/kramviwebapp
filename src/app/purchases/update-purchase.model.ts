export interface UpdatePurchaseModel {
  invoiceType: string
  serie: string|null
  observations: string
  purchasedAt: Date
  createdAt: Date
  providerId: string|null
  paymentMethodId: string
}
