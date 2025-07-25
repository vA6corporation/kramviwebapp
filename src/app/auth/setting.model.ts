import { PriceType } from "../products/price-type.enum"

export class SettingModel {
    _id: string = ''
    password: string | null = null
    defaultPrice: PriceType = PriceType.GLOBAL
    defaultPriceListId: string | null = null
    defaultInvoice: string = 'BOLETA'
    defaultDelivery: string = 'ESTABLECIMIENTO'
    defaultCurrencyCode: string = 'PEN'
    defaultSearchCustomer: string = 'NOMBRES'
    showQrCode: boolean = false
    showAddressOnTicket: boolean = false
    showQrOnTicket: boolean = false
    showIsRetainer: boolean = false
    showDetraction: boolean = false
    showChange: boolean = false
    showCost: boolean = false
    showCurrencyCode: boolean = false
    showObservationItems: boolean = false
    showSpecialty: boolean = false
    showChargeCommand: boolean = false
    showWorker: boolean = false
    showTotalDiscount: boolean = false
    showTotalDiscountPercent: boolean = false
    showReferred: boolean = false
    showDeliveryAt: boolean = false
    showEmitionAt: boolean = false
    isBlockChangeBoard: boolean = false
    isBlockPrintCommand: boolean = false
    isBlockEditProducts: boolean = false
    hideIgvTicket: boolean = false
    isConsumption: boolean = false
    isOfficeTurn: boolean = false
    printOrder: boolean = true
    allowCredit: boolean = false
    allowCreditLimit: boolean = false
    allowFreePrice: boolean = false
    allowFreeStock: boolean = false
    defaultIgvPercent: number = 18
    defaultRcPercent: number = 0
    showSubPrice: boolean = false
    allowBonus: boolean = false
    papelImpresion: string = 'ticket80mm'
    marginLeft: number = 0
    marginRight: number = 0
    logo: string = ""
    banner: string = ""
    header: string = ""
    showPrintZone: boolean = false
    closeSession: boolean = false
    descriptionService: string = ''
    textHeader: string = ''
    textSale: string = ''
    textSaleTwo: string = ''
    isAttentionTicket: boolean = false
    defaultIgvCode: string = ''
}
