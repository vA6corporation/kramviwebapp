import { TableModel } from '../tables/table.model'
import { UserModel } from '../users/user.model'

export interface PreaccountModel {
    id: number
    ticketNumber: string
    preaccountItems: any[]
    table: TableModel
    createdAt: string
    user: UserModel
    tableId: any
    charge: number
}
