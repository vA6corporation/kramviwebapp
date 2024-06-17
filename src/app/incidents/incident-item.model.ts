import { ProductModel } from "../products/product.model"
import { UserModel } from "../users/user.model"
import { IncidentModel } from "./incident.model"

export interface IncidentItemModel {
    _id: string
    name: string
    sku: string | null
    fullName: string
    product: ProductModel
    cost: number
    price: number
    quantity: number
    preIgvCode: string
    igvCode: string
    unitCode: string
    incidentId: string
    productId: string
    createdAt: string
    incident: IncidentModel
    user: UserModel
}
