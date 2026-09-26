import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { CustomerModel } from '../../customers/customer.model'
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component'
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component'
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { NavigationService } from '../../navigation/navigation.service'
import { CreateCreditNoteItemModel } from '../create-credit-note-item.model'
import { CreateCreditNoteModel } from '../create-credit-note.model'
import { CreditNoteModel } from '../credit-note.model'
import { CreditNotesService } from '../credit-notes.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { CreditNoteItemsComponent } from '../credit-note-items/credit-note-items.component'
import { IgvCode } from '../../sales/igv-code.enum'

interface FormData {
    discount: any
    reasonCode: any
    reasonDescription: any
    observation: string
    createdAt: Date
}

@Component({
    selector: 'app-edit-credit-notes',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, CreditNoteItemsComponent],
    templateUrl: './edit-credit-notes.component.html',
    styleUrls: ['./edit-credit-notes.component.sass']
})
export class EditCreditNotesComponent {

    private readonly matDialog = inject(MatDialog)
    private readonly router = inject(Router)
    private readonly formBuilder = inject(FormBuilder)
    private readonly navigationService = inject(NavigationService)
    private readonly creditNotesService = inject(CreditNotesService)
    private readonly authService = inject(AuthService)

    formGroup: FormGroup = this.formBuilder.group({
        createdAt: new Date(),
        reasonCode: ['', Validators.required],
        reasonDescription: ['', Validators.required],
        discount: null,
        observation: '',
    } as FormData)

    creditNoteItems: CreateCreditNoteItemModel[] = []
    charge: number = 0
    $customer = signal<CustomerModel | null>(null)
    $isLoading = signal<boolean>(false)
    cash: number = 0
    creditNoteId: any | null = null
    creditNote: CreditNoteModel | null = null
    setting: SettingModel = new SettingModel()
    address: string = ''
    private office: OfficeModel = new OfficeModel()

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
    private handleCreditNoteItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleCreditNoteItems$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting

            const creditNote = this.creditNotesService.getCreditNote()
            if (creditNote === null) {
                this.router.navigate(['/creditNotes'])
            } else {
                this.creditNoteId = creditNote.id
                this.creditNote = creditNote
                this.formGroup.patchValue(creditNote)
                this.navigationService.setTitle(`Editar nota de credito ${creditNote.invoicePrefix}${this.office.serialPrefix}-${creditNote.invoiceNumber}`)
                this.$customer.set(creditNote.customer)
            }
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
                        data: this.setting.defaultSearchCustomer
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

        this.handleCreditNoteItems$ = this.creditNotesService.handleCreditNoteItems().subscribe(creditNoteItems => {
            this.creditNoteItems = creditNoteItems
            this.charge = 0
            for (const creditNoteItem of this.creditNoteItems) {
                if (creditNoteItem.igvCode !== IgvCode.BONIFICACION) {
                    this.charge += creditNoteItem.price * creditNoteItem.quantity
                }
            }
            const { discount } = this.formGroup.value
            this.charge -= discount
        })
    }

    onChangeDiscount() {
        const { discount } = this.formGroup.value
        this.charge = 0
        for (const creditNoteItem of this.creditNoteItems) {
            if (creditNoteItem.igvCode !== IgvCode.BONIFICACION) {
                this.charge += creditNoteItem.price * creditNoteItem.quantity
            }
        }
        this.charge -= discount
    }

    onSubmit() {
        try {
            const customer = this.$customer()
            if (!this.formGroup.valid) {
                throw new Error("Complete los campos")
            }

            this.navigationService.loadBarStart()

            if (this.creditNote === null || this.creditNoteId === null) {
                throw new Error("No hemos encontrado la nota de credito")
            } else {

                const formData: FormData = this.formGroup.value

                const creditNote: CreateCreditNoteModel = {
                    reasonCode: formData.reasonCode,
                    reasonDescription: formData.reasonDescription,
                    observation: formData.observation,
                    discount: formData.discount,
                    createdAt: formData.createdAt,
                    currencyCode: this.creditNote.currencyCode,
                    igvPercent: this.creditNote.igvPercent,
                    rcPercent: this.creditNote.rcPercent,
                    customerId: customer ? customer.id : null,
                }

                if (!this.creditNoteItems.length) {
                    throw new Error("Agrega un producto")
                }

                if (this.creditNoteItems.find(e => e.price === 0 || e.price === null)) {
                    throw new Error("El producto no puede tener precio 0")
                }

                this.$isLoading.set(true)
                this.creditNotesService.updateCreditNoteWithItems(
                    this.creditNoteId,
                    creditNote,
                    this.creditNoteItems
                ).subscribe({
                    next: () => {
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage('Se han guardado los cambios')
                        this.router.navigate(['/creditNotes'])
                    }, error: (error: HttpErrorResponse) => {
                        this.navigationService.loadBarFinish()
                        this.$isLoading.set(false)
                        this.navigationService.showMessage(error.error.message)
                    }
                })

            }
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
