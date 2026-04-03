export interface CreatePurchaseModel {
    invoiceCode: string
    isCredit: boolean
    paymentMethodId: any
    serie: string | null
    purchasedAt: Date
    expirationAt: Date | null
    providerId: any | null
    observation: string
}
