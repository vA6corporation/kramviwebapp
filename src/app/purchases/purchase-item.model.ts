import { LotModel } from "../lots/lot.model"
import { IgvType } from "../products/igv-type.enum"
import { PriceModel } from "../products/price.model"

export interface PurchaseItemModel {
    _id: string
    name: string
    sku: string | null
    fullName: string
    cost: number
    price: number
    prices: PriceModel[]
    quantity: number
    preIgvCode: IgvType
    igvCode: IgvType
    purchasedAt: string
    unitCode: string
    createdAt: string
    purchaseId: string
    productId: string
    lot: LotModel | null
}
