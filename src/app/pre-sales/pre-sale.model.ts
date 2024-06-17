import { CustomerModel } from "../customers/customer.model";
import { WorkerModel } from "../workers/worker.model";
import { PreSaleItemModel } from "./pre-sale-item.model";

export interface PreSaleModel {
    _id: string
    createdAt: string
    preSaleItems: PreSaleItemModel[]
    workerId: string
    worker: WorkerModel | null
    customer: CustomerModel
    observations: string
    charge: number
}