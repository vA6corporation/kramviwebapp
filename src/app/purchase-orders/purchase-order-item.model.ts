import { IgvType } from "../products/igv-type.enum"
import { PriceModel } from "../products/price.model"

export interface PurchaseOrderItemModel {
    productId: string
    name: string
    sku: string | null
    fullName: string
    cost: number
    price: number
    prices: PriceModel[]
    quantity: number
    preIgvCode: IgvType
    igvCode: IgvType
    expirationAt?: Date
    unitCode: string
    createdAt?: string
    purchaseId?: string
    observations: string
}
