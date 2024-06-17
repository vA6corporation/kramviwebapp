import { OfficeModel } from "../auth/office.model"
import { UserModel } from "../users/user.model"
import { MoveItemModel } from "./move-item.model"

export interface MoveModel {
  _id: string
  toOffice: OfficeModel
  office: OfficeModel
  toOfficeId: string
  officeId: string
  observations: string
  createdAt: string
  moveItems: MoveItemModel[]
  user: UserModel
}