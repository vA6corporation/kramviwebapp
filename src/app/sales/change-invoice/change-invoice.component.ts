import { Component, inject } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { CustomerModel } from '../../customers/customer.model'
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component'
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component'
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { CreatePaymentModel } from '../../payments/create-payment.model'
import { PaymentModel } from '../../payments/payment.model'
import { PrintService } from '../../print/print.service'
import { IgvCode } from '../../sales/igv-code.enum'
import { CreateSaleItemModel } from '../../sales/create-sale-item.model'
import { CreateSaleModel } from '../../sales/create-sale.model'
import { SaleForm } from '../../sales/sale.form'
import { SaleModel } from '../../sales/sale.model'
import { SalesService } from '../../sales/sales.service'
import { DialogCreateTurnsComponent } from '../../turns/dialog-create-turns/dialog-create-turns.component'
import { TurnModel } from '../../turns/turn.model'
import { TurnsService } from '../../turns/turns.service'
import { UserModel } from '../../users/user.model'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { InvoiceCode } from '../invoice-code.enum'

@Component({
    selector: 'app-change-invoice',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './change-invoice.component.html',
    styleUrls: ['./change-invoice.component.sass']
})
export class ChangeInvoiceComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly salesService = inject(SalesService)
    private readonly turnsService = inject(TurnsService)
    private readonly printService = inject(PrintService)
    private readonly authService = inject(AuthService)

    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '01',
        observation: ['', Validators.required],
    })
    igvCode = IgvCode
    saleItems: CreateSaleItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    payments: PaymentModel[] = []
    private saleId: string = ''
    private sale: SaleModel | null = null
    private turn: TurnModel | null = null
    private setting = new SettingModel()
    private office = new OfficeModel()
    private user: UserModel = new UserModel()

    invoiceCodes = [
        { code: '03', name: 'BOLETA' },
        { code: '01', name: 'FACTURA' },
    ]
    paymentMethods: PaymentMethodModel[] = []

    private handleClickMenu$: Subscription = new Subscription()
    private handleOpenTurn$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy(): void {
        this.handleClickMenu$.unsubscribe()
        this.handleOpenTurn$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
            this.office = auth.office
            this.setting = auth.setting

            this.handleOpenTurn$ = this.turnsService.handleOpenTurn().subscribe(turn => {
                this.turn = turn
                if (turn === null) {
                    this.matDialog.open(DialogCreateTurnsComponent, {
                        width: '600px',
                        position: { top: '20px' }
                    })
                }
            })
        })

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: this.paymentMethods[0]?.id || null })
        })

        this.saleId = this.activatedRoute.snapshot.params['saleId']
        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            this.formGroup.get('observation')?.patchValue(`canje nota de venta ${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)
            this.sale = sale
            this.payments = sale.payments
            this.salesService.setSale(sale)
            this.salesService.setSaleItems(sale.saleItems)
            this.navigationService.setTitle(`Canjear ${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)

            this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
                this.saleItems = saleItems
            })
        })

        this.navigationService.setMenu([
            { id: 'add_customer', label: 'Desc Excel', icon: 'person_add', show: true },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            const dialogRef = this.matDialog.open(DialogSearchCustomersComponent, {
                width: '600px',
                position: { top: '20px' },
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
        })

        this.formGroup.get('invoiceCode')?.patchValue(this.setting.defaultInvoice)

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

    onSubmit() {
        try {
            if (this.turn === null) {
                this.matDialog.open(DialogCreateTurnsComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })
                throw new Error("Debes aperturar una caja")
            }

            if (!this.formGroup.valid) {
                throw new Error("Complete los campos")
            }

            if (this.sale === null) {
                throw new Error("La venta no existe")
            }

            if (!this.saleItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.saleItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            const formData: SaleForm = this.formGroup.value

            const createdSale: CreateSaleModel = {
                invoiceCode: formData.invoiceCode,
                observation: formData.observation,
                paymentMethodId: this.paymentMethods[0]?.id || null,
                cash: null,
                currencyCode: this.sale.currencyCode,
                discount: this.sale.discount,
                deliveryAt: null,
                isRetainer: false,
                isDelivery: false,
                createdAt: null,
                igvPercent: this.setting.defaultIgvPercent,
                rcPercent: this.setting.defaultRcPercent,
                turnId: this.turn.id,
                customerId: this.customer ? this.customer.id : null,
            }

            if (createdSale.invoiceCode === InvoiceCode.FACTURA && this.customer === null) {
                throw new Error("Agrega un cliente")
            }

            if (createdSale.invoiceCode === InvoiceCode.FACTURA && this.customer !== null && this.customer.documentType !== 'RUC') {
                throw new Error("El cliente debe tener un RUC")
            }

            this.isLoading = true
            this.navigationService.loadBarStart()

            this.salesService.changeSale(createdSale, this.saleId, createdSale.observation).subscribe({
                next: sale => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    let payments: CreatePaymentModel[] = []

                    if (this.payments.length) {
                        payments = this.payments
                    } else {
                        payments[0] = {
                            paymentMethodId: createdSale.paymentMethodId || '',
                            charge: sale.charge,
                            turnId: sale.turnId,
                            createdAt: new Date()
                        }
                    }

                    Object.assign(sale, {
                        user: this.user,
                        customer: this.customer,
                        saleItems: this.saleItems,
                        payments,
                    })

                    switch (this.setting.defaultTicket) {
                        case 'A4':
                            this.printService.printA4Invoice(sale)
                            break
                        case '80MM':
                            this.printService.printTicket80mm(sale)
                            break
                        default:
                            this.printService.printTicket58mm(sale)
                            break
                    }

                    this.salesService.setSaleItems([])
                    this.router.navigate(['/invoices'])
                    this.navigationService.showMessage('Canjeado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
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
