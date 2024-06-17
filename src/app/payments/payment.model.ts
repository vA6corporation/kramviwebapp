import { PaymentMethodModel } from "../payment-methods/payment-method.model";
import { SaleModel } from "../sales/sale.model";
import { UserModel } from "../users/user.model";

export interface PaymentModel {
    _id: string
    charge: number
    paymentMethodId: string
    currencyType: string
    deletedAt: string | null
    sale: SaleModel
    saleId: string
    isPaid: string
    turnId: string
    createdAt: string
    observations: string
    dueDate: string
    user: UserModel
    paymentMethod: PaymentMethodModel
}