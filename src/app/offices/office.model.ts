import { ActiveModuleModel } from '../auth/active-module.model'
import { SettingModel } from '../settings/setting.model'

export class OfficeModel {
    id: number = 0
    name: string = ''
    tradeName: string = ''
    address: string = ''
    serialPrefix: string = ''
    codigoAnexo: string = ''
    phone: string = ''
    activityId: any = 0
    activityName: string = ''
    setting: SettingModel = new SettingModel()
    activeModule: ActiveModuleModel = {}
}
