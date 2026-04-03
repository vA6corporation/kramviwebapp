import { UserModel } from '../users/user.model'

export interface TurnModel {
    id: number
    openCash: number
    createdAt: string
    closedAt: string
    observation: string
    user: UserModel
}
