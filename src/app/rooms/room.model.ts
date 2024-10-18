import { IgvType } from "../products/igv-type.enum"
import { ReceptionModel } from "../receptions/reception.model"

export interface RoomModel {
    _id: string
    name: string
    roomNumber: string
    beds: number
    description: string
    price: number
    reception: ReceptionModel | null
    isReserved: boolean
    igvCode: IgvType
}