import { CustomerModel } from "../customers/customer.model";
import { TicketModel } from "../invoices/ticket.model";
import { SaleModel } from "../sales/sale.model";
import { UserModel } from "../users/user.model";
import { WorkerModel } from "../workers/worker.model";
import { CdrNcModel } from "./cdr-nc.model";
import { CreditNoteItemModel } from "./credit-note-item.model";

export interface CreditNoteModel {
    _id: string
    reason: string
    reasonCode: string
    reasonDescription: string
    charge: number
    invoiceNumber: number
    invoicePrefix: string
    invoiceType: string
    user: UserModel
    creditNoteItems: CreditNoteItemModel[]
    customer: CustomerModel | null
    workerId: string | null
    worker: WorkerModel | null
    sale: SaleModel

    gravado: number
    gratuito: number
    exonerado: number
    inafecto: number

    igv: number
    currencyCode: string
    createdAt: string
    emitionAt: string

    observations: string
    chargeLetters: string

    cdr: CdrNcModel
    ticket: TicketModel

    deletedAt: string | null
}
