export interface CreateCreditNoteModel {
    reasonCode: string
    discount: number | null
    reasonDescription: string
    observation: string
    customerId: number | null
    createdAt: Date
    igvPercent: number
    rcPercent: number
}
