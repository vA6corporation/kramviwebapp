import { UserModel } from "../users/user.model"
import { IncidentItemModel } from "./incident-item.model"

export interface IncidentModel {
    createdAt: string
    incidentItems: IncidentItemModel[]
    incidentType: string
    observations: string
    user: UserModel
}
