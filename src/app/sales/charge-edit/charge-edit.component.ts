import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CreateSaleItemModel } from '../create-sale-item.model';
import { SaleForm } from '../sale.form';
import { SaleModel } from '../sale.model';
import { SalesService } from '../sales.service';
import { UpdateSaleModel } from '../update-sale.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { WorkersService } from '../../workers/workers.service';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { AuthService } from '../../auth/auth.service';
import { CreatePaymentModel } from '../../payments/create-payment.model';
import { CustomerModel } from '../../customers/customer.model';
import { WorkerModel } from '../../workers/worker.model';
import { SpecialtyModel } from '../../events/specialty.model';
import { SettingModel } from '../../auth/setting.model';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { SaleItemsComponent } from '../sale-items/sale-items.component';

@Component({
    selector: 'app-charge-edit',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, SaleItemsComponent],
    templateUrl: './charge-edit.component.html',
    styleUrls: ['./charge-edit.component.sass']
})
export class ChargeEditComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly salesService: SalesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly workersService: WorkersService,
        private readonly specialtiesService: SpecialtiesService,
        private readonly matDialog: MatDialog,
        private readonly authService: AuthService,
        private readonly router: Router,
    ) { }

    payments: CreatePaymentModel[] = []
    saleItems: CreateSaleItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    workers: WorkerModel[] = []
    specialties: SpecialtyModel[] = []
    formGroup: FormGroup = this.formBuilder.group({
        addressIndex: 0,
        invoiceNumber: null,
        invoiceType: 'NOTA DE VENTA',
        currencyCode: 'PEN',
        observations: '',
        discount: null,
        isCredit: false,
        emitionAt: Date(),

        paymentMethodId: null,
        workerId: null,
        referredId: null,
        specialtyId: null,
    })
    invoiceTypes = [
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ]
    setting = new SettingModel()
    private sale: SaleModel | null = null
    addresses: string[] = []
    paymentMethods: PaymentMethodModel[] = []

    private handleClickMenu$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleWorkers$: Subscription = new Subscription()
    private handleSpecialties$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleWorkers$.unsubscribe()
        this.handleSpecialties$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.sale = this.salesService.getSale()

        this.formGroup.get('invoiceType')?.disable()

        if (this.sale === null) {
            this.router.navigate(['/invoices'])
        } else {
            this.customer = this.sale.customer
            this.addresses = this.sale.customer?.addresses || []
            this.navigationService.setTitle('Guardar cambios')

            const { worker, referred, specialty } = this.sale

            this.formGroup.patchValue(this.sale)

            if (worker) {
                this.formGroup.get('workerId')?.patchValue(worker._id)
            }

            if (referred) {
                this.formGroup.get('referredId')?.patchValue(referred._id)
            }

            if (specialty) {
                this.formGroup.get('specialtyId')?.patchValue(specialty._id)
            }

            if (this.sale.isCredit) {
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

            this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
                this.saleItems = saleItems
                this.charge = 0

                for (const saleItem of this.saleItems) {
                    if (saleItem.igvCode !== '11') {
                        this.charge += saleItem.price * saleItem.quantity
                    }
                }

                this.charge -= (this.sale?.discount || 0)
            })
        }
    }

    onSubmit() {
        try {
            if (this.sale === null) {
                throw new Error("La venta no existe")
            }

            if (!this.saleItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.saleItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            const saleForm: SaleForm = this.formGroup.value

            const createdSale: UpdateSaleModel = {
                addressIndex: saleForm.addressIndex,
                invoiceType: this.sale.invoiceType,
                currencyCode: saleForm.currencyCode || this.sale.currencyCode,
                paymentMethodId: saleForm.paymentMethodId,
                observations: saleForm.observations,
                createdAt: this.sale.createdAt,
                discount: saleForm.discount,
                isCredit: this.sale.isCredit,
                igvPercent: this.sale.igvPercent,
                rcPercent: this.sale.rcPercent,
                emitionAt: saleForm.emitionAt,

                turnId: this.sale.turnId,
                customerId: this.customer ? this.customer._id : null,
                workerId: saleForm.workerId,
                referredId: saleForm.referredId,
                specialtyId: saleForm.specialtyId,
            }

            if (createdSale.invoiceType === 'FACTURA' && this.customer === null) {
                throw new Error("Agrega un cliente")
            }

            if (createdSale.invoiceType === 'FACTURA' && this.customer !== null && this.customer.documentType !== 'RUC') {
                throw new Error("El cliente debe tener un RUC")
            }

            this.isLoading = true
            this.navigationService.loadBarStart()

            this.salesService.updateSaleWithItems(createdSale, this.saleItems, this.payments, this.sale._id).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                    // this.salesService.setSaleItems([])
                    // this.router.navigate(['/invoices'])
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
        }
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

    onAddCustomer() {
        this.matDialog.open(DialogSearchCustomersComponent, {
            width: '600px',
            position: { top: '20px' },
        })
    }

}
