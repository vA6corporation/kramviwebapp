export interface CreatePurchaseSupplyItemModel {
    sku: string | null,
    name: string,
    fullName: string,
    cost: number,
    quantity: number,
    unitCode: string,
    igvCode: string,
    preIgvCode: string,
    supplyId: string,
}
