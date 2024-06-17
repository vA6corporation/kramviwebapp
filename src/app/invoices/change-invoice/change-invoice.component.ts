import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { CreatePaymentModel } from '../../payments/create-payment.model';
import { PaymentModel } from '../../payments/payment.model';
import { PrintService } from '../../print/print.service';
import { IgvType } from '../../products/igv-type.enum';
import { CreateSaleItemModel } from '../../sales/create-sale-item.model';
import { CreateSaleModel } from '../../sales/create-sale.model';
import { SaleForm } from '../../sales/sale.form';
import { SaleModel } from '../../sales/sale.model';
import { SalesService } from '../../sales/sales.service';
import { DialogTurnsComponent } from '../../turns/dialog-turns/dialog-turns.component';
import { TurnModel } from '../../turns/turn.model';
import { TurnsService } from '../../turns/turns.service';
import { UserModel } from '../../users/user.model';

@Component({
    selector: 'app-change-invoice',
    templateUrl: './change-invoice.component.html',
    styleUrls: ['./change-invoice.component.sass']
})
export class ChangeInvoiceComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly salesService: SalesService,
        private readonly turnsService: TurnsService,
        private readonly matDialog: MatDialog,
        private readonly printService: PrintService,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        invoiceType: 'NOTA DE VENTA',
        observations: ['', Validators.required],
    })
    igvType = IgvType
    saleItems: CreateSaleItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    payments: PaymentModel[] = []
    addresses: string[] = []
    private saleId: string = ''
    private sale: SaleModel | null = null
    private turn: TurnModel | null = null
    private setting = new SettingModel()
    private office = new OfficeModel()
    private user: UserModel = new UserModel()

    invoiceTypes = [
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
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

            this.handleOpenTurn$ = this.turnsService.handleOpenTurn(this.setting.isOfficeTurn).subscribe(turn => {
                this.turn = turn
                if (turn === null) {
                    this.matDialog.open(DialogTurnsComponent, {
                        width: '600px',
                        position: { top: '20px' }
                    })
                }
            })
        })

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: this.paymentMethods[0]?._id || null })
        })

        this.saleId = this.activatedRoute.snapshot.params['saleId']
        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            this.formGroup.get('observations')?.patchValue(`canje nota de venta ${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)
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

        this.formGroup.get('invoiceType')?.patchValue(this.setting.defaultInvoice)

        this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
            this.saleItems = saleItems
            this.charge = 0
            for (const saleItem of this.saleItems) {
                if (saleItem.igvCode !== '11') {
                    this.charge += saleItem.price * saleItem.quantity
                }
            }
        })
    }

    onSubmit() {
        try {
            if (this.turn === null) {
                this.matDialog.open(DialogTurnsComponent, {
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
                addressIndex: 0,
                invoiceType: formData.invoiceType,
                observations: formData.observations,
                paymentMethodId: this.paymentMethods[0]?._id || null,
                cash: null,
                currencyCode: this.sale.currencyCode,
                discount: this.sale.discount,
                deliveryAt: null,
                emitionAt: null,
                isRetainer: false,

                turnId: this.turn._id,
                customerId: this.customer ? this.customer._id : null,
                workerId: null,
                referredId: null,
                specialtyId: null,

                igvPercent: this.setting.defaultIgvPercent,
                rcPercent: this.setting.defaultRcPercent
            }

            if (createdSale.invoiceType === 'FACTURA' && this.customer === null) {
                throw new Error("Agrega un cliente")
            }

            if (createdSale.invoiceType === 'FACTURA' && this.customer !== null && this.customer.documentType !== 'RUC') {
                throw new Error("El cliente debe tener un RUC")
            }

            this.isLoading = true
            this.navigationService.loadBarStart()

            this.salesService.changeSale(createdSale, this.saleId, createdSale.observations).subscribe({
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
                        worker: null,
                        referred: null,
                        payments,
                    })

                    switch (this.setting.papelImpresion) {
                        case 'a4':
                            this.printService.printA4Invoice(sale)
                            break
                        case 'ticket80mm':
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
                this.addresses = customer.addresses
            }
        })
    }

}
