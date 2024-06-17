import { IgvType } from "../products/igv-type.enum"
import { PriceModel } from "../products/price.model"

export interface EventItemModel {
    _id: string
    productId: string
    name: string
    sku: string
    fullName: string
    onModel: string
    price: number
    quantity: number
    preIgvCode: IgvType
    igvCode: IgvType
    unitCode: string
    observations: string
    isTrackStock: boolean
    createdAt: string
    saleId: string
    prices: PriceModel[]
}
