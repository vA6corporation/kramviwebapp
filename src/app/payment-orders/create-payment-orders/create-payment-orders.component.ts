import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BanksService } from '../../banks/banks.service';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { BankModel } from '../../providers/bank.model';
import { DialogCreateProvidersComponent } from '../../providers/dialog-create-providers/dialog-create-providers.component';
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component';
import { ProviderModel } from '../../providers/provider.model';
import { PaymentOrdersService } from '../payment-orders.service';
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component';
import { DialogAttachFileComponent } from '../dialog-attach-file/dialog-attach-file.component';

@Component({
    selector: 'app-create-payment-orders',
    templateUrl: './create-payment-orders.component.html',
    styleUrls: ['./create-payment-orders.component.sass']
})
export class CreatePaymentOrdersComponent implements OnInit {

    constructor(
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly paymentOrdersService: PaymentOrdersService,
        private readonly navigationService: NavigationService,
        private readonly banksService: BanksService,
        private readonly formBuilder: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        paymentMethodId: '',
        concept: [null, Validators.required],
        charge: [null, Validators.required],
        serie: [null, Validators.required],
        observations: '',
        paymentAt: [new Date(), Validators.required],
        operationNumber: null,
        providerBankName: '',
        providerAccountNumber: '',
        bankName: '',
        accountNumber: '',
        isPaid: true,
    })
    paymentMethods: PaymentMethodModel[] = []
    isLoading: boolean = false
    provider: ProviderModel | null = null
    banks: BankModel[] = []
    providerBanks: BankModel[] = []
    private formData: FormData | null = null

    private handleClickMenu$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva orden de pago')
        this.banksService.getBanks().subscribe(banks => {
            this.banks = banks
        })

        this.navigationService.setMenu([
            { id: 'attach_file', label: 'Adjuntar PDF', icon: 'attach_file', show: true },
            { id: 'add_provider', label: 'Agregar proveedor', icon: 'person_add', show: true },
        ])

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: (this.paymentMethods[0] || { _id: '' })._id })
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_provider':
                    const dialogRef = this.matDialog.open(DialogSearchProvidersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })

                    dialogRef.afterClosed().subscribe(provider => {
                        if (provider) {
                            this.provider = provider
                            this.providerBanks = provider.banks
                        }
                    })

                    dialogRef.componentInstance.handleAddProvider().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateProvidersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(provider => {
                            if (provider) {
                                this.provider = provider
                                this.providerBanks = provider.banks
                            }
                        })
                    })
                    break

                case 'attach_file': {
                    const dialogRef = this.matDialog.open(DialogAttachFileComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })

                    dialogRef.afterClosed().subscribe(file => {
                        if (file) {
                            this.formData = new FormData()
                            this.formData.append('file', file, file.name)
                        }
                    })
                    break
                }
            }
        })
    }

    onEditProvider() {
        const dialogRef = this.matDialog.open(DialogEditProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.provider,
        })

        dialogRef.afterClosed().subscribe(provider => {
            if (provider) {
                this.provider = provider
                this.providerBanks = provider.banks
            }
        })
    }

    onProviderBankChange(accountNumber: string) {
        this.formGroup.get('providerBankName')?.patchValue(this.providerBanks.find(e => e.accountNumber == accountNumber)?.bankName)
    }

    onBankChange(accountNumber: string) {
        this.formGroup.get('bankName')?.patchValue(this.banks.find(e => e.accountNumber == accountNumber)?.bankName)
    }

    onSubmit(): void {
        if (this.provider === null) {
            this.navigationService.showMessage('Agrege un proveedor')
        } else {
            if (this.formGroup.valid) {
                this.isLoading = true
                this.navigationService.loadBarStart()
                const createdPaymentOrder = {
                    ...this.formGroup.value,
                    providerId: this.provider._id,
                }
                this.paymentOrdersService.create(createdPaymentOrder).subscribe({
                    next: paymentOrder => {
                        if (this.formData) {
                            this.paymentOrdersService.uploadFile(this.formData, paymentOrder._id).subscribe(() => {
                                this.isLoading = false
                                this.router.navigate(['/paymentOrders'])
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage('Registrado correctamente')
                            })
                        } else {
                            this.isLoading = false
                            this.router.navigate(['/paymentOrders'])
                            this.navigationService.loadBarFinish()
                            this.navigationService.showMessage('Registrado correctamente')
                        }
                    }, error: (error: HttpErrorResponse) => {
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage(error.error.message)
                    }
                })
            }
        }
    }

}
