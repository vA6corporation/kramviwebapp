import { CarrierModel } from "../carriers/carrier.model";
import { CustomerModel } from "../customers/customer.model";
import { SaleModel } from "../sales/sale.model";
import { UserModel } from "../users/user.model";
import { CdrRgModel } from "./cdr-rg.model";
import { RemissionGuideItemModel } from "./remission-guide-item.model";

export interface RemissionGuideModel {
    _id: string
    addressIndex: number
    remissionGuideNumber: number
    reasonDescription: string
    originAddress: string
    destinyAddress: string
    createdAt: string
    transportAt: string
    shippingWeight: number
    saleId: string | null
    observations: string
    remissionGuideItems: RemissionGuideItemModel[]
    carrier: CarrierModel | null
    customer: CustomerModel | null
    user: UserModel
    sale: SaleModel | null
    deletedAt: string | null
    cdr: CdrRgModel
}