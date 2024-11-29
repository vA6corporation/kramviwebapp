export interface CreatePurchaseModel {
    invoiceType: string
    isCredit: boolean
    paymentMethodId: string
    serie: string | null
    purchasedAt: Date
    expirationAt: Date | null
    providerId: string | null
    observations: string
}
