import { CustomerModel } from "../customers/customer.model";
import { DueModel } from "../dues/due.model";
import { PaymentModel } from "../payments/payment.model";
import { SaleItemModel } from "../sales/sale-item.model";
import { UserModel } from "../users/user.model";

export interface CreditModel {
  _id: string
  invoicePrefix: string
  invoiceNumber: string
  invoiceType: string
  // deliveryType: string
  turnId: string
  observations: string
  customerId: string|null
  customer: CustomerModel|null
  debt: number
  user: UserModel
  createdAt: string
  charge: number
  discount: number
  igv: number
  deletedAt: string|null
  isPaid: boolean
  isCredit: boolean
  payed: number
  dues: DueModel[]
  saleItems: SaleItemModel[]
  payments: PaymentModel[]
}
