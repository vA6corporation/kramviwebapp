import { Component, ElementRef, ViewChild } from '@angular/core';
import { PrintService } from '../print.service';
import { Subscription } from 'rxjs';
import { buildA4Invoice } from './buildA4Invoice';
import { buildTicket80mm } from './buildTicket80mm';
import { buildTicket58mm } from './buildTicket58mm';
import { buildA4CreditNote } from './buildA4CreditNote';
import { buildCommand80mm } from './buildCommand80mm';
import { buildCommand58mm } from './buildCommand58mm';
import { buildPreaccount80mm } from './buildPreaccount80mm';
import { buildPreaccount58mm } from './buildPreaccount58mm';
import { buildA4Proforma } from './buildA4Proforma';
import { buildTurn80mm } from './buildTurn80mm';
import { buildA4ProformaImage } from './buildA4ProformaImage';
import { buildA5Invoice } from './buildA5Invoice';
import { buildTurn58mm } from './buildTurn58mm';
import { buildA4PurchaseOrder } from './buildA4PurchaseOrder';
import { buildA4RemissionGuide } from './buildA4RemissionGuide';
import { buildA4Purchase } from './buildA4Purchase';
import { buildA4PaymentOrder } from './buildA4PaymentOrder';
import { buildCreditCustomer80mm } from './buildCreditCustomer80mm';
import { buildTicketProforma } from './buildTicketProforma';
import { buildEvent80mm } from './buildEvent80mm';
import { buildTicket80mmTwo } from './buildTicket80mmTwo';
import { buildBarcode110x30mm } from './buildBarcode110x30mm';
import { buildBarcode50x25mm } from './buildBarcode50x25mm';
import { buildTicketRemissionGuide } from './buildTicketRemissionGuide';
import { buildTicket80mmCreditNote } from './buildTicket80mmCreditNote';
import { buildBarcode70x30mm } from './buildBarcode70x30mm';
import { buildBarcode105x25mm } from './buildBarcode105x25mm';
import { buildBarcode70x30mmTwo } from './buildBarcode70x30mmTwo';
import { buildTicket80mmPurchaseOrder } from './buildTicket80mmPurchaseOrder';
import { PrintZoneType } from '../print-zone-type.enum';
import { buildBarcode60x30mm } from './buildBarcode60x30mm';
import { buildBarcode105x25mmTwo } from './buildBarcode105x25mmTwo';
import { AuthService } from '../../auth/auth.service';
import { PrintersService } from '../../printers/printers.service';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { BanksService } from '../../banks/banks.service';
import { PrinterModel } from '../../printers/printer.model';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { BankModel } from '../../providers/bank.model';
import { buildBarcode50x25mmTwo } from './buildBarcode50x25mmTwo';
let main: any;

if ((window as any).versions) {
    main = (window as any).versions;
}

@Component({
    selector: 'app-print-iframe',
    templateUrl: './print-iframe.component.html',
    styleUrls: ['./print-iframe.component.sass'],
    standalone: false
})
export class PrintIframeComponent {

    constructor(
        private readonly printService: PrintService,
        private readonly authService: AuthService,
        private readonly printersService: PrintersService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly banksService: BanksService,
    ) { }

    @ViewChild('printIframe')
    private printIframe!: ElementRef<HTMLIFrameElement>
    private printers: PrinterModel[] = []
    private business: BusinessModel = new BusinessModel()
    private office: OfficeModel = new OfficeModel()
    private setting: SettingModel = new SettingModel()
    private paymentMethods: PaymentMethodModel[] = []
    private banks: BankModel[] = []

