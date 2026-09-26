import { IgvCode } from '../sales/igv-code.enum'
import { PriceModel } from '../products/price.model'

export interface PurchaseOrderItemModel {
    productId: number
    name: string
    sku: string | null
    fullName: string
    cost: number
    price: number
    prices: PriceModel[]
    quantity: number
    preIgvCode: IgvCode
    igvCode: IgvCode
    expirationAt?: Date
    unitCode: string
    createdAt?: string
    purchaseId?: number
    observation: string
}
