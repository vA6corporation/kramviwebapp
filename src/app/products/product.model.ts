import { LotModel } from "../lots/lot.model";
import { PrintZoneType } from "../print/print-zone-type.enum";
import { ProviderModel } from "../providers/provider.model";
import { CategoryModel } from "./category.model";
import { IgvType } from "./igv-type.enum";
import { PriceModel } from "./price.model";

export interface OfficeStock {
    [key: string]: number | undefined
}

export interface ProductModel {
    _id: string
    name: string
    feature: string
    brand: string
    location: string
    description: string
    price: number
    cost: number
    sku: string
    upc: string
    unitCode: string
    unitName: string
    igvCode: IgvType
    categoryId: string
    isTrackStock: boolean
    chargeRecipe: number
    annotations: string[]
    prices: PriceModel[]
    category: CategoryModel
    printZone: PrintZoneType
    recipes: any[]
    excluded: string[]
    stock: number
    minimumStock: number
    urlImage: string
    fullName: string
    onModel: string
    products: ProductModel[]
    productIds: string[]
    providers: ProviderModel[]
    providerIds: string[]
    lots: LotModel[]
    lot?: LotModel
    officeStock: OfficeStock
}
