import { CustomerModel } from '../customers/customer.model'
import { DueModel } from '../dues/due.model'
import { PaymentModel } from '../payments/payment.model'
import { SaleItemModel } from '../sales/sale-item.model'
import { UserModel } from '../users/user.model'

export interface CreditModel {
    id: number
    invoicePrefix: string
    invoiceNumber: string
    invoiceCode: string
    turnId: any
    observation: string
    customerId: any | null
    customer: CustomerModel | null
    debt: number
    user: UserModel
    createdAt: string
    charge: number
    discount: number
    igv: number
    deletedAt: string | null
    isPaid: boolean
    isCredit: boolean
    payed: number
    dues: DueModel[]
    saleItems: SaleItemModel[]
    payments: PaymentModel[]
}
