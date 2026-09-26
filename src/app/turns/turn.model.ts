import { UserModel } from '../users/user.model'

export interface TurnModel {
    id: number
    openCash: number
    createdAt: string
    deletedAt: string
    observation: string
    user: UserModel
}
