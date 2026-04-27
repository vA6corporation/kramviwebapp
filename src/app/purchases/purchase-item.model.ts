import { IgvCode } from '../sales/igv-code.enum'
import { PriceModel } from '../products/price.model'

export interface PurchaseItemModel {
    id: number
    name: string
    sku: string | null
    fullName: string
    cost: number
    price: number
    prices: PriceModel[]
    quantity: number
    preIgvCode: IgvCode
    igvCode: IgvCode
    purchasedAt: string
    unitCode: string
    createdAt: string
    purchaseId: any
    productId: any
    isTrackStock: boolean
}
