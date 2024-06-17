import { LotModel } from "../lots/lot.model";
import { IgvType } from "../products/igv-type.enum";
import { PriceModel } from "../products/price.model";

export interface CreateSaleItemModel {
    fullName: string
    onModel: string
    price: number
    quantity: number
    preIgvCode: IgvType
    igvCode: IgvType
    unitCode: string
    isTrackStock: boolean
    prices: PriceModel[]
    productId: string
    observations: string
    lot?: LotModel
}
