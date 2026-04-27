import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, RouterModule } from '@angular/router'
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
import { DialogPdfComponent } from '../dialog-pdf/dialog-pdf.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { BankModel } from '../../banks/bank.model'

@Component({
    selector: 'app-edit-payment-orders',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './edit-payment-orders.component.html',
    styleUrls: ['./edit-payment-orders.component.sass']
})
export class EditPaymentOrdersComponent {

    private readonly paymentOrdersService = inject(PaymentOrdersService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly banksService = inject(BanksService)
    private readonly navigationService = inject(NavigationService)
    private readonly formBuilder = inject(FormBuilder)
    private readonly matDialog = inject(MatDialog)
    private readonly activatedRoute = inject(ActivatedRoute)

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
    $paymentMethods = signal<PaymentMethodModel[]>([])
    $isLoading = signal<boolean>(false)
    $provider = signal<ProviderModel | null>(null)
    $banks = signal<BankModel[]>([])
    private paymentOrderId: string = ''
    private urlPdf: string | null = null

    private handleClickMenu$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Editar orden de pago')

        this.navigationService.setMenu([
            //{ id: 'attach_file', label: 'Adjuntar PDF', icon: 'attach_file', show: true },
            { id: 'add_provider', label: 'Agregar proveedor', icon: 'person_add', show: true },
        ])

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.$paymentMethods.set(paymentMethods)
            this.formGroup.patchValue({ paymentMethodId: (paymentMethods[0] || { id: '' }).id })
        })

        this.banksService.getBanks().subscribe(banks => {
            this.$banks.set(banks)
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_provider': {
                    const dialogRef = this.matDialog.open(DialogSearchProvidersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })

                    dialogRef.afterClosed().subscribe(provider => {
                        if (provider) {
                            this.$provider.set(provider)
                        }
                    })

                    dialogRef.componentInstance.handleAddProvider().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateProvidersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(provider => {
                            if (provider) {
                                this.$provider.set(provider)
                                this.formGroup.get('name')?.reset()
                                this.formGroup.get('accountNumber')?.reset()
                            }
                        })
                    })
                    break
                }

                case 'attach_file': {
                    this.onDialogPdf()
                    break
                }
            }
        })

        this.paymentOrderId = this.activatedRoute.snapshot.params['paymentOrderId']
        this.paymentOrdersService.getPaymentOrderById(this.paymentOrderId).subscribe(paymentOrder => {
            this.urlPdf = paymentOrder.urlPdf
            this.formGroup.patchValue(paymentOrder)
            this.$provider.set(paymentOrder.provider)
        })
    }

    onDialogPdf() {
        const dialogRef = this.matDialog.open(DialogPdfComponent, {
            width: '95vw',
            height: '90vh',
            position: { top: '20px' },
            data: this.urlPdf
        })

        dialogRef.componentInstance.handleDeletePdf().subscribe(() => {
            this.navigationService.loadBarStart()
            this.paymentOrdersService.deleteFile(this.paymentOrderId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.urlPdf = null
            })
        })

        dialogRef.componentInstance.handleUploadPdf().subscribe(file => {
            const formData = new FormData()
            formData.append('file', file, file.name)
            this.navigationService.loadBarStart()
            this.paymentOrdersService.uploadFile(formData, this.paymentOrderId).subscribe({
                next: res => {
                    this.navigationService.loadBarFinish()
                    this.urlPdf = res.urlPdf
                    this.onDialogPdf()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })
    }

    onEditProvider() {
        const dialogRef = this.matDialog.open(DialogEditProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.$provider(),
        })

        dialogRef.afterClosed().subscribe(provider => {
            if (provider) {
                this.$provider.set(provider)
            }
        })
    }

    onBankChange(accountNumber: string) {
        this.formGroup.get('name')?.patchValue(this.$banks().find(e => e.accountNumber == accountNumber)?.name)
    }

    onSubmit(): void {
        const provider = this.$provider()
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.navigationService.loadBarStart()
            const createdPaymentOrder = {
                ...this.formGroup.value,
                providerId: provider ? provider.id : null,
            }
            this.paymentOrdersService.update(createdPaymentOrder, this.paymentOrderId).subscribe({
                next: () => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.navigationService.back()
                }, error: (error: HttpErrorResponse) => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
