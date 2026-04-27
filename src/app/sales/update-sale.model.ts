export interface UpdateSaleModel {
    invoiceCode: string
    paymentMethodId: any
    observation: string
    cash: number | null
    currencyCode: string
    discount: number | null
    deliveryAt: Date | null
    igvPercent: number
    rcPercent: number
    isRetainer: boolean
    isDelivery: boolean
    createdAt: Date | null
    turnId: any
    customerId: any
}
