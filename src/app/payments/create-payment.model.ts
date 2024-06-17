export interface CreatePaymentModel {
  charge: number
  paymentMethodId: string
  turnId: string
  createdAt: Date|string
}