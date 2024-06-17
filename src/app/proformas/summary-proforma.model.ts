import { UserModel } from "../users/user.model"

export interface SummaryProformaModel {
  _id: string
  user: UserModel
  totalCharge: number
  count: number
}
