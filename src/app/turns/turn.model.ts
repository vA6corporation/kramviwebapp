import { UserModel } from "../users/user.model";

export interface TurnModel {
  _id: string
  openCash: number
  createdAt: string
  closedAt: string
  observations: string
  user: UserModel
}