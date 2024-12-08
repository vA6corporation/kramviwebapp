import { CommonModule, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { CreatePaymentModel } from '../../payments/create-payment.model';
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component';
import { PrintService } from '../../print/print.service';
import { CreateSaleItemModel } from '../../sales/create-sale-item.model';
import { CreateSaleModel } from '../../sales/create-sale.model';
import { DialogOutStockComponent } from '../../sales/dialog-out-stock/dialog-out-stock.component';
import { SaleForm } from '../../sales/sale.form';
import { SalesService } from '../../sales/sales.service';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { DialogTurnsComponent } from '../../turns/dialog-turns/dialog-turns.component';
import { TurnModel } from '../../turns/turn.model';
import { TurnsService } from '../../turns/turns.service';
import { UserModel } from '../../users/user.model';
import { WorkerModel } from '../../workers/worker.model';
import { WorkersService } from '../../workers/workers.service';
import { EventsService } from '../events.service';
import { SpecialtyModel } from '../specialty.model';
import { MaterialModule } from '../../material.module';
import { SaleItemsComponent } from '../../sales/sale-items/sale-items.component';

@Component({
    selector: 'app-charge-events',
    imports: [MaterialModule, ReactiveFormsModule, SaleItemsComponent, CommonModule],
    templateUrl: './charge-events.component.html',
    styleUrls: ['./charge-events.component.sass'],
})
export class ChargeEventsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly location: Location,
        private readonly salesService: SalesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly turnsService: TurnsService,
        private readonly matDialog: MatDialog,
        private readonly printService: PrintService,
        private readonly authService: AuthService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly eventsService: EventsService,
        private readonly workersService: WorkersService,
        private readonly specialtiesService: SpecialtiesService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        invoiceType: 'NOTA DE VENTA',
        discount: null,
        observations: '',
        cash: null,
        isConsumption: false,

        paymentMethodId: null,
        workerId: null,
        referredId: null,
        specialtyId: null,
    })
    payments: CreatePaymentModel[] = []
    saleItems: CreateSaleItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = true
    cash: number = 0
    workers: WorkerModel[] = []
    specialties: SpecialtyModel[] = []
    addresses: string[] = []
    paymentMethods: PaymentMethodModel[] = []
    private turn: TurnModel | null = null

    invoiceTypes = [
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ]

    setting = new SettingModel()
    private user: UserModel = new UserModel()
    private params: Params = {}

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
        this.navigationService.setTitle('Cobrar agenda')
        this.navigationService.setMenu([
            { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

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
        })

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: this.paymentMethods[0]?._id || null })
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

        this.formGroup.get('invoiceType')?.patchValue(this.setting.defaultInvoice)

        this.handleWorkers$ = this.workersService.handleWorkers().subscribe(workers => {
            this.workers = workers
        })

        this.handleSpecialties$ = this.specialtiesService.handleSpecialties().subscribe(specialties => {
            this.specialties = specialties
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

        const { eventId } = this.activatedRoute.snapshot.params
        Object.assign(this.params, { eventId })
        this.navigationService.loadBarStart()
        this.eventsService.getEventById(eventId).subscribe(event => {
            this.isLoading = false
            this.navigationService.loadBarFinish()
            const { eventItems, customer, workerId, referredId, specialtyId } = event
            this.customer = customer
            this.salesService.setSaleItems(eventItems)
            this.formGroup.get('specialtyId')?.patchValue(specialtyId)
            this.formGroup.get('workerId')?.patchValue(workerId)
            this.formGroup.get('referredId')?.patchValue(referredId)
        })
    }

    efectivo(): number {
        if (this.payments.length) {
            return this.payments.map(e => e.charge).reduce((a, b) => a + b, 0)
        } else {
            return 0
        }
    }

    addCash(cash: number) {
        this.cash += cash
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    setCash(cash: string) {
        this.cash = Number(cash)
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    resetCash() {
        this.cash = 0
        this.formGroup.get('cash')?.patchValue(this.cash)
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

            if (this.customer === null) {
                throw new Error("Agrega un cliente")
            }

            if (!this.saleItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.saleItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            const saleForm: SaleForm = this.formGroup.value

            const createdSale: CreateSaleModel = {
                addressIndex: 0,
                invoiceType: saleForm.invoiceType,
                paymentMethodId: saleForm.paymentMethodId,
                observations: saleForm.observations,
                cash: saleForm.cash,
                currencyCode: 'PEN',
                discount: saleForm.discount,
                deliveryAt: null,
                emitionAt: null,
                isRetainer: saleForm.isRetainer,

                turnId: this.turn._id,
                customerId: this.customer._id,
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
                            console.log(outStocks)
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
