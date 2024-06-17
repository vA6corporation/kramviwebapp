export interface CreditNoteItemModel {
    productId: string
    sku: string | null
    fullName: string
    onModel: string
    price: number
    quantity: number
    preIgvCode: string
    igvCode: string
    unitCode: string
    categoryId: string
    observations: string
    createdAt: string
    saleId: string
    creditNoteId: string
}
