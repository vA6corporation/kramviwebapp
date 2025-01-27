export interface CreateCreditNoteModel {
    reasonCode: string
    discount: number | null
    reasonDescription: string
    observations: string
    customerId: string | null
    workerId: string | null
    emitionAt: Date
    igvPercent: number
    rcPercent: number
}
