import { BoardModel } from "../boards/board.model"

export interface TableModel {
    _id: string
    name: string
    board: BoardModel | null
    deletedAt: string | null
}