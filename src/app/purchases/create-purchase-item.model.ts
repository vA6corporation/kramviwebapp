import { IgvCode } from '../sales/igv-code.enum'
import { PriceModel } from '../products/price.model'

export interface CreatePurchaseItemModel {
    fullName: string
    cost: number
    price: number
    quantity: number
    preIgvCode: IgvCode
    igvCode: IgvCode
    unitCode: string
    isTrackStock: boolean
    productId: any
    prices: PriceModel[]
}
