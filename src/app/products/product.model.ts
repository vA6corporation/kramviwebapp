import { PrintZoneType } from '../print/print-zone-type.enum'
import { ProviderModel } from '../providers/provider.model'
import { CategoryModel } from './category.model'
import { IgvCode } from './igv-type.enum'
import { PriceModel } from './price.model'

export interface OfficeStock {
    [key: string]: number | undefined
}

export interface ProductModel {
    id: number
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
    igvCode: IgvCode
    categoryId: any
    isTrackStock: boolean
    annotations: string[]
    prices: PriceModel[]
    category: CategoryModel
    printZone: PrintZoneType
    stock: number
    minimumStock: number
    urlImage: string
    fullName: string
    products: ProductModel[]
    productIds: number[]
    providers: ProviderModel[]
    providerIds: number[]
    officeStock: OfficeStock
}
