import { PrintZoneType } from "../print/print-zone-type.enum"
import { IgvType } from "../products/igv-type.enum"

export interface BoardItemModel {
    _id: string
    productId: string
    fullName: string
    onModel: string
    price: number
    quantity: number
    preQuantity: number
    deletedQuantity: number
    boardId: string
    preIgvCode: IgvType
    igvCode: IgvType
    unitCode: string
    observations: string
    printZone: PrintZoneType
    isTrackStock: boolean
    deletedAt: string | null
    createdAt: string
}