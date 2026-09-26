import { DetractionModel } from '../sales/detraction.model'
import { BoardModel } from '../boards/board.model'
import { CustomerModel } from '../customers/customer.model'
import { DueModel } from '../dues/due.model'
import { CdrModel } from '../sales/cdr.model'
import { TicketModel } from '../sales/ticket.model'
import { PaymentModel } from '../payments/payment.model'
import { UserModel } from '../users/user.model'
import { SaleItemModel } from './sale-item.model'
import { InvoiceCode } from './invoice-code.enum'

export interface SaleModel {
    id: number
    isBiller: boolean
    invoicePrefix: string
    invoiceNumber: number
    invoiceName: string
    invoiceCode: InvoiceCode
    turnId: any
    observation: string
    customerId: any | null
    customer: CustomerModel | null
    user: UserModel
    charge: number
    chargeLetters: string
    gravado: number
    gratuito: number
    exonerado: number
    inafecto: number
    isPaid: boolean
    isCredit: boolean
    igv: number
    rc: number
    igvPercent: number
    rcPercent: number
    deletedAt: string | null
    deletedReason: string
    expirationAt: Date
    cash: number
    currencyCode: string
    discount: number | null
    payed: number

    payments: PaymentModel[]
    saleItems: SaleItemModel[]
    detraction: DetractionModel | null
    dues: DueModel[];
    board: BoardModel | null
    cdr: CdrModel | null
    ticket: TicketModel | null

    userId: any

    isRetainer: boolean
    createdAt: string
    updatedAt: string
    businessId: any
}
