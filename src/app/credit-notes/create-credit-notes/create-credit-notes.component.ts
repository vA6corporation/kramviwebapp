import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { CustomerModel } from '../../customers/customer.model'
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component'
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component'
import { NavigationService } from '../../navigation/navigation.service'
import { CreateSaleItemModel } from '../../sales/create-sale-item.model'
import { SaleModel } from '../../sales/sale.model'
import { SalesService } from '../../sales/sales.service'
import { UserModel } from '../../users/user.model'
import { CreateCreditNoteModel } from '../create-credit-note.model'
import { CreditNotesService } from '../credit-notes.service'
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { SaleItemsComponent } from '../../sales/sale-items/sale-items.component'
import { IgvCode } from '../../sales/igv-code.enum'

interface FormData {
    discount: any,
    reasonCode: any,
    reasonDescription: any,
    observation: string,
    createdAt: Date,
}

@Component({
    selector: 'app-create-credit-notes',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, SaleItemsComponent],
    templateUrl: './create-credit-notes.component.html',
    styleUrls: ['./create-credit-notes.component.sass']
})
export class CreateCreditNotesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly salesService = inject(SalesService)
    private readonly creditNotesService = inject(CreditNotesService)
    private readonly authService = inject(AuthService)
    private readonly activatedRoute = inject(ActivatedRoute)

    formGroup: FormGroup = this.formBuilder.group({
        createdAt: new Date(),
        reasonCode: ['', Validators.required],
        reasonDescription: ['', Validators.required],
        observation: '',
        discount: null,
        discountPercent: null
    })
    saleItems: CreateSaleItemModel[] = []
    $charge = signal<number>(0)
    $customer = signal<CustomerModel | null>(null)
    $isLoading = signal<boolean>(false)
    cash: number = 0
    saleId: any = ''
    sale: SaleModel | null = null
    office: OfficeModel = new OfficeModel()
    $setting = signal<SettingModel>(new SettingModel())
    user: UserModel = new UserModel()

    reasons = [
        { code: '01', label: 'ANULACION DE LA OPERACION' },
        { code: '02', label: 'ANULACION POR ERROR EN EL RUC' },
        { code: '03', label: 'CORRECCION POR ERROR EN LA DESCRIPCION' },
        { code: '04', label: 'DESCUENTO GLOBAL' },
        { code: '05', label: 'DESCUENTO POR ITEM' },
        { code: '06', label: 'DEVOLUCION TOTAL' },
        { code: '07', label: 'DEVOLUCION PARCIAL' },
        { code: '08', label: 'BONIFICACION' },
        { code: '09', label: 'DISMINUCION EN EL VALOR' },
    ]

    private handleClickMenu$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.salesService.setSaleItems([])
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
            this.$setting.set(auth.setting)
            this.office = auth.office
        })

        this.saleId = this.activatedRoute.snapshot.params['saleId']

        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            this.navigationService.setTitle(`Nueva nota de credito ${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)
            this.sale = sale
            //this.salesService.setSale(sale)
            this.$customer.set(sale.customer)
            this.salesService.setSaleItems(sale.saleItems)
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

        this.navigationService.setTitle('Cobrar')

        this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
            this.saleItems = saleItems
            this.$charge.set(0)
            let charge = 0

            for (const saleItem of this.saleItems) {
                if (saleItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += saleItem.price * saleItem.quantity
                }
            }

            const { discount, discountPercent } = this.formGroup.value

            if (discountPercent) {
                let discount = (charge / 100) * discountPercent
                this.$charge.set(charge - discount)
                this.formGroup.patchValue({ discount })
            } else {
                this.$charge.set(charge - discount)
            }
        })
    }

    onChangeDiscount() {
        this.$charge.set(0)
        let charge = 0

        const { discount } = this.formGroup.value

        for (const saleItem of this.saleItems) {
            if (saleItem.igvCode !== IgvCode.BONIFICACION) {
                charge += saleItem.price * saleItem.quantity
            }
        }

        this.$charge.set(charge - discount)
    }

    onChangeDiscountPercent() {
        let charge = 0
        let discount = 0

        const { discountPercent } = this.formGroup.value

        for (const saleItem of this.saleItems) {
            if (saleItem.igvCode !== IgvCode.BONIFICACION) {
                charge += saleItem.price * saleItem.quantity
            }
        }

        if (discountPercent) {
            discount = (charge / 100) * discountPercent
            this.$charge.set(charge - discount)
            this.formGroup.patchValue({ discount })
        } else {
            this.$charge.set(charge)
            this.formGroup.patchValue({ discount })
        }
    }

    onSubmit() {
        try {
            const customer = this.$customer()
            const charge = this.$charge()

            if (!this.formGroup.valid) {
                throw new Error("Complete los campos")
            }

            if (this.sale === null || this.saleId === null) {
                throw new Error("No hemos encontrado la venta")
            }

            if (!this.saleItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.saleItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            const formData: FormData = this.formGroup.value

            const createdCreditNote: CreateCreditNoteModel = {
                reasonCode: formData.reasonCode,
                discount: formData.discount || null,
                reasonDescription: formData.reasonDescription,
                observation: formData.observation,
                createdAt: formData.createdAt,
                currencyCode: this.sale.currencyCode,
                igvPercent: this.sale.igvPercent,
                rcPercent: this.sale.rcPercent,
                customerId: customer ? customer.id : null,
            }

            this.$isLoading.set(true)
            this.navigationService.loadBarStart()

            this.creditNotesService.create(this.sale, createdCreditNote, this.saleItems, this.saleId).subscribe({
                next: () => {
                    this.salesService.setSaleItems([])
                    const queryParams: Params = { tabIndex: 1 }
                    this.router.navigate(['/creditNotes'], { queryParams })
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
