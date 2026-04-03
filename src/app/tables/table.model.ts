import { BoardModel } from '../boards/board.model'

export interface TableModel {
    id: number
    name: string
    board: BoardModel | null
    deletedAt: string | null
}
