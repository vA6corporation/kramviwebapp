import { UserModel } from '../users/user.model'

export interface ExpenseModel {
    id: number
    turnId: any
    concept: string
    charge: number
    createdAt: string
    user: UserModel
}
