import { IgvCode } from '../sales/igv-code.enum'
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
    urlImage: string
    prices: PriceModel[]
}
