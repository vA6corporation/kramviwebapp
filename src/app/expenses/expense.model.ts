import { UserModel } from "../users/user.model"

export interface ExpenseModel {
  _id: string
  turnId: string
  concept: string
  charge: number
  createdAt: string
  user: UserModel
}