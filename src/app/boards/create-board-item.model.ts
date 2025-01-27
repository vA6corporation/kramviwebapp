import { IgvType } from "../products/igv-type.enum"

export interface CreateBoardItemModel {
    _id?: string
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
    printZone: string
    isTrackStock: boolean
}
