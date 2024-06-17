export interface CreatePurchaseSupplyModel {
  invoiceCode: string
  paymentType: string
  serie: string|null
  purchasedAt: Date
  providerId: string|null
  observations: string
}
