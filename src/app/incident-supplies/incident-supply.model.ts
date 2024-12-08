import { UserModel } from "../users/user.model";
import { IncidentSupplyItemModel } from "./incident-supply-item.model";

export interface IncidentSupplyModel {
    observations: string
    incidentType: string
    createdAt: string
    incidentSupplyItems: IncidentSupplyItemModel[]
    user: UserModel
}