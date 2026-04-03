import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { SettingModel } from '../../settings/setting.model'
import { CustomerModel } from '../../customers/customer.model'
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component'
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component'
import { NavigationService } from '../../navigation/navigation.service'
import { CreateProformaModel } from '../create-proforma.model'
import { ProformaItemModel } from '../proforma-item.model'
import { ProformaModel } from '../proforma.model'
import { ProformasService } from '../proformas.service'
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { ProformaItemsComponent } from '../proforma-items/proforma-items.component'
import { IgvCode } from '../../sales/igv-code.enum'

interface FormData {
    observation: string
    currencyCode: string
    discount: any
}

@Component({
    selector: 'app-charge-edit-proformas',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, ProformaItemsComponent],
    templateUrl: './charge-edit-proformas.component.html',
    styleUrls: ['./charge-edit-proformas.component.sass']
})
export class ChargeEditProformasComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly matDialog = inject(MatDialog)
    private readonly proformasService = inject(ProformasService)
    private readonly navigationService = inject(NavigationService)
    private readonly authService = inject(AuthService)

    formGroup: FormGroup = this.formBuilder.group({
        observation: '',
        currencyCode: 'PEN',
        discount: null,
    } as FormData)

    proformaItems: ProformaItemModel[] = []
    charge: number = 0
    $customer = signal<CustomerModel | null>(null)
    $isLoading = signal<boolean>(false)
    cash: number = 0
    $setting = signal<SettingModel>(new SettingModel())
    private proforma: ProformaModel | null = null

    private handleClickMenu$: Subscription = new Subscription()
    private handleProformaItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleProformaItems$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Guardar proforma')

        this.proforma = this.proformasService.getProforma()
        if (this.proforma === null) {
            this.router.navigate(['/proformas'])
        } else {
            this.$customer.set(this.proforma.customer)
            this.formGroup.patchValue(this.proforma)
        }

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$setting.set(auth.setting)
        })

        this.navigationService.setMenu([
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_customer':
                    const dialogRef = this.matDialog.open(DialogSearchCustomersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.$setting().defaultSearchCustomer
                    })

                    dialogRef.afterClosed().subscribe(customer => {
                        if (customer) {
                            this.$customer.set(customer)
                        }
                    })

                    dialogRef.componentInstance.handleCreateCustomer().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateCustomersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(customer => {
                            if (customer) {
                                this.$customer.set(customer)
                            }
                        })
                    })
                    break
                default:
                    break
            }
        })

        this.handleProformaItems$ = this.proformasService.handleProformaItems().subscribe(proformaItems => {
            this.proformaItems = proformaItems
            this.charge = 0
            for (const proformaItem of this.proformaItems) {
                if (proformaItem.igvCode !== IgvCode.BONIFICACION) {
                    this.charge += proformaItem.price * proformaItem.quantity
                }
            }
            this.charge -= this.proforma?.discount || 0
        })
    }

    onChangePercent() {
        const { igvPercent } = this.formGroup.value
        if (igvPercent) {
            this.formGroup.patchValue({ igvPercent: 18 })
        } else {
            this.formGroup.patchValue({ igvPercent: 0 })
        }
    }

    addCash(cash: number) {
        this.cash += cash
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    onChangeDiscount() {
        const { discount } = this.formGroup.value
        this.charge = 0
        for (const proformaItem of this.proformaItems) {
            if (proformaItem.igvCode !== IgvCode.BONIFICACION) {
                this.charge += proformaItem.price * proformaItem.quantity
            }
        }
        this.charge -= discount
    }

    onSubmit() {
        try {
            if (this.proforma === null) {
                throw new Error('La proforma no existe')
            }

            if (!this.proformaItems.length) {
                throw new Error('Agrega un producto')
            }

            if (this.proformaItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error('El producto no puede tener precio 0')
            }

            this.$isLoading.set(true)
            this.navigationService.loadBarStart()

            const formData: FormData = this.formGroup.value
            const customer = this.$customer()

            const proforma: CreateProformaModel = {
                observation: formData.observation,
                discount: formData.discount,
                igvPercent: this.proforma.igvPercent,
                rcPercent: this.proforma.rcPercent,
                currencyCode: formData.currencyCode || 'PEN',
                customerId: customer ? customer.id : null,
            }

            this.proformasService.update(proforma, this.proformaItems, this.proforma.id).subscribe({
                next: () => {
                    this.proformasService.setProformaItems([])
                    this.router.navigate(['/proformas'])
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                }
            })
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
            this.$isLoading.set(false)
            this.navigationService.loadBarFinish()
        }
    }

    onEditCustomer() {
        const dialogRef = this.matDialog.open(DialogEditCustomersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.$customer(),
        })

        dialogRef.afterClosed().subscribe(customer => {
            if (customer) {
                this.$customer.set(customer)
            }
        })
    }

}
