import { CommonModule, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { CreateCreditModel } from '../create-credit.model';
import { CreateSaleItemModel } from '../create-sale-item.model';
import { CreditForm } from '../credit.form';
import { DialogDueData, DialogDuesComponent } from '../dialog-dues/dialog-dues.component';
import { DialogOutStockComponent } from '../dialog-out-stock/dialog-out-stock.component';
import { DialogSaleItemsComponent } from '../dialog-sale-items/dialog-sale-items.component';
import { SalesService } from '../sales.service';
import { NavigationService } from '../../navigation/navigation.service';
import { ProformasService } from '../../proformas/proformas.service';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { WorkersService } from '../../workers/workers.service';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { TurnsService } from '../../turns/turns.service';
import { PrintService } from '../../print/print.service';
import { AuthService } from '../../auth/auth.service';
import { CustomerModel } from '../../customers/customer.model';
import { CreatePaymentModel } from '../../payments/create-payment.model';
import { CreateDueModel } from '../../dues/create-due.model';
import { WorkerModel } from '../../workers/worker.model';
import { SettingModel } from '../../auth/setting.model';
import { SpecialtyModel } from '../../events/specialty.model';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { UserModel } from '../../users/user.model';
import { TurnModel } from '../../turns/turn.model';
import { DialogTurnsComponent } from '../../turns/dialog-turns/dialog-turns.component';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogInitPaymentsComponent } from '../../payments/dialog-init-payments/dialog-init-payments.component';
import { IgvType } from '../../products/igv-type.enum';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { MaterialModule } from '../../material.module';
import { SaleItemsComponent } from '../sale-items/sale-items.component';
import { DirectivesModule } from '../../directives/directives.module';
import { PreSalesService } from '../../pre-sales/pre-sales.service';
import { CouponsService } from '../../coupons/coupons.service';
import { CouponItemModel } from '../../coupons/coupon-item.model';

