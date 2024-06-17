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
    deletedAt: string
    boardId: string
    preIgvCode: IgvType
    igvCode: IgvType
    unitCode: string
    observations: string
    printZone: PrintZoneType
    createdAt: string
    isTrackStock: boolean
}
