export interface PurchaseSupplyItemModel {
    _id: string
    supplyId: string
    name: string
    sku: string | null
    fullName: string
    cost: number
    quantity: number
    preIgvCode: string
    igvCode: string,
    unitCode: string
    purchaseSupplyId: string
    createdAt: string
}
