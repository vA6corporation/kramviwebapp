export interface CreateProformaModel {
    addressIndex: number
    observations: string
    discount: number | null
    igvPercent: number
    currencyCode: string
    customerId: string | null
}
