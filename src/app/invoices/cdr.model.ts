import { SaleModel } from "../sales/sale.model";

export interface CdrModel {
    _id: string,
    sunatCode: string
    sunatMessage: string
    sunatNotes: string[]
    sale: SaleModel
}