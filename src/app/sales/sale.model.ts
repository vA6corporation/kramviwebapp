import { DetractionModel } from "../biller/detraction.model";
import { BoardModel } from "../boards/board.model";
import { CustomerModel } from "../customers/customer.model";
import { DueModel } from "../dues/due.model";
import { SpecialtyModel } from "../events/specialty.model";
import { CdrModel } from "../invoices/cdr.model";
import { TicketModel } from "../invoices/ticket.model";
import { PaymentModel } from "../payments/payment.model";
import { UserModel } from "../users/user.model";
import { WorkerModel } from "../workers/worker.model";
import { InvoiceType } from "./invoice-type.enum";
import { SaleItemModel } from "./sale-item.model";

export interface SaleModel {
    _id: string
    isBiller: boolean
    addressIndex: number
    invoicePrefix: string
    invoiceNumber: string
    invoiceCode: string
    invoiceType: InvoiceType
    turnId: string
    observations: string
    customerId: string | null
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
    deliveryAt: any
    isDelivery: boolean

    payments: PaymentModel[]
    saleItems: SaleItemModel[]
    detraction: DetractionModel | null
    dues: DueModel[];
    board: BoardModel | null
    cdr: CdrModel | null
    ticket: TicketModel | null
    worker: WorkerModel | null
    referred: WorkerModel | null
    specialty: SpecialtyModel | null

    userId: string
    workerId: string | null
    referredId: string | null
    specialtyId: string | null

    index?: number
    isRetainer: boolean
    createdAt: string
    emitionAt: string
    updatedAt: string
    businessId: string
}
