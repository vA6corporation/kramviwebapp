import { CustomerModel } from '../customers/customer.model'
import { TicketModel } from '../sales/ticket.model'
import { SaleModel } from '../sales/sale.model'
import { UserModel } from '../users/user.model'
import { CdrNcModel } from './cdr-nc.model'
import { CreditNoteItemModel } from './credit-note-item.model'
import { InvoiceCode } from '../sales/invoice-code.enum'

export interface CreditNoteModel {
    id: number
    reason: string
    reasonCode: string
    reasonDescription: string
    charge: number
    invoiceCode: InvoiceCode
    invoiceNumber: number
    invoicePrefix: string
    invoiceName: string
    user: UserModel
    creditNoteItems: CreditNoteItemModel[]
    customer: CustomerModel | null
    sale: SaleModel

    gravado: number
    gratuito: number
    exonerado: number
    inafecto: number

    igv: number
    rc: number
    discount: number
    igvPercent: number
    rcPercent: number
    currencyCode: string
    createdAt: string

    observation: string
    chargeLetters: string

    cdr: CdrNcModel
    ticket: TicketModel

    deletedAt: string | null
}
