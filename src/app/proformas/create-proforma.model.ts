export interface CreateProformaModel {
    observation: string
    discount: number | null
    igvPercent: number
    rcPercent: number
    currencyCode: string
    customerId: number | null
}
