import { Component, inject } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription, lastValueFrom } from 'rxjs'
import { CreateSaleItemModel } from '../create-sale-item.model'
import { CreateSaleModel } from '../create-sale.model'
import { DialogOutStockComponent } from '../dialog-out-stock/dialog-out-stock.component'
import { SaleForm } from '../sale.form'
import { SaleModel } from '../sale.model'
import { SalesService } from '../sales.service'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { TurnsService } from '../../turns/turns.service'
import { PrintService } from '../../print/print.service'
import { AuthService } from '../../auth/auth.service'
import { CreatePaymentModel } from '../../payments/create-payment.model'
import { CustomerModel } from '../../customers/customer.model'
import { SettingModel } from '../../settings/setting.model'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { TurnModel } from '../../turns/turn.model'
import { UserModel } from '../../users/user.model'
import { DialogCreateTurnsComponent } from '../../turns/dialog-create-turns/dialog-create-turns.component'
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component'
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component'
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { SaleItemsComponent } from '../sale-items/sale-items.component'
import { DirectivesModule } from '../../directives/directives.module'
import { IgvCode } from '../igv-code.enum'

@Component({
    selector: 'app-charge-from',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, SaleItemsComponent, DirectivesModule],
    templateUrl: './charge-from.component.html',
    styleUrls: ['./charge-from.component.sass']
})
export class ChargeFromComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly salesService = inject(SalesService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly turnsService = inject(TurnsService)
    private readonly printService = inject(PrintService)
    private readonly authService = inject(AuthService)

    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '00',
        currencyCode: 'PEN',
        observation: '',
        discount: null,
        deliveryAt: null,
        createdAt: null,
        cash: null,
        isRetainer: false,

        paymentMethodId: ['', Validators.required],
    })

    payments: CreatePaymentModel[] = []
    saleItems: CreateSaleItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    cash: number = 0
    cashChange: number = 0
    invoiceCodes = [
        { code: '00', name: 'NOTA DE VENTA' },
        { code: '03', name: 'BOLETA' },
        { code: '01', name: 'FACTURA' },
    ]
    setting = new SettingModel()
    paymentMethods: PaymentMethodModel[] = []
    private params: Params = {}
    private turn: TurnModel | null = null
    private user: UserModel = new UserModel()

    private handleClickMenu$: Subscription = new Subscription()
    private handleOpenTurn$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleOpenTurn$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Cobrar')

        const { saleIds } = this.activatedRoute.snapshot.queryParams
        const promises: Promise<SaleModel>[] = []
        for (const saleId of saleIds) {
            const promise = lastValueFrom(this.salesService.getSaleById(saleId))
            promises.push(promise)
        }

        this.navigationService.loadBarStart()

        Promise.all(promises).then(sales => {
            this.navigationService.loadBarFinish()
            const saleItems = sales.map(e => e.saleItems).flat()
            this.salesService.setSaleItems(saleItems)
        })

        this.navigationService.setMenu([
            { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: this.paymentMethods[0]?.id })
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
            this.setting = auth.setting

            this.handleOpenTurn$ = this.turnsService.handleOpenTurn(auth.setting.isOfficeTurn).subscribe(turn => {
                this.turn = turn
                if (turn === null) {
                    this.matDialog.open(DialogCreateTurnsComponent, {
                        width: '600px',
                        position: { top: '20px' }
                    })
                }
            })

            if (this.setting.isShowDeliveryAt) {
                this.formGroup.get('deliveryAt')?.setValidators([Validators.required])
                this.formGroup.get('delivaryAt')?.updateValueAndValidity()
                this.formGroup.get('deliveryAt')?.patchValue(new Date())
            }

            if (this.setting.isShowDeliveryAt) {
                this.formGroup.get('deliveryAt')?.setValidators([Validators.required])
                this.formGroup.get('deliveryAt')?.updateValueAndValidity()
            }

            if (this.setting.isShowEmitionAt) {
                this.formGroup.get('createdAt')?.patchValue(new Date())
                this.formGroup.get('createdAt')?.setValidators([Validators.required])
                this.formGroup.get('createdAt')?.updateValueAndValidity()
            }

            this.formGroup.get('invoiceCode')?.patchValue(this.setting.defaultInvoice)
            this.formGroup.get('currencyCode')?.patchValue(this.setting.defaultCurrency)
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_customer':
                    const dialogRef = this.matDialog.open(DialogSearchCustomersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.setting.defaultSearchCustomer
                    })

                    dialogRef.afterClosed().subscribe(customer => {
                        if (customer) {
                            this.customer = customer
                        }
                    })

                    dialogRef.componentInstance.handleCreateCustomer().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateCustomersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(customer => {
                            if (customer) {
                                this.customer = customer
                            }
                        })
                    })
                    break

                case 'split_payment':
                    if (this.turn) {
                        const data: DialogSplitPaymentsData = {
                            turnId: this.turn.id,
                            charge: this.charge,
                            payments: this.payments,
                        }

                        const dialogRef = this.matDialog.open(DialogSplitPaymentsComponent, {
                            width: '600px',
                            position: { top: '20px' },
                            data,
                        })

                        dialogRef.afterClosed().subscribe(payments => {
                            if (payments) {
                                this.payments = payments
                                if (payments.length) {
                                    this.formGroup.get('paymentMethodId')?.disable()
                                } else {
                                    this.formGroup.get('paymentMethodId')?.enable()
                                }
                            }
                        })
                    }
                    break
                default:
                    break
            }
        })

        this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
            this.saleItems = saleItems
            this.charge = 0
            for (const saleItem of this.saleItems) {
                if (saleItem.igvCode !== IgvCode.BONIFICACION) {
                    this.charge += saleItem.price * saleItem.quantity
                }
            }
        })
    }

    addCash(cash: number) {
        this.cash = Number(this.cash)
        this.cash += cash
        const diff = Number(this.cash) - Number(this.charge)
        this.cashChange = Number(diff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    setCash(cash: any) {
        this.cash = cash
        const diff = Number(this.cash) - Number(this.charge)
        this.cashChange = Number(diff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }

    onChangeDiscount() {
        const { discount } = this.formGroup.value
        this.charge = 0
        for (const saleItem of this.saleItems) {
            if (saleItem.igvCode !== IgvCode.BONIFICACION) {
                this.charge += saleItem.price * saleItem.quantity
            }
        }
        this.charge -= discount
    }

    resetCash() {
        this.cash = 0
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    onSubmit() {
        try {
            if (!this.formGroup.valid) {
                throw new Error("Complete los campos")
            }

            if (!this.saleItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.saleItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            if (this.turn === null) {
                this.matDialog.open(DialogCreateTurnsComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })
                throw new Error("Debes aperturar una caja")
            }

            const saleForm: SaleForm = this.formGroup.value

           // const createdSale: CreateSaleModel = {
           //     invoiceCode: saleForm.invoiceCode,
           //     paymentMethodId: saleForm.paymentMethodId,
           //     observation: saleForm.observation,
           //     currencyCode: saleForm.currencyCode || 'PEN',
           //     discount: saleForm.discount,
           //     deliveryAt: saleForm.deliveryAt,
           //     createdAt: saleForm.createdAt,
           //     cash: saleForm.cash,
           //     isRetainer: saleForm.isRetainer,
           //     isDelivery: saleForm.isDelivery,

           //     turnId: this.turn.id,
           //     customerId: this.customer ? this.customer.id : null,

           //     igvPercent: this.setting.defaultIgvPercent,
           //     rcPercent: this.setting.defaultRcPercent
           // }

           // if (createdSale.invoiceCode === InvoiceCode.FACTURA && this.customer === null) {
           //     throw new Error("Agrega un cliente")
           // }

           // if (createdSale.invoiceCode === InvoiceCode.FACTURA && this.customer !== null && this.customer.documentType !== 'RUC') {
           //     throw new Error("El cliente debe tener un RUC")
           // }

           // this.isLoading = true
           // this.navigationService.loadBarStart()

           // this.salesService.createSale(
           //     createdSale,
           //     this.saleItems,
           //     this.payments,
           //     null,
           //     this.params
           // ).subscribe({
           //     next: sale => {
           //         let payments: CreatePaymentModel[] = []

           //         if (this.payments.length) {
           //             payments = this.payments
           //         } else {
           //             payments[0] = {
           //                 paymentMethodId: createdSale.paymentMethodId || '',
           //                 charge: sale.charge,
           //                 turnId: sale.turnId,
           //                 createdAt: new Date(),
           //             }
           //         }

           //         Object.assign(sale, {
           //             user: this.user,
           //             customer: this.customer,
           //             saleItems: this.saleItems,
           //             payments,
           //         })

           //         switch (this.setting.defaultTicket) {
           //             case 'A4':
           //                 this.printService.printA4Invoice(sale)
           //             break
           //             case 'A5':
           //                 this.printService.printA5Invoice(sale)
           //             break
           //             case '80MM':
           //                 this.printService.printTicket80mm(sale)
           //             break
           //             default:
           //                 this.printService.printTicket58mm(sale)
           //             break
           //         }

           //         this.salesService.setSaleItems([])
           //         this.router.navigate(['/invoices'])
           //         this.isLoading = false
           //         this.navigationService.loadBarFinish()
           //         this.navigationService.showMessage('Registrado correctamente')
           //     }, error: (error: HttpErrorResponse) => {
           //         this.navigationService.showMessage(error.error.message)
           //         this.isLoading = false
           //         this.navigationService.loadBarFinish()
           //     }
           // })
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
            this.isLoading = false
            this.navigationService.loadBarFinish()
        }
    }

    onEditCustomer() {
        const dialogRef = this.matDialog.open(DialogEditCustomersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.customer,
        })

        dialogRef.afterClosed().subscribe(customer => {
            if (customer) {
                this.customer = customer
            }
        })
    }

}
