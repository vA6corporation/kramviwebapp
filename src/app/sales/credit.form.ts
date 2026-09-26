export interface CreditForm {
    invoiceCode: string
    observation: string
    cash: number | null
    currencyCode: string
    discount: number | null
    isConsumption: boolean
    createdAt: Date | null
    isRetainer: boolean
}
