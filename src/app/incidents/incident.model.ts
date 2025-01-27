import { UserModel } from "../users/user.model"
import { IncidentItemModel } from "./incident-item.model"

export interface IncidentModel {
    createdAt: string
    incidentOutItems: IncidentItemModel[]
    incidentInItems: IncidentItemModel[]
    observations: string
    user: UserModel
}
