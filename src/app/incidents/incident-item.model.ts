import { ProductModel } from '../products/product.model'
import { UserModel } from '../users/user.model'
import { IncidentModel } from './incident.model'

export interface IncidentItemModel {
    id: number
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
    incidentId: number
    productId: number
    createdAt: string
    incident: IncidentModel
    user: UserModel
    type?: string
}
