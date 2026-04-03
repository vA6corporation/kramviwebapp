import { TableModel } from '../tables/table.model'
import { UserModel } from '../users/user.model'
import { BoardItemModel } from './board-item.model'
import { BoardVersionModel } from './board-version.model'

export interface BoardModel {
    id: number
    ticketNumber: string
    boardItems: BoardItemModel[]
    deletedBoardItems: number
    table: TableModel
    versions: BoardVersionModel[]
    createdAt: string
    user: UserModel
    tableId: any
    charge: number
}
