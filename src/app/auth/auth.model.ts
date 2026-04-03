import { UserModel } from '../users/user.model'
import { BusinessModel } from '../businesses/business.model'
import { OfficeModel } from '../offices/office.model'
import { SettingModel } from '../settings/setting.model'
import { ActiveModuleModel } from '../auth/active-module.model'

export interface AuthModel {
    user: UserModel
    business: BusinessModel
    office: OfficeModel
    setting: SettingModel
    activeModule: ActiveModuleModel
    //modules: ModuleModel[]
}
