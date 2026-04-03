export interface CreditForm {
    invoiceCode: string
    observation: string
    cash: number | null
    currencyCode: string
    discount: number | null
    isConsumption: boolean
    deliveryAt: Date | null
    createdAt: Date | null
    isRetainer: boolean
}
