import { SaleModel } from './sale.model'

export interface CdrModel {
    id: number
    sunatCode: string
    sunatMessage: string
    sunatNotes: string[]
    sale: SaleModel
}
