export interface SummarySaleItemModel {
    _id: string
    productId: string
    categoryId: string
    sku: string
    upc: string
    saleIds: string[]
    fullName: string
    stock: number
    cost: number | null
    totalQuantity: number
    totalQuantityBonus: number
    totalSale: number
    totalPurchase: number
    totalUtitlity: number
}
