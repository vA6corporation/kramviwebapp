export interface IncidentSupplyItemModel {
    _id: string
    name: string
    sku: string | null
    fullName: string
    cost: number
    quantity: number
    preIgvCode: string
    igvCode: string
    unitCode: string
    incidentSupplyId: string
    productId: string
    createdAt: string
}