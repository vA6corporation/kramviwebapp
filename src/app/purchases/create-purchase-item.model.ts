import { IgvCode } from '../products/igv-type.enum'
import { PriceModel } from '../products/price.model'

export interface CreatePurchaseItemModel {
    fullName: string
    cost: number
    quantity: number
    preIgvCode: IgvCode
    igvCode: IgvCode
    unitCode: string
    isTrackStock: boolean
    productId: any
    price: number
    prices: PriceModel[]
}
