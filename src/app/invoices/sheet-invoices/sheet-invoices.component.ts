import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { DialogCreditNotesComponent } from '../../credit-notes/dialog-credit-notes/dialog-credit-notes.component';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogRemissionGuidesComponent } from '../../remission-guides/dialog-remission-guides/dialog-remission-guides.component';
import { SalesService } from '../../sales/sales.service';
import { DialogSendEmailComponent } from '../dialog-send-email/dialog-send-email.component';
import { InvoicesService } from '../invoices.service';

@Component({
    selector: 'app-sheet-invoices',
    templateUrl: './sheet-invoices.component.html',
    styleUrls: ['./sheet-invoices.component.sass']
})
export class SheetInvoicesComponent {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        readonly saleId: string,
        readonly bottomSheetRef: MatBottomSheetRef<SheetInvoicesComponent>,
        private readonly matDialog: MatDialog,
        private readonly navigationService: NavigationService,
        private readonly invoicesService: InvoicesService,
        private readonly authService: AuthService,
        private readonly salesService: SalesService,
    ) { }

    private onSendInvoice$: EventEmitter<void> = new EventEmitter()
    private office: OfficeModel = new OfficeModel()
    private business: BusinessModel = new BusinessModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.business = auth.business
        })
    }

    handleSendInvoice() {
        return this.onSendInvoice$
    }

    onCreditNoteDialog() {
        this.bottomSheetRef.dismiss()
        this.matDialog.open(DialogCreditNotesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.saleId,
        })
    }

    onRemissionGuideDialog() {
        this.bottomSheetRef.dismiss()

        this.matDialog.open(DialogRemissionGuidesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.saleId,
        })
    }

    onEmailDialog() {
        this.bottomSheetRef.dismiss()
        this.matDialog.open(DialogSendEmailComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.saleId,
        })
    }

    onStatusCdr() {
        this.bottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        this.invoicesService.statusCdr(this.saleId).subscribe({
            next: cdr => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(cdr.sunatMessage)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    downloadFile(url: string, fileName: string) {
        const link = document.createElement("a")
        link.download = fileName
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    async onDownloadXmlCdr() {
        this.bottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        const sale = await lastValueFrom(this.salesService.getSaleById(this.saleId))
        const fileName = `${this.business.ruc}-${sale.invoiceCode}-${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}.zip`
        if (sale.cdr) {
            try {
                const blobCdr = await this.invoicesService.getCdr(sale.cdr._id)
                const urlCdr = window.URL.createObjectURL(blobCdr)
                this.navigationService.loadBarFinish()
                this.downloadFile(urlCdr, 'R-' + fileName)
                const blobXml = await this.invoicesService.getXml(sale.cdr._id)
                const urlXml = window.URL.createObjectURL(blobXml)
                this.navigationService.loadBarFinish()
                this.downloadFile(urlXml, fileName)
            } catch (error) {
                this.navigationService.loadBarFinish()
                if (error instanceof Error) {
                    this.navigationService.showMessage(error.message)
                }
            }
        } else {
            this.invoicesService.sendInvoice(this.saleId).subscribe({
                next: () => {
                    this.onSendInvoice$.emit()
                    this.onDownloadXmlCdr()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.navigationService.loadBarFinish()
                }
            })
        }
    }

    onSendInvoice() {
        this.bottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        this.invoicesService.sendInvoice(this.saleId).subscribe({
            next: () => {
                this.onSendInvoice$.emit()
                this.navigationService.showMessage('Enviado a sunat')
                this.navigationService.loadBarFinish()
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
                this.navigationService.loadBarFinish()
            }
        })
    }

}
