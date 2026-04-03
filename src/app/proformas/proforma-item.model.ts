import { IgvCode } from '../products/igv-type.enum'
import { PriceModel } from '../products/price.model'

export interface ProformaItemModel {
    productId: any
    sku: string
    upc: string
    fullName: string
    isTrackStock: boolean
    price: number
    quantity: number
    preIgvCode: IgvCode
    igvCode: IgvCode
    unitCode: string
    observation: string
    unitName: string
    description: string
    urlImage: string
    prices: PriceModel[]
}
