import { IgvCode } from "../sales/igv-code.enum"

export interface CreateBoardItemModel {
    id?: number
    productId: any
    fullName: string
    price: number
    cost: number | null
    quantity: number
    preQuantity: number
    deletedQuantity: number
    boardId: any
    preIgvCode: IgvCode
    igvCode: IgvCode
    unitCode: string
    observation: string
    printZone: string
    isTrackStock: boolean
}
