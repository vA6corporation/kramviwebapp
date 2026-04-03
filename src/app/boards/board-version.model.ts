import { BoardItemModel } from './board-item.model'

export interface BoardVersionModel {
    id: number
    createdAt: string
    boardItems: BoardItemModel[]
}
