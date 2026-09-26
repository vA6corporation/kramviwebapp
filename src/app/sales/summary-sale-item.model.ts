export interface SummarySaleItemModel {
    id: number
    productId: any
    categoryId: any
    sku: string
    upc: string
    saleIds: number[]
    fullName: string
    stock: number
    cost: number | null
    totalQuantity: number
    totalQuantityBonus: number
    totalCharge: number
    totalPurchase: number
    totalUtitlity: number
}
