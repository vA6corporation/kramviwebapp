import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { CreditNotesService } from '../../credit-notes/credit-notes.service';
import { CustomerModel } from '../../customers/customer.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentModel } from '../../payments/payment.model';
import { RemissionGuidesService } from '../../remission-guides/remission-guides.service';
import { SaleItemModel } from '../../sales/sale-item.model';
import { SaleModel } from '../../sales/sale.model';
import { SalesService } from '../../sales/sales.service';
import { UserModel } from '../../users/user.model';
import { CdrModel } from '../cdr.model';
import { InvoicesService } from '../invoices.service';
import { TicketModel } from '../ticket.model';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

export interface DialogAdminData {
    saleId: string
    saleIds: string[]
}

@Component({
    selector: 'app-dialog-admin',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './dialog-admin.component.html',
    styleUrls: ['./dialog-admin.component.sass']
})
export class DialogAdminComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly data: DialogAdminData,
        private readonly salesService: SalesService,
        private readonly creditNotesService: CreditNotesService,
        private readonly remissionGuidesService: RemissionGuidesService,
        private readonly invoicesService: InvoicesService,
        private readonly authService: AuthService,
        private readonly navigationService: NavigationService,
        private readonly dialogRef: MatDialogRef<DialogAdminComponent>,
        private readonly formBuilder: FormBuilder,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        turnId: null,
        invoiceNumber: ['', Validators.required],
        invoiceType: '',
        currencyCode: '',
    })

    formDate: FormGroup = this.formBuilder.group({
        createdAt: new Date(),
    })

    formTicket: FormGroup = this.formBuilder.group({
        sunatCode: null,
    })

    formCdr: FormGroup = this.formBuilder.group({
        sunatCode: null,
    })

    sale: SaleModel | null = null
    customer: CustomerModel | null = null
    saleItems: SaleItemModel[] = []
    payments: PaymentModel[] = []
    office: OfficeModel | null = null
    user: UserModel | null = null
    cdr: CdrModel | null = null
    cdrTicket: CdrModel | null = null
    ticket: TicketModel | null = null
    private onUpdate$: EventEmitter<void> = new EventEmitter()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })
        this.fetchData()
    }

    handleUpdate() {
        return this.onUpdate$.asObservable()
    }

    fetchData() {
        this.salesService.getSaleById(this.data.saleId).subscribe(sale => {
            this.sale = sale
            const { saleItems, customer, payments, user, cdr } = sale
            this.customer = customer
            this.payments = payments
            this.saleItems = saleItems
            this.user = user
            this.cdr = cdr

            this.formGroup.patchValue(sale)
            this.formDate.patchValue(sale)
            this.formCdr.patchValue(cdr || {})
        })
        this.invoicesService.getDeleteTicketBySale(this.data.saleId).subscribe(ticket => {
            this.ticket = ticket
            this.formTicket.patchValue(ticket)
        })
    }

    onSubmitDate() {
        if (this.sale) {
            Object.assign(this.sale, this.formDate.value)
            this.salesService.updateDateSale(this.sale, this.data.saleId).subscribe({
                next: () => {
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.onUpdate$.emit()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onSubmit() {
        if (this.sale) {
            Object.assign(this.sale, this.formGroup.value)
            this.salesService.updateSale(this.sale, this.data.saleId).subscribe({
                next: () => {
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.onUpdate$.emit()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onUndelete() {
        if (this.sale) {
            Object.assign(this.sale, { deletedAt: null })
            this.salesService.updateDeleteSale(this.sale, this.data.saleId).subscribe({
                next: () => {
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.onUpdate$.emit()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onDeleteCdrTicket() {
        if (this.cdrTicket) {
            this.navigationService.loadBarStart()
            this.invoicesService.deleteCdrTicket(this.data.saleId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.onUpdate$.emit()
                this.fetchData()
            })
        }
    }

    onSubmitTicket() {
        if (this.ticket) {
            this.navigationService.loadBarStart()
            Object.assign(this.ticket, this.formTicket.value)
            this.salesService.updateTicket(this.ticket, this.ticket._id).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.onUpdate$.emit()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onSubmitCdr() {
        if (this.cdr) {
            this.navigationService.loadBarStart()
            Object.assign(this.cdr, this.formCdr.value)
            this.salesService.updateCdr(this.cdr, this.cdr._id).subscribe({
                next: () => {
                    this.onUpdate$.emit()
                    this.navigationService.loadBarFinish()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onDeleteCdr() {
        const ok = confirm('Esta seguro de eliminar el CDR?...')
        if (ok && this.cdr !== null) {
            this.invoicesService.deleteCdr(this.cdr._id).subscribe(() => {
                this.fetchData()
                this.onUpdate$.emit()
            })
        }
    }

    onDeleteSale() {
        const ok = confirm('Esta seguro de eliminar la venta?...')
        if (ok && this.sale !== null) {
            this.salesService.delete(this.sale._id).subscribe(() => {
                this.navigationService.showMessage('Eliminado correctamente')
                this.dialogRef.close()
                this.onUpdate$.emit()
            })

            this.creditNotesService.deleteBySale(this.data.saleId).subscribe(() => {

            })

            this.remissionGuidesService.deleteBySale(this.data.saleId).subscribe(() => {

            })
        }
    }

    onDeleteSales() {
        if (this.data.saleIds) {
            const ok = confirm('Esta seguro de eliminar las ventas?...')
            if (ok) {
                this.navigationService.loadBarStart()
                this.salesService.deleteMassive(this.data.saleIds).subscribe(() => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Eliminado correctamente')
                    this.dialogRef.close()
                    this.onUpdate$.emit()
                })
            }
        }
    }

    onDeleteTicket() {
        const ok = confirm('Esta seguro de eliminar el ticket')
        if (ok && this.ticket !== null) {
            this.invoicesService.deleteTicket(this.ticket._id).subscribe(() => {
                this.fetchData()
                this.onUpdate$.emit()
            })
        }
    }

    onDeleteInvoice() {
        const ok = confirm('Esta seguro de comunicar de baja')
        if (ok) {
            this.invoicesService.cancelInvoice(this.data.saleId, 'Error').subscribe(() => {
                this.onUpdate$.emit()
            })
        }
    }

}
