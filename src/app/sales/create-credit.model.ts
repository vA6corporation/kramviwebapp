export interface CreateCreditModel {
    invoiceCode: string
    turnId: number
    customerId: number | null
    currencyCode: string
    discount: number | null
    createdAt: Date | null
    observation: string
    igvPercent: number
    rcPercent: number
    isRetainer: boolean
    isCredit: boolean
}
