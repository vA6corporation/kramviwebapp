import { PrintZoneType } from '../print/print-zone-type.enum'
import { IgvCode } from '../sales/igv-code.enum'
import { PriceModel } from '../products/price.model'
import { SaleModel } from './sale.model'

export interface SaleItemModel {
    id: number
    productId: any
    sku: string
    upc: string
    fullName: string
    price: number
    cost: number
    quantity: number
    preIgvCode: IgvCode
    igvCode: IgvCode
    unitCode: string
    unitName: string
    unitShort: string
    isTrackStock: boolean
    observation: string
    createdAt: string
    saleId: any
    categoryId: any
    printZone?: PrintZoneType
    sale?: SaleModel
    prices: PriceModel[]
}
