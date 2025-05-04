import { LotModel } from "../lots/lot.model"
import { PrintZoneType } from "../print/print-zone-type.enum"
import { IgvType } from "../products/igv-type.enum"
import { PriceModel } from "../products/price.model"
import { RecipeModel } from "../recipes/recipe.model"
import { SaleModel } from "./sale.model"

export interface SaleItemModel {
    _id: string
    productId: string
    sku: string
    upc: string
    fullName: string
    onModel: string
    price: number
    cost: number
    quantity: number
    preIgvCode: IgvType
    igvCode: IgvType
    unitCode: string
    unitName: string
    unitShort: string
    isTrackStock: boolean
    observations: string
    createdAt: string
    deliveryAt?: string
    saleId: string
    categoryId: string
    printZone?: PrintZoneType
    lot?: LotModel
    sale?: SaleModel
    recipes: RecipeModel[]
    prices: PriceModel[]
    type?: string
}
