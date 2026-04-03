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
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { NavigationService } from '../../navigation/navigation.service'
import { PrintService } from '../../print/print.service'
import { UserModel } from '../../users/user.model'
import { CreateProformaModel } from '../create-proforma.model'
import { ProformaItemModel } from '../proforma-item.model'
import { ProformasService } from '../proformas.service'
import { MaterialModule } from '../../material.module'
import { ProformaItemsComponent } from '../proforma-items/proforma-items.component'
import { CommonModule } from '@angular/common'
import { IgvCode } from '../../sales/igv-code.enum'

interface FormData {
    observation: string
    currencyCode: string
    discount: any
}

@Component({
    selector: 'app-charge-proformas',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, ProformaItemsComponent],
    templateUrl: './charge-proformas.component.html',
    styleUrls: ['./charge-proformas.component.sass']
})
export class ChargeProformasComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly proformasService = inject(ProformasService)
    private readonly navigationService = inject(NavigationService)
    private readonly matDialog = inject(MatDialog)
    private readonly printService = inject(PrintService)
    private readonly authService = inject(AuthService)

    formGroup: FormGroup = this.formBuilder.group({
        observation: '',
        currencyCode: 'PEN',
        discount: null,
        discountPercent: null,
    } as FormData)
    proformaItems: ProformaItemModel[] = []
    charge: number = 0
    $customer = signal<CustomerModel | null>(null)
    $isLoading = signal<boolean>(false)
    cash: number = 0
    $setting = signal<SettingModel>(new SettingModel())
    private user: UserModel = new UserModel()

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

        this.navigationService.setMenu([
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$setting.set(auth.setting)
            this.user = auth.user
        })

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

            const { discount, discountPercent } = this.formGroup.value

            if (discountPercent) {
                let discount = (this.charge / 100) * discountPercent
                this.charge = this.charge - discount
                this.formGroup.patchValue({ discount })
            } else {
                this.charge -= discount
            }
        })
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

    onChangeDiscountPercent() {
        const { discountPercent } = this.formGroup.value
        let charge = 0
        for (const proformaItem of this.proformaItems) {
            if (proformaItem.igvCode !== IgvCode.BONIFICACION) {
                charge += proformaItem.price * proformaItem.quantity
            }
        }
        let discount = 0
        if (discountPercent) {
            discount = (charge / 100) * discountPercent
            this.charge = charge - discount
            this.formGroup.patchValue({ discount })
        } else {
            this.charge = charge
            this.formGroup.patchValue({ discount })
        }
    }

    onSubmit() {
        try {
            if (!this.proformaItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.proformaItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            this.$isLoading.set(true)
            this.navigationService.loadBarStart()

            const formData: FormData = this.formGroup.value
            const customer = this.$customer()

            const createdProforma: CreateProformaModel = {
                observation: formData.observation,
                discount: formData.discount,
                currencyCode: formData.currencyCode || 'PEN',
                igvPercent: this.$setting().defaultIgvPercent,
                rcPercent: this.$setting().defaultRcPercent,
                customerId: customer ? customer.id : null,
            }

            this.proformasService.create(createdProforma, this.proformaItems).subscribe({
                next: proforma => {
                    proforma.user = this.user
                    proforma.proformaItems = this.proformaItems
                    proforma.customer = customer

                    this.printService.printA4Proforma(proforma)
                    this.proformasService.setProformaItems([])

                    this.router.navigate(['/proformas'])

                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
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
