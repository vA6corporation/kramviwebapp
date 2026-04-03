export interface CreditNoteItemModel {
    id: number
    productId: any
    sku: string | null
    fullName: string
    price: number
    quantity: number
    preIgvCode: string
    igvCode: string
    unitCode: string
    categoryId: any
    observation: string
    createdAt: string
    saleId: any
    creditNoteId: any
}
