import { IgvType } from "../products/igv-type.enum"

export interface PreSaleItemModel {
    _id: string
    productId: string
    sku: string | null
    fullName: string
    onModel: string
    price: number
    cost: number
    quantity: number
    preIgvCode: IgvType
    igvCode: IgvType
    unitCode: string
    unitName: string
    unitShort: string
    isTrackStock: boolean
    observations: string
    createdAt: string
    saleId: string
    categoryId: string
}
