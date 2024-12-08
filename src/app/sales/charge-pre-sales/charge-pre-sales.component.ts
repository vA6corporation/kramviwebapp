import { CommonModule, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { SpecialtyModel } from '../../events/specialty.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { CreatePaymentModel } from '../../payments/create-payment.model';
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component';
import { PreSalesService } from '../../pre-sales/pre-sales.service';
import { PrintService } from '../../print/print.service';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { DialogTurnsComponent } from '../../turns/dialog-turns/dialog-turns.component';
import { TurnModel } from '../../turns/turn.model';
import { TurnsService } from '../../turns/turns.service';
import { UserModel } from '../../users/user.model';
import { WorkerModel } from '../../workers/worker.model';
import { WorkersService } from '../../workers/workers.service';
import { CreateSaleItemModel } from '../create-sale-item.model';
import { CreateSaleModel } from '../create-sale.model';
import { DialogOutStockComponent } from '../dialog-out-stock/dialog-out-stock.component';
import { SaleForm } from '../sale.form';
import { SalesService } from '../sales.service';
import { MaterialModule } from '../../material.module';
import { SaleItemsComponent } from '../sale-items/sale-items.component';
import { DirectivesModule } from '../../directives/directives.module';

@Component({
    selector: 'app-charge-pre-sales',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, SaleItemsComponent, DirectivesModule],
    templateUrl: './charge-pre-sales.component.html',
    styleUrls: ['./charge-pre-sales.component.sass']
})
export class ChargePreSalesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly location: Location,
        private readonly salesService: SalesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly preSalesService: PreSalesService,
        private readonly turnsService: TurnsService,
        private readonly workersService: WorkersService,
        private readonly specialtiesService: SpecialtiesService,
        private readonly matDialog: MatDialog,
        private readonly printService: PrintService,
        private readonly authService: AuthService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        addressIndex: 0,
        invoiceType: 'NOTA DE VENTA',
        currencyCode: 'PEN',
        observations: '',
        discount: null,
        deliveryAt: null,
        emitionAt: null,
        cash: null,
        isRetainer: false,

        paymentMethodId: null,
        workerId: null,
        referredId: null,
        specialtyId: null
    })
    payments: CreatePaymentModel[] = []
    saleItems: CreateSaleItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    cash: number = 0
    cashChange: number = 0
    workers: WorkerModel[] = []
    specialties: SpecialtyModel[] = []
    invoiceTypes = [
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ]
    setting = new SettingModel()
    addresses: string[] = []
    private params: Params = {}
    private turn: TurnModel | null = null
    private user: UserModel = new UserModel()
    paymentMethods: PaymentMethodModel[] = []

    private handleClickMenu$: Subscription = new Subscription()
    private handleOpenTurn$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleWorkers$: Subscription = new Subscription()
    private handleSpecialties$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleOpenTurn$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleWorkers$.unsubscribe()
        this.handleSpecialties$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Cobrar')

        this.navigationService.setMenu([
            { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: this.paymentMethods[0]?._id || null })
        })

        this.handleWorkers$ = this.workersService.handleWorkers().subscribe(workers => {
            this.workers = workers
        })

        this.handleSpecialties$ = this.specialtiesService.handleSpecialties().subscribe(specialties => {
            this.specialties = specialties
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
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

            if (this.setting.showWorker) {
                this.formGroup.get('workerId')?.setValidators([Validators.required])
                this.formGroup.get('workerId')?.updateValueAndValidity()
            }

            if (this.setting.showReferred) {
                this.formGroup.get('referredId')?.setValidators([Validators.required])
                this.formGroup.get('referredId')?.updateValueAndValidity()
            }

            if (this.setting.showSpecialty) {
                this.formGroup.get('specialtyId')?.setValidators([Validators.required])
                this.formGroup.get('specialtyId')?.updateValueAndValidity()
            }

            if (this.setting.showDeliveryAt) {
                this.formGroup.get('deliveryAt')?.setValidators([Validators.required])
                this.formGroup.get('delivaryAt')?.updateValueAndValidity()
                this.formGroup.get('deliveryAt')?.patchValue(new Date())
            }

            if (this.setting.showDeliveryAt) {
                this.formGroup.get('deliveryAt')?.setValidators([Validators.required])
                this.formGroup.get('deliveryAt')?.updateValueAndValidity()
            }

            if (this.setting.showEmitionAt) {
                this.formGroup.get('emitionAt')?.patchValue(new Date())
                this.formGroup.get('emitionAt')?.setValidators([Validators.required])
                this.formGroup.get('emitionAt')?.updateValueAndValidity()
            }

            this.formGroup.get('invoiceType')?.patchValue(this.setting.defaultInvoice)
            this.formGroup.get('currencyCode')?.patchValue(this.setting.defaultCurrencyCode)
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
                            this.addresses = customer.addresses
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
                                this.addresses = customer.addresses
                            }
                        })
                    })
                    break

                case 'split_payment':
                    if (this.turn) {
                        const data: DialogSplitPaymentsData = {
                            turnId: this.turn._id,
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
                if (saleItem.igvCode !== '11') {
                    this.charge += saleItem.price * saleItem.quantity
                }
            }
        })

        let preSale = this.preSalesService.getPreSale()
        if (preSale) {
            this.customer = preSale.customer
            Object.assign(this.params, { preSaleId: preSale._id })
            this.formGroup.patchValue({ workerId: preSale.workerId })
        }
    }

    addCash(cash: number) {
        this.cash = Number(this.cash)
        this.cash += cash
        const diff = Number(this.cash) - Number(this.charge)
        this.cashChange = Number(diff.toFixed(2))
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    setCash(cash: any) {
        this.cash = cash
        const diff = Number(this.cash) - Number(this.charge)
        this.cashChange = Number(diff.toFixed(2))
    }

    onChangeDiscount() {
        const { discount } = this.formGroup.value
        this.charge = 0
        for (const saleItem of this.saleItems) {
            if (saleItem.igvCode !== '11') {
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

            if (this.turn === null) {
                this.matDialog.open(DialogTurnsComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })
                throw new Error("Debes aperturar una caja")
            }

            if (!this.saleItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.saleItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            const saleForm: SaleForm = this.formGroup.value

            const createdSale: CreateSaleModel = {
                addressIndex: saleForm.addressIndex,
                invoiceType: saleForm.invoiceType,
                paymentMethodId: saleForm.paymentMethodId,
                observations: saleForm.observations,
                currencyCode: saleForm.currencyCode || 'PEN',
                discount: saleForm.discount,
                deliveryAt: saleForm.deliveryAt,
                emitionAt: saleForm.emitionAt,
                cash: saleForm.cash,
                isRetainer: saleForm.isRetainer,

                turnId: this.turn._id,
                customerId: this.customer ? this.customer._id : null,
                workerId: saleForm.workerId,
                referredId: saleForm.referredId,
                specialtyId: saleForm.specialtyId,

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

            if (this.setting.allowFreeStock) {
                this.salesService.createSale(createdSale, this.saleItems, this.payments, [], this.params).subscribe({
                    next: sale => {

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
                            worker: this.workers.find(e => e._id === sale.workerId),
                            referred: this.workers.find(e => e._id === sale.referredId),
                            payments,
                        })

                        switch (this.setting.papelImpresion) {
                            case 'a4':
                                this.printService.printA4Invoice(sale)
                                break
                            case 'a5':
                                this.printService.printA5Invoice(sale)
                                break
                            case 'ticket80mm':
                                this.printService.printTicket80mm(sale)
                                break
                            default:
                                this.printService.printTicket58mm(sale)
                                break
                        }

                        this.salesService.setSaleItems([])
                        this.location.back()
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage('Registrado correctamente')
                    }, error: (error: HttpErrorResponse) => {
                        this.navigationService.showMessage(error.error.message)
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                    }
                })
            } else {
                this.salesService.createSaleStock(createdSale, this.saleItems, this.payments, [], this.params).subscribe({
                    next: res => {

                        const { sale, outStocks } = res

                        if (outStocks.length || sale === null) {
                            this.navigationService.loadBarFinish()
                            this.isLoading = false
                            this.matDialog.open(DialogOutStockComponent, {
                                width: '600px',
                                position: { top: '20px' },
                                data: outStocks,
                            })
                        } else {

                            let payments: CreatePaymentModel[] = []

                            if (this.payments.length) {
                                payments = this.payments
                            } else {
                                payments[0] = {
                                    paymentMethodId: createdSale.paymentMethodId || '',
                                    charge: sale.charge,
                                    turnId: sale.turnId,
                                    createdAt: new Date(),
                                }
                            }

                            Object.assign(sale, {
                                user: this.user,
                                customer: this.customer,
                                saleItems: this.saleItems,
                                worker: this.workers.find(e => e._id === sale.workerId),
                                referred: this.workers.find(e => e._id === sale.referredId),
                                payments,
                            })

                            switch (this.setting.papelImpresion) {
                                case 'a4':
                                    this.printService.printA4Invoice(sale)
                                    break
                                case 'a5':
                                    this.printService.printA5Invoice(sale)
                                    break
                                case 'ticket80mm':
                                    this.printService.printTicket80mm(sale)
                                    break
                                default:
                                    this.printService.printTicket58mm(sale)
                                    break
                            }

                            this.salesService.setSaleItems([])

                            this.location.back()

                            this.isLoading = false
                            this.navigationService.loadBarFinish()
                            this.navigationService.showMessage('Registrado correctamente')
                        }
                    }, error: (error: HttpErrorResponse) => {
                        this.navigationService.showMessage(error.error.message)
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                    }
                })
            }
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
