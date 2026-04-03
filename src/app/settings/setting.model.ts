import { PriceType } from '../products/price-type.enum'

export class SettingModel {
    id: number = 0
    uuid: string = ''
    defaultInvoice: string = '03'
    defaultCurrency: string = 'PEN'
    defaultIgvCode: string = '10'
    defaultTicket: string = '80MM'
    defaultSearchCustomer: string = 'RUC'
    defaultPrice: PriceType = PriceType.GLOBAL
    defaultIgvPercent: number = 18
    defaultRcPercent: number = 0
    defaultPriceListId: any | null = null
    password: string = ''
    isShowChange: boolean = false
    isShowCost: boolean = false
    isShowPrintZone: boolean = false
    isShowCurrency: boolean = false
    isShowTotalDiscount: boolean = false
    isShowTotalDiscountPercent: boolean = false
    isShowEmitionAt: boolean = false
    isShowRetainer: boolean = false
    isShowDetraction: boolean = false
    isShowCredit: boolean = false
    isShowDeliveryAt: boolean = false
    isShowEditPrice: boolean = false
    marginLeft: number = 0
    marginRight: number = 0
    textService: string = ''
    textHeader: string = ''
    textBottom: string = ''
}
