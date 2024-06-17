import { ActiveModuleModel } from "./active-module.model"
import { SettingModel } from "./setting.model"

export class OfficeModel {
    _id: string = ''
    name: string = ''
    tradeName: string = ''
    address: string = ''
    serialPrefix: string = ''
    codigoAnexo: string = ''
    mobileNumber: string = ''
    activityId: string = ''
    activityName: string = ''
    setting: SettingModel = new SettingModel()
    activeModule: ActiveModuleModel = {}
}
