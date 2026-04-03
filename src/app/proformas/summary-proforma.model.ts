import { UserModel } from '../users/user.model'

export interface SummaryProformaModel {
    id: number
    user: UserModel
    totalCharge: number
    count: number
}
