import { IgvType } from "../products/igv-type.enum"
import { PriceModel } from "../products/price.model"

export interface ProformaItemModel {
    productId: string
    sku: string
    upc: string
    fullName: string
    onModel: string
    isTrackStock: boolean
    price: number
    quantity: number
    preIgvCode: IgvType
    igvCode: IgvType
    unitCode: string
    observations: string
    unitName: string
    description: string
    urlImage: string
    prices: PriceModel[]
}
