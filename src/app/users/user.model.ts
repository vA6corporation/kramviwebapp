import { ActiveModuleModel } from "../auth/active-module.model"
import { OfficeModel } from "../auth/office.model"

export class UserModel {
  _id: string = ''
  name: string = ''
  email: string = ''
  password: string = ''
  isAdmin: boolean = false
  privileges: ActiveModuleModel = {}
  assignedOfficeId: string|null = null
  assignedOffice: OfficeModel|null = null
}
