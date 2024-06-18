import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { SpecialtyModel } from '../../events/specialty.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component';
import { PaymentModel } from '../../payments/payment.model';
import { SaleModel } from '../../sales/sale.model';
import { SalesService } from '../../sales/sales.service';
import { UpdateSaleModel } from '../../sales/update-sale.model';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { WorkerModel } from '../../workers/worker.model';
import { WorkersService } from '../../workers/workers.service';
import { BillItemModel } from '../bill-item.model';
import { BillsService } from '../bills.service';
import { DialogAddProductComponent } from '../dialog-add-product/dialog-add-product.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { BillerItemsComponent } from '../biller-items/biller-items.component';
import { DirectivesModule } from '../../directives/directives.module';

@Component({
    selector: 'app-edit-biller',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, BillerItemsComponent, DirectivesModule],
    templateUrl: './edit-biller.component.html',
    styleUrls: ['./edit-biller.component.sass']
})
export class EditBillerComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly billsService: BillsService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly workersService: WorkersService,
        private readonly specialtiesService: SpecialtiesService,
        private readonly matDialog: MatDialog,
        private readonly authService: AuthService,
        private readonly salesService: SalesService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        addressIndex: 0,
        invoiceType: [{ value: 'NOTA DE VENTA', disabled: true }],
        paymentMethodId: '',
        observations: '',
        cash: null,
        currencyCode: 'PEN',
        discount: null,
        isConsumption: false,
        isCredit: false,
        emitionAt: new Date(),

        workerId: null,
        referredId: null,
        specialtyId: null,
    })

    payments: PaymentModel[] = []
    billItems: BillItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = true
    cash: number = 0
    workers: WorkerModel[] = []
    specialties: SpecialtyModel[] = []
    addresses: string[] = []
    private saleId: string = ''
    private sale: SaleModel | null = null

    invoiceTypes = [
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ]

    setting = new SettingModel()
    private office: OfficeModel = new OfficeModel()
    paymentMethods: PaymentMethodModel[] = []

    private handleClickMenu$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleBillItems$: Subscription = new Subscription()
    private handleWorkers$: Subscription = new Subscription()
    private handleSpecialties$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleBillItems$.unsubscribe()
        this.handleWorkers$.unsubscribe()
        this.handleSpecialties$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Facturador')
        this.saleId = this.activatedRoute.snapshot.params['saleId']
        this.navigationService.loadBarStart()
        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            this.navigationService.loadBarFinish()
            this.isLoading = false
            this.sale = sale
            if (this.sale.isCredit) {
                this.navigationService.showDialogMessage('Esta venta a sido generada al credito, debera revisar las cuotas pagadas si hace una modificacion')
                this.navigationService.setMenu([
                    // { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
                    { id: 'add_customer', label: 'Desc Excel', icon: 'person_add', show: true },
                ])
            } else {
                this.navigationService.setMenu([
                    { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
                    { id: 'add_customer', label: 'Desc Excel', icon: 'person_add', show: true },
                ])
            }
            this.customer = sale.customer
            this.addresses = sale.customer ? sale.customer.addresses : []
            this.formGroup.patchValue(sale)
            this.billsService.setBillItems(sale.saleItems as BillItemModel[])
            this.navigationService.setTitle(`Editar ${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)
        })

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: (this.paymentMethods[0] || { _id: '' })._id })
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
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
                    if (this.sale) {
                        const data: DialogSplitPaymentsData = {
                            turnId: this.sale.turnId,
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

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })

        this.handleBillItems$ = this.billsService.handleBillItems().subscribe(billItems => {
            this.billItems = billItems
            this.charge = 0

            for (const billItem of this.billItems) {
                if (billItem.igvCode !== '11') {
                    this.charge += billItem.price * billItem.quantity
                }
            }

            this.charge -= (this.sale?.discount || 0)
        })
    }

    onAddProduct() {
        this.matDialog.open(DialogAddProductComponent, {
            width: '600px',
            position: { top: '20px' },
        })
    }

    cashChange(): number {
        const diff = this.cash - this.cash
        return Number(diff.toFixed(2))
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
            this.isLoading = true

            if (this.sale === null) {
                throw new Error("No hemos encontrado la venta")
            }

            if (this.billItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            if (this.sale.invoiceType === 'FACTURA' && this.customer === null) {
                throw new Error("Agrega un cliente")
            }

            if (this.sale.invoiceType === 'FACTURA' && this.customer !== null && this.customer.documentType !== 'RUC') {
                throw new Error("El cliente debe tener un RUC")
            }

            const saleForm = this.formGroup.value

            const sale: UpdateSaleModel = {
                addressIndex: saleForm.addressIndex,
                invoiceType: this.sale.invoiceType,
                currencyCode: saleForm.currencyCode || this.sale.currencyCode,
                paymentMethodId: saleForm.paymentMethodId,
                observations: saleForm.observations,
                createdAt: this.sale.createdAt,
                discount: saleForm.discount,
                isCredit: saleForm.isCredit,
                igvPercent: this.sale.igvPercent,
                rcPercent: this.sale.rcPercent,
                emitionAt: saleForm.emitionAt,

                turnId: this.sale.turnId,
                customerId: this.customer?._id || null,
                workerId: saleForm.workerId,
                referredId: saleForm.referredId,
                specialtyId: saleForm.specialtyId
            }

            this.navigationService.loadBarStart()

            this.billsService.updateBill(sale, this.billItems, this.payments, this.saleId).subscribe(createdSale => {
                this.billsService.setBillItems([])
                this.isLoading = false
                this.navigationService.loadBarFinish()
                this.router.navigate(['/invoices'])
                this.navigationService.showMessage('Se han guardado los cambios')
            }, (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
                this.isLoading = false
                this.navigationService.loadBarFinish()
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
