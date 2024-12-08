import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { NavigationService } from '../../navigation/navigation.service';
import { WorkerModel } from '../../workers/worker.model';
import { WorkersService } from '../../workers/workers.service';
import { CreateCreditNoteItemModel } from '../create-credit-note-item.model';
import { CreateCreditNoteModel } from '../create-credit-note.model';
import { CreditNoteModel } from '../credit-note.model';
import { CreditNotesService } from '../credit-notes.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { CreditNoteItemsComponent } from '../credit-note-items/credit-note-items.component';

interface FormData {
    discount: any
    reasonCode: any
    reasonDescription: any
    observations: string
    emitionAt: Date
    workerId: string | null
}

@Component({
    selector: 'app-edit-credit-notes',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, CreditNoteItemsComponent],
    templateUrl: './edit-credit-notes.component.html',
    styleUrls: ['./edit-credit-notes.component.sass']
})
export class EditCreditNotesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly creditNotesService: CreditNotesService,
        private readonly workersService: WorkersService,
        private readonly matDialog: MatDialog,
        private readonly authService: AuthService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        emitionAt: new Date(),
        reasonCode: ['', Validators.required],
        reasonDescription: ['', Validators.required],
        discount: null,
        observations: '',
        workerId: null,
    } as FormData)

    creditNoteItems: CreateCreditNoteItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    cash: number = 0
    creditNoteId: string | null = null
    creditNote: CreditNoteModel | null = null
    office: OfficeModel = new OfficeModel()
    setting: SettingModel = new SettingModel()
    addresses: string[] = []
    workers: WorkerModel[] = []

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
    private handleWorkers$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleCreditNoteItems$.unsubscribe()
        this.handleWorkers$.unsubscribe()
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
                this.creditNoteId = creditNote._id
                this.creditNote = creditNote
                this.formGroup.patchValue(creditNote)
                this.navigationService.setTitle(`Editar nota de credito ${creditNote.invoicePrefix}${this.office.serialPrefix}-${creditNote.invoiceNumber}`)
                this.customer = creditNote.customer
            }
        })

        this.handleWorkers$ = this.workersService.handleWorkers().subscribe(workers => {
            this.workers = workers
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

                default:
                    break
            }
        })

        this.handleCreditNoteItems$ = this.creditNotesService.handleCreditNoteItems().subscribe(creditNoteItems => {
            this.creditNoteItems = creditNoteItems
            this.charge = 0
            for (const creditNoteItem of this.creditNoteItems) {
                if (creditNoteItem.igvCode !== '11') {
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
            if (creditNoteItem.igvCode !== '11') {
                this.charge += creditNoteItem.price * creditNoteItem.quantity
            }
        }
        this.charge -= discount
    }

    onSubmit() {
        try {
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
                    observations: formData.observations,
                    discount: formData.discount,
                    emitionAt: formData.emitionAt,
                    customerId: this.customer?._id || null,
                    workerId: formData.workerId,
                }

                if (!this.creditNoteItems.length) {
                    throw new Error("Agrega un producto")
                }

                if (this.creditNoteItems.find(e => e.price === 0 || e.price === null)) {
                    throw new Error("El producto no puede tener precio 0")
                }

                this.isLoading = true
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
                        this.isLoading = false
                        this.navigationService.showMessage(error.error.message)
                    }
                })

            }
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
