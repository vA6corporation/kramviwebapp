export interface SupplyModel {
    _id: string
    fullName: string
    name: string
    feature: string
    brand: string
    cost: number
    unitCode: string
    igvCode: string
    categorySupplyId: string
    stock: number
    recipes?: any[]
}
