import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { CreateDueModel } from '../../dues/create-due.model';
import { SpecialtyModel } from '../../events/specialty.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { CreatePaymentModel } from '../../payments/create-payment.model';
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component';
import { PaymentModel } from '../../payments/payment.model';
import { PrintService } from '../../print/print.service';
import { CreateSaleModel } from '../../sales/create-sale.model';
import { SaleForm } from '../../sales/sale.form';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { DialogTurnsComponent } from '../../turns/dialog-turns/dialog-turns.component';
import { TurnModel } from '../../turns/turn.model';
import { TurnsService } from '../../turns/turns.service';
import { UserModel } from '../../users/user.model';
import { WorkerModel } from '../../workers/worker.model';
import { WorkersService } from '../../workers/workers.service';
import { BillItemModel } from '../bill-item.model';
import { BillsService } from '../bills.service';
import { DialogAddProductComponent } from '../dialog-add-product/dialog-add-product.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { BillerItemsComponent } from '../biller-items/biller-items.component';
import { DirectivesModule } from '../../directives/directives.module';
import { DialogDetractionComponent } from '../dialog-detraction/dialog-detraction.component';
import { DetractionModel } from '../detraction.model';

@Component({
    selector: 'app-create-biller',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, BillerItemsComponent, DirectivesModule],
    templateUrl: './create-biller.component.html',
    styleUrls: ['./create-biller.component.sass']
})
export class CreateBillerComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly billsService: BillsService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly turnsService: TurnsService,
        private readonly workersService: WorkersService,
        private readonly specialtiesService: SpecialtiesService,
        private readonly matDialog: MatDialog,
        private readonly printService: PrintService,
        private readonly authService: AuthService,
        private readonly router: Router
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        addressIndex: 0,
        invoiceType: 'NOTA DE VENTA',
        observations: '',
        cash: null,
        currencyCode: 'PEN',
        discount: null,
        emitionAt: '',
        isRetainer: false,

        paymentMethodId: null,
        workerId: null,
        referredId: null,
        specialtyId: null,
    })
    payments: PaymentModel[] = []
    billItems: BillItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    cash: number = 0
    workers: WorkerModel[] = []
    specialties: SpecialtyModel[] = []
    setting: SettingModel = new SettingModel()
    dues: CreateDueModel[] = []
    addresses: string[] = []
    paymentMethods: PaymentMethodModel[] = []
    private detraction: DetractionModel | null = null
    private user: UserModel = new UserModel()
    private turn: TurnModel | null = null

    private handleClickMenu$: Subscription = new Subscription()
    private handleOpenTurn$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleBillItems$: Subscription = new Subscription()
    private handleWorkers$: Subscription = new Subscription()
    private handleSpecialties$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleDues$: Subscription = new Subscription()

    invoiceTypes = [
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ]

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleOpenTurn$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleBillItems$.unsubscribe()
        this.handleWorkers$.unsubscribe()
        this.handleSpecialties$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleDues$.unsubscribe()
    }

    ngOnInit(): void {
        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        this.navigationService.setTitle('Emitir al contado')
        this.billsService.setBillItems([])

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

            this.formGroup.get('invoiceType')?.patchValue(this.setting.defaultInvoice)
            this.formGroup.get('currencyCode')?.patchValue(this.setting.defaultCurrencyCode)

            if (this.setting.showEmitionAt) {
                this.formGroup.get('emitionAt')?.patchValue(new Date())
                this.formGroup.get('emitionAt')?.setValidators([Validators.required])
                this.formGroup.get('emitionAt')?.updateValueAndValidity()
            }

        })

        this.navigationService.setMenu([
            { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

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

        this.handleWorkers$ = this.workersService.handleWorkers().subscribe(workers => {
            this.workers = workers
        })

        this.handleSpecialties$ = this.specialtiesService.handleSpecialties().subscribe(specialties => {
            this.specialties = specialties
        })

        this.handleBillItems$ = this.billsService.handleBillItems().subscribe(billItems => {
            this.billItems = billItems
            this.charge = 0
            for (const billItem of this.billItems) {
                if (billItem.igvCode !== '11') {
                    this.charge += billItem.price * billItem.quantity
                }
            }
        })
    }

    onDialogDetraction() {
        const dialogRef = this.matDialog.open(DialogDetractionComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.detraction,
        })

        dialogRef.afterClosed().subscribe(detraction => {
            if (detraction) {
                this.detraction = detraction
            }
        })
    }

    onCancel() {
        const ok = confirm('Esta seguro de anular?...')
        if (ok) {
            this.customer = null
            this.billsService.setBillItems([])
        }
    }

    onAddProduct() {
        this.matDialog.open(DialogAddProductComponent, {
            width: '600px',
            position: { top: '20px' },
        })
    }

    cashChange(): number {
        const diff = this.cash - this.charge
        return Number(diff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }

    addCash(cash: number) {
        this.cash += cash
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    setCash(cash: string) {
        this.cash = Number(cash)
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    onChangeDiscount() {
        const { discount } = this.formGroup.value
        this.charge = 0
        for (const billItem of this.billItems) {
            if (billItem.igvCode !== '11') {
                this.charge += billItem.price * billItem.quantity
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
            if (this.turn === null) {
                this.matDialog.open(DialogTurnsComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })
                throw new Error("Debes aperturar una caja")
            }

            if (!this.billItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.billItems.find(e => e.price === 0 || e.price === null)) {
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
                deliveryAt: saleForm.emitionAt,
                emitionAt: saleForm.emitionAt,
                cash: saleForm.cash,
                isRetainer: saleForm.isRetainer,

                turnId: this.turn._id,
                customerId: this.customer ? this.customer._id : null,
                workerId: saleForm.workerId,
                referredId: saleForm.referredId,
                specialtyId: saleForm.specialtyId,

                igvPercent: this.setting.defaultIgvPercent,
                rcPercent: this.setting.defaultRcPercent,
            }

            if (createdSale.invoiceType === 'FACTURA' && this.customer === null) {
                throw new Error("Agrega un cliente")
            }

            if (createdSale.invoiceType === 'FACTURA' && this.customer !== null && this.customer.documentType !== 'RUC') {
                throw new Error("El cliente debe tener un RUC")
            }

            this.isLoading = true
            this.navigationService.loadBarStart()

            this.billsService.saveBill(
                createdSale,
                this.billItems,
                this.payments,
                this.dues,
                this.detraction
            ).subscribe({
                next: sale => {

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
                        saleItems: this.billItems,
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

                    this.billsService.setBillItems([])
                    this.dues = []
                    this.payments = []
                    this.formGroup.get('paymentMethodId')?.enable()
                    this.customer = null

                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
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
