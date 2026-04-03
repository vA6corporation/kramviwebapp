export interface UpdateSaleModel {
    invoiceCode: string
    paymentMethodId: any | null
    currencyCode: string
    observation: string
    createdAt: Date | null
    discount: number | null
    isCredit: boolean
    igvPercent: number
    rcPercent: number
    customerId: any | null
    turnId: any
}
