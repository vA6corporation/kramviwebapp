import { UserModel } from '../users/user.model'
import { IncidentItemModel } from './incident-item.model'

export interface IncidentModel {
    createdAt: string
    outIncidentItems: IncidentItemModel[]
    inIncidentItems: IncidentItemModel[]
    observation: string
    user: UserModel
}
