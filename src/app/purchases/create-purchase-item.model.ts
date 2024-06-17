import { LotModel } from "../lots/lot.model"
import { IgvType } from "../products/igv-type.enum"
import { PriceModel } from "../products/price.model"

export interface CreatePurchaseItemModel {
    fullName: string
    cost: number
    quantity: number
    preIgvCode: IgvType
    igvCode: IgvType
    unitCode: string
    isTrackStock: boolean
    productId: string
    price: number
    prices: PriceModel[]
    lot: LotModel | null
}
