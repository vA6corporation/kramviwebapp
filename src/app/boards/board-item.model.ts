import { PrintZoneType } from '../print/print-zone-type.enum'
import { IgvCode } from '../products/igv-type.enum'

export interface BoardItemModel {
    id: number
    productId: any
    fullName: string
    price: number
    quantity: number
    preQuantity: number
    deletedQuantity: number
    boardId: any
    preIgvCode: IgvCode
    igvCode: IgvCode
    unitCode: string
    observation: string
    printZone: PrintZoneType
    isTrackStock: boolean
    deletedAt: string | null
    createdAt: string
}
