import { OfficeModel } from "./office.model";

export enum BusinessType {
    TIENDA = 'TIENDA',
    RESTAURANTE = 'RESTAURANTE',
    HOTEL = 'HOTEL'
}

export class BusinessModel {
    _id: string = ''
    businessName: string = ''
    tradeName: string = ''
    ruc: string = ''
    email: string = ''
    userId: string = ''
    groupId: string = ''
    offices: OfficeModel[] = []
    paymentAt: string = ''
    certificateId: string = ''
    createdAt: string = ''
    usuarioSol: string = ''
    claveSol: string = ''
    clientId: string = ''
    clientSecret: string = ''
    paymentGroup: string = ''
    businessType: BusinessType = BusinessType.TIENDA
}
