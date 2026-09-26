import { ActiveModuleModel } from '../auth/active-module.model'
import { OfficeModel } from '../offices/office.model'

export class UserModel {
    id: number = 0
    name: string = ''
    email: string = ''
    password: string = ''
    isAdmin: boolean = false
    activeModule: ActiveModuleModel = {}
    officeId: any | null = null
    office: OfficeModel | null = null
}
