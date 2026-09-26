import { PrintZoneType } from '../print/print-zone-type.enum'
import { ProviderModel } from '../providers/provider.model'
import { CategoryModel } from './category.model'
import { IgvCode } from '../sales/igv-code.enum'
import { PriceModel } from './price.model'

export interface OfficeStock {
    [key: string]: number | undefined
}

export interface ProductModel {
    id: number
    uuid: string
    name: string
    feature: string
    brand: string
    price: number
    cost: number
    sku: string
    upc: string
    unitCode: string
    unitName: string
    igvCode: IgvCode
    categoryId: number
    isTrackStock: boolean
    annotations: string[]
    prices: PriceModel[]
    category: CategoryModel
    printZone: PrintZoneType
    stock: number
    minimumStock: number
    urlImage: string
    fullName: string
    provider: ProviderModel | null
    officeStock: OfficeStock
}
