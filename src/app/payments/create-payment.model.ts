export interface CreatePaymentModel {
    charge: number
    paymentMethodId: number
    turnId: number
    createdAt?: Date | string
}
