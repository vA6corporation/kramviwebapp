export interface CreatePurchaseModel {
    invoiceCode: string
    serie: string
    createdAt: Date
    expirationAt: Date | null
    providerId: number | null
    observation: string
}
