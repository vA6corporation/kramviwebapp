import { IgvCode } from '../sales/igv-code.enum'
import { PriceModel } from '../products/price.model'

export interface CreateSaleItemModel {
    fullName: string
    price: number
    cost: number | null
    quantity: number
    preIgvCode: IgvCode
    igvCode: IgvCode
    unitCode: string
    isTrackStock: boolean
    prices: PriceModel[]
    productId: any
    observation: string
}
