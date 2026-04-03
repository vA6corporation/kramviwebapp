import { IgvCode } from '../products/igv-type.enum'
import { PriceModel } from '../products/price.model'

export interface CreateSaleItemModel {
    fullName: string
    price: number
    quantity: number
    preIgvCode: IgvCode
    igvCode: IgvCode
    unitCode: string
    isTrackStock: boolean
    prices: PriceModel[]
    productId: any
    observation: string
}
