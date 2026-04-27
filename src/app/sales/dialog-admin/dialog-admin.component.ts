import { Component, EventEmitter, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { CreditNotesService } from '../../credit-notes/credit-notes.service'
import { CustomerModel } from '../../customers/customer.model'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentModel } from '../../payments/payment.model'
import { RemissionGuidesService } from '../../remission-guides/remission-guides.service'
import { SaleItemModel } from '../../sales/sale-item.model'
import { SaleModel } from '../../sales/sale.model'
import { SalesService } from '../../sales/sales.service'
import { UserModel } from '../../users/user.model'
import { CdrModel } from '../cdr.model'
import { InvoicesService } from '../../invoices/invoices.service'
import { TicketModel } from '../ticket.model'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

export interface DialogAdminData {
    saleId: any
    saleIds: number[]
}

@Component({
    selector: 'app-dialog-admin',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './dialog-admin.component.html',
    styleUrls: ['./dialog-admin.component.sass']
})
export class DialogAdminComponent {

    readonly data: DialogAdminData = inject(MAT_DIALOG_DATA)
    private readonly dialogRef: MatDialogRef<DialogAdminComponent> = inject(MatDialogRef)
    private readonly formBuilder = inject(FormBuilder)
    private readonly salesService = inject(SalesService)
    private readonly creditNotesService = inject(CreditNotesService)
    private readonly remissionGuidesService = inject(RemissionGuidesService)
    private readonly invoicesService = inject(InvoicesService)
    private readonly authService = inject(AuthService)
    private readonly navigationService = inject(NavigationService)

    formGroup: FormGroup = this.formBuilder.group({
        turnId: null,
        invoiceNumber: ['', Validators.required],
        invoiceCode: '',
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

    $sale = signal<SaleModel | null>(null)
    $office = signal<OfficeModel | null>(null)
    $user = signal<UserModel | null>(null)
    $cdr = signal<CdrModel | null>(null)
    $ticket = signal<TicketModel | null>(null)
    cdrTicket: CdrModel | null = null
    private onUpdate$: EventEmitter<void> = new EventEmitter()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$office.set(auth.office)
        })
        this.fetchData()
    }

    handleUpdate() {
        return this.onUpdate$.asObservable()
    }

    fetchData() {
        this.salesService.getSaleById(this.data.saleId).subscribe(sale => {
            const { user, cdr } = sale
            console.log(sale)
            this.$sale.set(sale)
            this.$user.set(user)
            this.$cdr.set(cdr)

            this.formGroup.patchValue(sale)
            this.formDate.patchValue(sale)
            this.formCdr.patchValue(cdr || {})
        })
        this.invoicesService.getDeleteTicketBySale(this.data.saleId).subscribe(ticket => {
            this.$ticket.set(ticket)
            this.formTicket.patchValue(ticket)
        })
    }

    onSubmitDate() {
        const sale = this.$sale()
        if (sale) {
            Object.assign(sale, this.formDate.value)
            this.salesService.updateDateSale(sale, this.data.saleId).subscribe({
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
        const sale = this.$sale()
        if (sale) {
            Object.assign(sale, this.formGroup.value)
            this.salesService.update(sale, this.data.saleId).subscribe({
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
        const sale = this.$sale()
        if (sale) {
            Object.assign(sale, { deletedAt: null })
            this.salesService.updateDeleteSale(sale, this.data.saleId).subscribe({
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
        const ticket = this.$ticket()
        if (ticket) {
            this.navigationService.loadBarStart()
            Object.assign(ticket, this.formTicket.value)
            this.salesService.updateTicket(ticket, ticket.id).subscribe({
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
        const cdr = this.$cdr()
        if (cdr) {
            this.navigationService.loadBarStart()
            Object.assign(cdr, this.formCdr.value)
            this.salesService.updateCdr(cdr, cdr.id).subscribe({
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
        const cdr = this.$cdr()
        if (ok && cdr) {
            this.invoicesService.deleteCdr(cdr.id).subscribe(() => {
                this.fetchData()
                this.onUpdate$.emit()
            })
        }
    }

    onDeleteSale() {
        const ok = confirm('Esta seguro de eliminar la venta?...')
        const sale = this.$sale()
        if (ok && sale) {
            this.salesService.delete(sale.id).subscribe(() => {
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
        const ticket = this.$ticket()
        if (ok && ticket) {
            this.invoicesService.deleteTicket(ticket.id).subscribe(() => {
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
