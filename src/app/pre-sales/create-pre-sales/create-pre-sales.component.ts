import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { SpecialtyModel } from '../../events/specialty.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { CreatePaymentModel } from '../../payments/create-payment.model';
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component';
import { CreateSaleItemModel } from '../../sales/create-sale-item.model';
import { SaleForm } from '../../sales/sale.form';
import { SalesService } from '../../sales/sales.service';
import { SpecialtiesService } from '../../specialties/specialties.service';
import { TurnModel } from '../../turns/turn.model';
import { WorkerModel } from '../../workers/worker.model';
import { WorkersService } from '../../workers/workers.service';
import { PreSalesService } from '../pre-sales.service';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';

@Component({
    selector: 'app-create-pre-sales',
    templateUrl: './create-pre-sales.component.html',
    styleUrls: ['./create-pre-sales.component.sass']
})
export class CreatePreSalesComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly salesService: SalesService,
        private readonly preSalesService: PreSalesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly workersService: WorkersService,
        private readonly specialtiesService: SpecialtiesService,
        private readonly matDialog: MatDialog,
        private readonly authService: AuthService,
        private readonly router: Router,
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
        especialtyId: null
    });

    payments: CreatePaymentModel[] = [];
    saleItems: CreateSaleItemModel[] = [];
    charge: number = 0;
    customer: CustomerModel | null = null;
    isLoading: boolean = false;
    cash: number = 0;
    cashChange: number = 0;
    workers: WorkerModel[] = [];
    specialties: SpecialtyModel[] = [];
    invoiceTypes = [
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ];
    setting = new SettingModel();
    addresses: string[] = [];
    paymentMethods: PaymentMethodModel[] = [];
    private turn: TurnModel | null = null;

    private handleClickMenu$: Subscription = new Subscription();
    private handleOpenTurn$: Subscription = new Subscription();
    private handleSaleItems$: Subscription = new Subscription();
    private handlePaymentMethods$: Subscription = new Subscription();
    private handleWorkers$: Subscription = new Subscription();
    private handleSpecialties$: Subscription = new Subscription();
    private handleAuth$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe();
        this.handleOpenTurn$.unsubscribe();
        this.handleSaleItems$.unsubscribe();
        this.handlePaymentMethods$.unsubscribe();
        this.handleWorkers$.unsubscribe();
        this.handleSpecialties$.unsubscribe();
        this.handleAuth$.unsubscribe();
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Guardar');

        this.navigationService.setMenu([
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ]);

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods;
            this.formGroup.patchValue({ paymentMethodId: this.paymentMethods[0]?._id || null });
        });

        this.handleWorkers$ = this.workersService.handleWorkers().subscribe(workers => {
            this.workers = workers;
        });

        this.handleSpecialties$ = this.specialtiesService.handleSpecialties().subscribe(specialties => {
            this.specialties = specialties;
        });

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting;

            if (this.setting.showWorker) {
                this.formGroup.get('workerId')?.setValidators([Validators.required]);
                this.formGroup.get('workerId')?.updateValueAndValidity();
            }

            if (this.setting.showReferred) {
                this.formGroup.get('referredId')?.setValidators([Validators.required]);
                this.formGroup.get('referredId')?.updateValueAndValidity();
            }

            if (this.setting.showSpecialty) {
                this.formGroup.get('specialtyId')?.setValidators([Validators.required]);
                this.formGroup.get('specialtyId')?.updateValueAndValidity();
            }

            if (this.setting.showDeliveryAt) {
                this.formGroup.get('deliveryAt')?.setValidators([Validators.required]);
                this.formGroup.get('delivaryAt')?.updateValueAndValidity();
                this.formGroup.get('deliveryAt')?.patchValue(new Date());
            }

            if (this.setting.showDeliveryAt) {
                this.formGroup.get('deliveryAt')?.setValidators([Validators.required]);
                this.formGroup.get('deliveryAt')?.updateValueAndValidity();
            }

            if (this.setting.showEmitionAt) {
                this.formGroup.get('emitionAt')?.patchValue(new Date());
                this.formGroup.get('emitionAt')?.setValidators([Validators.required]);
                this.formGroup.get('emitionAt')?.updateValueAndValidity();
            }

            this.formGroup.get('invoiceType')?.patchValue(this.setting.defaultInvoice);
            this.formGroup.get('currencyCode')?.patchValue(this.setting.defaultCurrencyCode);
        });

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_customer':
                    const dialogRef = this.matDialog.open(DialogSearchCustomersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.setting.defaultSearchCustomer
                    });

                    dialogRef.afterClosed().subscribe(customer => {
                        if (customer) {
                            this.customer = customer;
                            this.addresses = customer.addresses;
                        }
                    });

                    dialogRef.componentInstance.handleCreateCustomer().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateCustomersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        });

                        dialogRef.afterClosed().subscribe(customer => {
                            if (customer) {
                                this.customer = customer;
                                this.addresses = customer.addresses;
                            }
                        });
                    });
                    break;

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
                        });

                        dialogRef.afterClosed().subscribe(payments => {
                            if (payments) {
                                this.payments = payments;
                                if (payments.length) {
                                    this.formGroup.get('paymentMethodId')?.disable();
                                } else {
                                    this.formGroup.get('paymentMethodId')?.enable();
                                }
                            }
                        });
                    }
                    break;
                default:
                    break;
            }
        });

        this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
            this.saleItems = saleItems;
            this.charge = 0;
            for (const saleItem of this.saleItems) {
                if (saleItem.igvCode !== '11') {
                    this.charge += saleItem.price * saleItem.quantity;
                }
            }
        })
    }

    addCash(cash: number) {
        this.cash = Number(this.cash);
        this.cash += cash;
        const diff = Number(this.cash) - Number(this.charge);
        this.cashChange = Number(diff.toFixed(2));
        this.formGroup.get('cash')?.patchValue(this.cash);
    }

    setCash(cash: any) {
        this.cash = cash;
        const diff = Number(this.cash) - Number(this.charge);
        this.cashChange = Number(diff.toFixed(2));
    }

    onChangeDiscount() {
        const { discount } = this.formGroup.value;
        this.charge = 0;
        for (const saleItem of this.saleItems) {
            if (saleItem.igvCode !== '11') {
                this.charge += saleItem.price * saleItem.quantity;
            }
        }
        this.charge -= discount;
    }

    resetCash() {
        this.cash = 0;
        this.formGroup.get('cash')?.patchValue(this.cash);
    }

    onSubmit() {
        try {
            if (!this.formGroup.valid) {
                throw new Error("Complete los campos");
            }

            if (!this.saleItems.length) {
                throw new Error("Agrega un producto");
            }

            if (this.saleItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0");
            }

            if (this.customer === null) {
                throw new Error("Agrega un cliente");
            }

            const saleForm: SaleForm = this.formGroup.value;

            const createdSale: any = {
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

                customerId: this.customer ? this.customer._id : null,
                workerId: saleForm.workerId,

                igvPercent: this.setting.defaultIgvPercent,
                rcPercent: this.setting.defaultRcPercent
            }

            this.isLoading = true
            this.navigationService.loadBarStart()

            this.preSalesService.create(createdSale, this.saleItems).subscribe(preSale => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Se han guardado los cambios')
                this.router.navigate(['/preSales'])
            }, (error: HttpErrorResponse) => {
                this.isLoading = false
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            })
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message);
            }
            this.isLoading = false;
            this.navigationService.loadBarFinish();
        }
    }

    onEditCustomer() {
        const dialogRef = this.matDialog.open(DialogEditCustomersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.customer,
        });

        dialogRef.afterClosed().subscribe(customer => {
            if (customer) {
                this.customer = customer;
                this.addresses = customer.addresses;
            }
        });
    }

}