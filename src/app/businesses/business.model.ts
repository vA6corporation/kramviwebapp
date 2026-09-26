import { OfficeModel } from '../offices/office.model'

export enum BusinessType {
    STORE = 'STORE',
    FOOD = 'FOOD',
}

export class BusinessModel {
    id: number = 0
    name: string = ''
    ruc: string = ''
    userId: any = ''
    groupId: any = ''
    offices: OfficeModel[] = []
    paymentAt: string = ''
    certificateId: any = ''
    createdAt: string = ''
    usuarioSol: string = ''
    claveSol: string = ''
    clientId: any = ''
    clientSecret: string = ''
    paymentGroup: string = ''
    businessType: BusinessType = BusinessType.STORE
}