    private handlePrinters$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleBanks$: Subscription = new Subscription()
    private handleIsAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePrinters$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleBanks$.unsubscribe()
        this.handleIsAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleIsAuth$ = this.authService.handleIsAuth().subscribe(authStatus => {
            if (authStatus) {
                this.handlePrinters$ = this.printersService.handlePrinters().subscribe(printers => {
                    this.printers = printers
                })

                this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
                    this.business = auth.business
                    this.office = auth.office
                    this.setting = auth.setting
                })

                this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
                    this.paymentMethods = paymentMethods
                })

                this.handleBanks$ = this.banksService.handleBanks().subscribe(banks => {
                    this.banks = banks
                })
            }
        })

        this.printersService.loadDb()

        this.printService.handlePrintTurn58mm().subscribe(values => {
            const { turn, expenses, summaryPayments, summarySaleItems } = values
            const pdf = buildTurn58mm(turn, expenses, summaryPayments, summarySaleItems, this.setting)
            if (main) {
                const file = pdf.output('arraybuffer')
                const printers = this.printers.filter(e => e.printInvoice)

                if (printers.length) {
                    for (const printer of printers) {
                        main.print(file, printer.name)
                    }
                } else {
                    main.print(file)
                }
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handlePrintTurn80mm().subscribe(values => {
            const { turn, expenses, summaryPayments, summarySaleItems } = values
            const pdf = buildTurn80mm(turn, expenses, summaryPayments, summarySaleItems, this.setting)
            if (main) {
                const file = pdf.output('arraybuffer')
                const printers = this.printers.filter(e => e.printInvoice)

                if (printers.length) {
                    for (const printer of printers) {
                        main.print(file, printer.name)
                    }
                } else {
                    main.print(file)
                }
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handlePrintA4Invoice().subscribe(async sale => {
            const pdf = await buildA4Invoice(sale, this.setting, this.business, this.office, this.banks, this.paymentMethods)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportPdfA4Invoice().subscribe(async sale => {
            const pdf = await buildA4Invoice(sale, this.setting, this.business, this.office, this.banks, this.paymentMethods)
            pdf.save(`${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)
        })

        this.printService.handlePrintA4RemissionGuide().subscribe(async remissionGuide => {
            const pdf = await buildA4RemissionGuide(remissionGuide, this.setting, this.business, this.office)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handlePrintBarcodes110x30mm().subscribe(async products => {
            const pdf = await buildBarcode110x30mm(products)
            pdf.autoPrint({ variant: 'non-conform' })
            const urlString = pdf.output('datauristring')
            this.print(urlString)
        })

        this.printService.handlePrintBarcodes105x25mm().subscribe(async products => {
            const pdf = await buildBarcode105x25mm(products)
            pdf.autoPrint({ variant: 'non-conform' })
            const urlString = pdf.output('datauristring')
            this.print(urlString)
        })

        this.printService.handlePrintBarcodes105x25mmTwo().subscribe(async products => {
            const pdf = await buildBarcode105x25mmTwo(products)
            pdf.autoPrint({ variant: 'non-conform' })
            const urlString = pdf.output('datauristring')
            this.print(urlString)
        })

        this.printService.handlePrintBarcodes70x30mm().subscribe(async products => {
            const pdf = await buildBarcode70x30mm(products)
            pdf.autoPrint({ variant: 'non-conform' })
            const urlString = pdf.output('datauristring')
            this.print(urlString)
        })

        this.printService.handlePrintBarcodes70x30mmTwo().subscribe(async products => {
            const pdf = await buildBarcode70x30mmTwo(products)
            pdf.autoPrint({ variant: 'non-conform' })
            const urlString = pdf.output('datauristring')
            this.print(urlString)
        })

        this.printService.handlePrintBarcodes60x30mm().subscribe(async products => {
            const pdf = await buildBarcode60x30mm(products)
            pdf.autoPrint({ variant: 'non-conform' })
            const urlString = pdf.output('datauristring')
            this.print(urlString)
        })

        this.printService.handlePrintBarcodes50x25mm().subscribe(async products => {
            const pdf = await buildBarcode50x25mm(products)
            pdf.autoPrint({ variant: 'non-conform' })
            const urlString = pdf.output('datauristring')
            this.print(urlString)
        })

        this.printService.handlePrintBarcodes50x25mmTwo().subscribe(async products => {
            const pdf = await buildBarcode50x25mmTwo(products)
            pdf.autoPrint({ variant: 'non-conform' })
            const urlString = pdf.output('datauristring')
            this.print(urlString)
        })

        this.printService.handleExportPdfA4RemissionGuide().subscribe(async remissionGuide => {
            const pdf = await buildA4RemissionGuide(remissionGuide, this.setting, this.business, this.office)
            pdf.save(`T${this.office.serialPrefix}-${remissionGuide.remissionGuideNumber}`)
        })

        this.printService.handleExportPdfEvent80mm().subscribe(event => {
            const pdf = buildEvent80mm(event, this.setting, this.office)
            pdf.save(`CITA_MEDICA_${event.customer.name.replace(/ /g, '_')}`)
        })

        this.printService.handleExportPdfA4PurchaseOrder().subscribe(async purchaseOrder => {
            const pdf = await buildA4PurchaseOrder(purchaseOrder, this.setting, this.business, this.office)
            pdf.save(`O${this.office.serialPrefix}-${purchaseOrder.purchaseOrderNumber}`)
        })

        this.printService.handlePrintA4PurchaseOrder().subscribe(async purchaseOrder => {
            const pdf = await buildA4PurchaseOrder(purchaseOrder, this.setting, this.business, this.office)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportPdf80mmPurchaseOrder().subscribe(async purchaseOrder => {
            const pdf = await buildTicket80mmPurchaseOrder(purchaseOrder, this.setting, this.business, this.office)
            pdf.save(`O${this.office.serialPrefix}-${purchaseOrder.purchaseOrderNumber}`)
        })

        this.printService.handlePrintTicket80mmPurchaseOrder().subscribe(async purchaseOrder => {
            const pdf = await buildTicket80mmPurchaseOrder(purchaseOrder, this.setting, this.business, this.office)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handlePrintA5Invoice().subscribe(async sale => {
            const pdf = await buildA5Invoice(sale, this.setting, this.business, this.office)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportPdfA5Invoice().subscribe(async sale => {
            const pdf = await buildA5Invoice(sale, this.setting, this.business, this.office)
            pdf.save(`${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)
        })

        this.printService.handlePrintA4Proforma().subscribe(async proforma => {
            const pdf = await buildA4Proforma(proforma, this.setting, this.business, this.office, this.banks)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportPdfA4Proforma().subscribe(async proforma => {
            const pdf = await buildA4Proforma(proforma, this.setting, this.business, this.office, this.banks)
            pdf.save(`P${this.office.serialPrefix}-${proforma.proformaNumber}`)
        })

        this.printService.handlePrintTicketProforma().subscribe(async proforma => {
            const pdf = await buildTicketProforma(proforma, this.setting, this.business, this.office, this.banks)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportPdfTicketProforma().subscribe(async proforma => {
            const pdf = await buildTicketProforma(proforma, this.setting, this.business, this.office, this.banks)
            pdf.save(`P${this.office.serialPrefix}-${proforma.proformaNumber}`)
        })

        this.printService.handlePrintA4ProformaImage().subscribe(async proforma => {
            const pdf = await buildA4ProformaImage(proforma, this.setting, this.business, this.office, this.banks)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportPdfA4ProformaImage().subscribe(async proforma => {
            const pdf = await buildA4ProformaImage(proforma, this.setting, this.business, this.office, this.banks)
            pdf.save(`P${this.office.serialPrefix}-${proforma.proformaNumber}`)
        })

        this.printService.handlePrintA4CreditNote().subscribe(async creditNote => {
            const pdf = await buildA4CreditNote(creditNote, this.setting, this.business, this.office)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportPdfTicketCreditNote().subscribe(async creditNote => {
            const pdf = await buildTicket80mmCreditNote(creditNote, this.setting, this.business, this.office)
            pdf.save(`NOTA_DE_CREDITO_${creditNote.invoicePrefix}${this.office.serialPrefix}-${creditNote.invoiceNumber}`)
        })

        this.printService.handlePrintTicketCreditNote().subscribe(async creditNote => {
            const pdf = await buildTicket80mmCreditNote(creditNote, this.setting, this.business, this.office)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportPdfA4CreditNote().subscribe(async creditNote => {
            const pdf = await buildA4CreditNote(creditNote, this.setting, this.business, this.office)
            pdf.save(`NOTA_DE_CREDITO_${creditNote.invoicePrefix}${this.office.serialPrefix}-${creditNote.invoiceNumber}`)
        })

        this.printService.handleExportPdfTicket80mm().subscribe(async sale => {
            const pdf = await buildTicket80mm(sale, this.setting, this.business, this.office, this.banks, this.paymentMethods)
            pdf.save(`${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)
        })

        this.printService.handlePrintTicket80mm().subscribe(async sale => {
            if (main) {
                const pdf = await buildTicket80mmTwo(sale, this.setting, this.business, this.office, this.paymentMethods)
                const printers = this.printers.filter(e => e.printInvoice)
                const file = pdf.output('arraybuffer')

                if (printers.length) {
                    for (const printer of printers) {
                        main.print(file, printer.name)
                    }
                } else {
                    main.print(file)
                }
            } else {
                const pdf = await buildTicket80mm(sale, this.setting, this.business, this.office, this.banks, this.paymentMethods)
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportRemissionGuidePdfTicket80mm().subscribe(async remissionGuide => {
            const pdf = await buildTicketRemissionGuide(remissionGuide, this.setting, this.business, this.office)
            pdf.save(`T${this.office.serialPrefix}-${remissionGuide.remissionGuideNumber}`)
        })

        this.printService.handlePrintRemissionGuideTicket80mm().subscribe(async remissionGuide => {
            if (main) {
                const pdf = await buildTicketRemissionGuide(remissionGuide, this.setting, this.business, this.office)
                const printers = this.printers.filter(e => e.printInvoice)
                const file = pdf.output('arraybuffer')

                if (printers.length) {
                    for (const printer of printers) {
                        main.print(file, printer.name)
                    }
                } else {
                    main.print(file)
                }
            } else {
                const pdf = await buildTicketRemissionGuide(remissionGuide, this.setting, this.business, this.office)
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportPdfTicket58mm().subscribe(async sale => {
            const pdf = await buildTicket58mm(sale, this.setting, this.business, this.office, this.paymentMethods)
            pdf.save(`${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)
        })

        this.printService.handlePrintTicket58mm().subscribe(async sale => {
            const pdf = await buildTicket58mm(sale, this.setting, this.business, this.office, this.paymentMethods)
            if (main) {
                const file = pdf.output('arraybuffer')
                const printers = this.printers.filter(e => e.printInvoice)

                if (printers.length) {
                    for (const printer of printers) {
                        main.print(file, printer.name)
                    }
                } else {
                    main.print(file)
                }
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handlePrintCommand80mm().subscribe(async board => {
            if (main) {
                const printers = this.printers
                if (printers.length) {
                    for (const printer of printers) {
                        if (printer.printKitchen) {
                            const boardItems = board.boardItems.filter(e => e.printZone === PrintZoneType.COCINA)
                            if (boardItems.length) {
                                const pdf = buildCommand80mm(board, boardItems, this.setting)
                                const file = pdf.output('arraybuffer')
                                main.print(file, printer.name)
                            }
                        }

                        if (printer.printBar) {
                            const boardItems = board.boardItems.filter(e => e.printZone === PrintZoneType.BARRA)
                            if (boardItems.length) {
                                const pdf = buildCommand80mm(board, boardItems, this.setting)
                                const file = pdf.output('arraybuffer')
                                main.print(file, printer.name)
                            }
                        }

                        if (printer.printOven) {
                            const boardItems = board.boardItems.filter(e => e.printZone === PrintZoneType.HORNO)
                            if (boardItems.length) {
                                const pdf = buildCommand80mm(board, boardItems, this.setting)
                                const file = pdf.output('arraybuffer')
                                main.print(file, printer.name)
                            }
                        }

                        if (printer.printBox) {
                            const boardItems = board.boardItems.filter(e => e.printZone === PrintZoneType.CAJA)
                            if (boardItems.length) {
                                const pdf = buildCommand80mm(board, boardItems, this.setting)
                                const file = pdf.output('arraybuffer')
                                main.print(file, printer.name)
                            }
                        }

                    }
                } else {
                    const pdf = buildCommand80mm(board, board.boardItems, this.setting)
                    const file = pdf.output('arraybuffer')
                    main.print(file)
                }
            } else {
                const pdf = buildCommand80mm(board, board.boardItems, this.setting)
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handlePrintCommand58mm().subscribe(board => {
            if (main) {
                const printers = this.printers
                if (printers.length) {
                    for (const printer of printers) {
                        if (printer.printKitchen) {
                            const boardItems = board.boardItems.filter(e => e.printZone === PrintZoneType.COCINA)
                            if (boardItems.length) {
                                const pdf = buildCommand58mm(board, boardItems, this.setting)
                                const file = pdf.output('arraybuffer')
                                main.print(file, printer.name)
                            }
                        }

                        if (printer.printBar) {
                            const boardItems = board.boardItems.filter(e => e.printZone === PrintZoneType.BARRA)
                            if (boardItems.length) {
                                const pdf = buildCommand58mm(board, boardItems, this.setting)
                                const file = pdf.output('arraybuffer')
                                main.print(file, printer.name)
                            }
                        }

                        if (printer.printOven) {
                            const boardItems = board.boardItems.filter(e => e.printZone === PrintZoneType.HORNO)
                            if (boardItems.length) {
                                const pdf = buildCommand58mm(board, boardItems, this.setting)
                                const file = pdf.output('arraybuffer')
                                main.print(file, printer.name)
                            }
                        }

                        if (printer.printBox) {
                            const boardItems = board.boardItems.filter(e => e.printZone === PrintZoneType.CAJA)
                            if (boardItems.length) {
                                const pdf = buildCommand58mm(board, boardItems, this.setting)
                                const file = pdf.output('arraybuffer')
                                main.print(file, printer.name)
                            }
                        }
                    }
                } else {
                    const pdf = buildCommand58mm(board, board.boardItems, this.setting)
                    const file = pdf.output('arraybuffer')
                    main.print(file)
                }
            } else {
                const pdf = buildCommand58mm(board, board.boardItems, this.setting)
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handlePrintPreaccount80mm().subscribe(board => {
            const pdf = buildPreaccount80mm(board, this.setting)
            if (main) {
                const file = pdf.output('arraybuffer')
                const printers = this.printers.filter(e => e.printAccount)

                if (printers.length) {
                    for (const printer of printers) {
                        main.print(file, printer.name)
                    }
                } else {
                    main.print(file)
                }
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handlePrintPreaccount58mm().subscribe(board => {
            const pdf = buildPreaccount58mm(board, this.setting)
            if (main) {
                const file = pdf.output('arraybuffer')
                const printers = this.printers.filter(e => e.printAccount)

                if (printers.length) {
                    for (const printer of printers) {
                        main.print(file, printer.name)
                    }
                } else {
                    main.print(file)
                }
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handlePrintPurchaseA4().subscribe(async purchase => {
            const pdf = await buildA4Purchase(purchase, this.setting, this.business, this.office)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportPdfPurchaseA4().subscribe(async purchase => {
            const pdf = await buildA4Purchase(purchase, this.setting, this.business, this.office)
            pdf.save(`COMPRA_${purchase.serie || 'SIN_SERIE'}`)
        })

        this.printService.handlePrintPaymentOrderA4().subscribe(async paymentOrder => {
            const pdf = await buildA4PaymentOrder(paymentOrder, this.setting, this.business, this.office)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportPaymentOrderA4().subscribe(async paymentOrder => {
            const pdf = await buildA4PaymentOrder(paymentOrder, this.setting, this.business, this.office)
            pdf.save(`ORDEN_DE_PAGO_${paymentOrder.paymentOrderNumber}`)
        })

        this.printService.handlePrintCreditCustomer80mm().subscribe(async values => {
            const { customer, credits } = values
            const pdf = await buildCreditCustomer80mm(customer, credits, this.setting)
            if (main) {
                const file = pdf.output('arraybuffer')
                main.print(file)
            } else {
                pdf.autoPrint({ variant: 'non-conform' })
                const urlString = pdf.output('datauristring')
                this.print(urlString)
            }
        })

        this.printService.handleExportPdfCreditCustomer80mm().subscribe(async values => {
            const { customer, credits } = values
            const pdf = await buildCreditCustomer80mm(customer, credits, this.setting)
            pdf.save(`ESTADO_DE_CUENTA_${customer.name}`)
        })
    }

    print(urlString: string) {
        this.printIframe.nativeElement.contentWindow?.location.replace(urlString)
    }

}
