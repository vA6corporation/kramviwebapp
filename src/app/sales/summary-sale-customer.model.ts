export interface SummarySaleCustomerModel {
    id: number
    document: string
    documentType: string
    name: string
    email: string
    phone: string
    address: string

    totalCharge: number
    totalQuantity: number
}
