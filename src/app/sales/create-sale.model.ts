export interface CreateSaleModel {
    invoiceCode: string
    paymentMethodId: any
    observation: string
    cash: number | null
    currencyCode: string
    discount: number | null
    igvPercent: number
    rcPercent: number
    isRetainer: boolean
    createdAt: Date | null
    turnId: any
    customerId: any
}
