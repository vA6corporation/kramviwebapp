import { PaymentMethodModel } from '../payment-methods/payment-method.model'
import { SaleModel } from '../sales/sale.model'
import { UserModel } from '../users/user.model'

export interface PaymentModel {
    id: number
    charge: number
    paymentMethodId: any
    currencyType: string
    deletedAt: string | null
    sale: SaleModel
    saleId: any
    isPaid: boolean
    turnId: any
    createdAt: string
    observation: string
    dueDate: string
    user: UserModel
    paymentMethod: PaymentMethodModel
}
