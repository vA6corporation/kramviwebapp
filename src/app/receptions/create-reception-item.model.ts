import { IgvType } from "../products/igv-type.enum";

export interface CreateReceptionItemModel {
    fullName: string
    onModel: string
    price: number
    quantity: number
    preIgvCode: IgvType
    igvCode: IgvType
    productId: string
}
