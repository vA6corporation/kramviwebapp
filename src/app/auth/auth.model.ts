import { ModuleModel } from "../navigation/module.model";
import { UserModel } from "../users/user.model";
import { BusinessModel } from "./business.model";
import { OfficeModel } from "./office.model";
import { SettingModel } from "./setting.model";

export interface AuthModel {
    user: UserModel
    business: BusinessModel
    office: OfficeModel
    setting: SettingModel
    modules: ModuleModel[]
}