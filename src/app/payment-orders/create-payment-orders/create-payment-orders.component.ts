import { Component, inject} from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router, RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { BanksService } from '../../banks/banks.service'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { DialogCreateProvidersComponent } from '../../providers/dialog-create-providers/dialog-create-providers.component'
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component'
import { ProviderModel } from '../../providers/provider.model'
import { PaymentOrdersService } from '../payment-orders.service'
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component'
import { DialogAttachFileComponent } from '../dialog-attach-file/dialog-attach-file.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { BankModel } from '../../banks/bank.model'

@Component({
    selector: 'app-create-payment-orders',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './create-payment-orders.component.html',
    styleUrls: ['./create-payment-orders.component.sass']
})
export class CreatePaymentOrdersComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly matDialog = inject(MatDialog)
    private readonly router = inject(Router)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly paymentOrdersService = inject(PaymentOrdersService)
    private readonly navigationService = inject(NavigationService)
    private readonly banksService = inject(BanksService)

    formGroup: FormGroup = this.formBuilder.group({
        paymentMethodId: '',
        concept: ['', Validators.required],
        charge: ['', Validators.required],
        serie: ['', Validators.required],
        observation: '',
        paymentAt: [new Date(), Validators.required],
        operationNumber: '',
        bankId: null,
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
            this.formGroup.patchValue({ paymentMethodId: (this.paymentMethods[0] || { id: '' }).id })
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
        this.formGroup.get('providerBankName')?.patchValue(this.providerBanks.find(e => e.accountNumber == accountNumber)?.name)
    }

    onBankChange(accountNumber: string) {
        this.formGroup.get('name')?.patchValue(this.banks.find(e => e.accountNumber == accountNumber)?.name)
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            const createdPaymentOrder = {
                ...this.formGroup.value,
                providerId: this.provider?.id,
            }
            this.paymentOrdersService.create(createdPaymentOrder).subscribe({
                next: paymentOrder => {
                    if (this.formData) {
                        this.paymentOrdersService.uploadFile(this.formData, paymentOrder.id).subscribe(() => {
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