@Component({
    selector: 'app-charge-credit',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, SaleItemsComponent, DirectivesModule],
    templateUrl: './charge-credit.component.html',
    styleUrls: ['./charge-credit.component.sass']
})
export class ChargeCreditComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly proformasService: ProformasService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly couponsService: CouponsService,
        private readonly preSalesService: PreSalesService,
        private readonly workersService: WorkersService,
        private readonly specialtiesService: SpecialtiesService,
        private readonly location: Location,
        private readonly salesService: SalesService,
        private readonly turnsService: TurnsService,
        private readonly matDialog: MatDialog,
        private readonly printService: PrintService,
        private readonly authService: AuthService,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        addressIndex: 0,
        invoiceType: 'NOTA DE VENTA',
        currencyCode: 'PEN',
        observations: '',
        discount: null,
        deliveryAt: null,
        emitionAt: null,
        isRetainer: false,
        workerId: null,
        referredId: null,
        specialtyId: null,
    })
    invoiceTypes = [
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ]
    saleItems: CreateSaleItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    payments: CreatePaymentModel[] = []
    dues: CreateDueModel[] = []
    setting = new SettingModel()
    addresses: string[] = []
    workers: WorkerModel[] = []
    specialties: SpecialtyModel[] = []
    paymentMethods: PaymentMethodModel[] = []
    private couponItems: CouponItemModel[] = []
    private user: UserModel = new UserModel()
    private turn: TurnModel | null = null
    private params: Params = {}

    private handleClickMenu$: Subscription = new Subscription()
    private handleOpenTurn$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleCouponItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleDues$: Subscription = new Subscription()
    private handleWorkers$: Subscription = new Subscription()
    private handleSpecialties$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleOpenTurn$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleCouponItems$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleDues$.unsubscribe()
        this.handleWorkers$.unsubscribe()
        this.handleSpecialties$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Credito')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
            this.setting = auth.setting

            this.handleOpenTurn$ = this.turnsService.handleOpenTurn(this.setting.isOfficeTurn).subscribe(turn => {
                this.turn = turn
                if (turn === null) {
                    this.matDialog.open(DialogTurnsComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })
                }
            })

            this.handleWorkers$ = this.workersService.handleWorkers().subscribe(workers => {
                this.workers = workers
            })

            this.handleSpecialties$ = this.specialtiesService.handleSpecialties().subscribe(specialties => {
                this.specialties = specialties
            })

            this.handleCouponItems$ = this.couponsService.handleCouponItems().subscribe(couponItems => {
                this.couponItems = couponItems
            })

            if (this.setting.showDeliveryAt) {
                this.formGroup.get('deliveryAt')?.setValidators([Validators.required])
                this.formGroup.get('deliveryAt')?.updateValueAndValidity()
            }
        })

        this.navigationService.setMenu([
            { id: 'add_init_payment', label: 'Cuota inicial', icon: 'add_card', show: true },
            { id: 'add_dues', label: 'N° de cuotas', icon: 'event_available', show: true },
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: (this.paymentMethods[0] || { _id: '' })._id })
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
                            this.formGroup.patchValue({ workerId: customer.workerId })
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
                                this.formGroup.patchValue({ workerId: customer.workerId })
                            }
                        })
                    })
                    break

                case 'add_dues': {
                    if (this.turn) {
                        const data: DialogDueData = {
                            turnId: this.turn._id,
                            charge: this.charge,
                            dues: this.dues
                        }

                        const dialogRef = this.matDialog.open(DialogDuesComponent, {
                            width: '600px',
                            position: { top: '20px' },
                            data,
                        })

                        dialogRef.afterClosed().subscribe(dues => {
                            if (dues && dues.length) {
                                this.dues = dues
                            }
                        })
                    }
                    break
                }

                case 'add_init_payment': {
                    if (this.turn) {
                        const dialogRef = this.matDialog.open(DialogInitPaymentsComponent, {
                            width: '600px',
                            position: { top: '20px' },
                            data: this.turn._id,
                        })
    
                        dialogRef.afterClosed().subscribe(payments => {
                            if (payments) {
                                this.payments = payments
                                const charge = this.payments.map(e => e.charge).reduce((a, b) => a + b, 0)
                                this.dues[0].charge = this.dues[0].preCharge - charge
                            }
                        })
                    }
                    break
                }
                default:
                    break
            }
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

            const now = new Date()

            const due: CreateDueModel = {
                charge: this.charge,
                preCharge: this.charge,
                dueDate: new Date(now.setMonth(now.getMonth() + 1)),
            }

            this.dues = [due]
        })

        const { proformaId } = this.activatedRoute.snapshot.queryParams

        if (proformaId) {
            Object.assign(this.params, { proformaId })
            this.proformasService.getProformaById(proformaId).subscribe(proforma => {
                const { proformaItems, customer, discount } = proforma
                this.salesService.setSaleItems(proformaItems)
                this.formGroup.patchValue(proforma)
                this.charge -= (discount || 0)
                this.customer = customer
            })
        }

        let preSale = this.preSalesService.getPreSale()

        if (preSale) {
            this.customer = preSale.customer
            Object.assign(this.params, { preSaleId: preSale._id })
            this.formGroup.patchValue({ workerId: preSale.workerId })
        }
    }

    onClickSaleItem(index: number) {
        this.matDialog.open(DialogSaleItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

    onChangeDiscount() {
        const { discount } = this.formGroup.value
        this.charge = 0

        for (const saleItem of this.saleItems) {
            if (saleItem.igvCode !== IgvType.BONIFICACION) {
                this.charge += saleItem.price * saleItem.quantity
            }
        }

        this.charge -= discount

        if (this.dues.length < 2) {
            const now = new Date()
            const due: CreateDueModel = {
                charge: this.charge,
                preCharge: this.charge,
                dueDate: new Date(now.setMonth(now.getMonth() + 1)),
            }

            this.dues = [due]
        }
    }

    onSubmit() {
        try {
            this.isLoading = true
            this.navigationService.loadBarStart()

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

            if (this.customer === null) {
                throw new Error("Agrega un cliente")
            }

            if (this.setting.allowCreditLimit && !this.customer.creditLimit) {
                throw new Error("Este cliente no tiene credito disponible")
            }

            const creditForm: CreditForm = this.formGroup.value

            const createdCredit: CreateCreditModel = {
                addressIndex: creditForm.addressIndex,
                invoiceType: creditForm.invoiceType,
                observations: creditForm.observations,
                turnId: this.turn._id,
                currencyCode: creditForm.currencyCode || 'PEN',
                discount: creditForm.discount,
                deliveryAt: creditForm.deliveryAt,
                emitionAt: creditForm.emitionAt,
                isRetainer: creditForm.isRetainer,
                workerId: creditForm.workerId,
                referredId: creditForm.referredId,
                specialtyId: creditForm.specialtyId,
                isCredit: true,

                customerId: this.customer._id,

                rcPercent: this.setting.defaultRcPercent,
                igvPercent: this.setting.defaultIgvPercent
            }

            if (createdCredit.invoiceType === 'FACTURA' && this.customer !== null && this.customer.documentType !== 'RUC') {
                throw new Error("El cliente debe tener un RUC")
            }

            if (this.setting.allowFreeStock) {
                this.salesService.createCredit(createdCredit, this.saleItems, this.payments, this.dues, this.couponItems, this.params).subscribe({
                    next: sale => {

                        Object.assign(sale, {
                            user: this.user,
                            customer: this.customer,
                            saleItems: this.saleItems,
                            worker: this.workers.find(e => e._id === sale.workerId),
                            referred: this.workers.find(e => e._id === sale.referredId),
                            payments: this.payments,
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
                this.salesService.createCreditStock(createdCredit, this.saleItems, this.payments, this.dues, this.couponItems, this.params).subscribe({
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

                            Object.assign(sale, {
                                user: this.user,
                                customer: this.customer,
                                saleItems: this.saleItems,
                                worker: this.workers.find(e => e._id === sale.workerId),
                                referred: this.workers.find(e => e._id === sale.referredId),
                                payments: this.payments,
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
                this.formGroup.patchValue({ workerId: customer.workerId })
            }
        })
    }

}
