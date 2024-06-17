import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Params } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { RemissionGuidesService } from '../remission-guides.service';
import { PrintService } from '../../print/print.service';

@Component({
  selector: 'app-sheet-remission-guides',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './sheet-remission-guides.component.html',
  styleUrl: './sheet-remission-guides.component.sass'
})
export class SheetRemissionGuidesComponent {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        readonly remissionGuideId: string,
        readonly bottomSheetRef: MatBottomSheetRef<SheetRemissionGuidesComponent>,
        private readonly remissionGuidesService: RemissionGuidesService,
        private readonly navigationService: NavigationService,
        private readonly printService: PrintService,
        private readonly authService: AuthService,
    ) { }

    private onSendRemissionGuide$: EventEmitter<void> = new EventEmitter()
    private sunattk: string = ''
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

    handleSendRemissionGuide() {
        return this.onSendRemissionGuide$
    }

    onExportPdfTicket() {
        this.bottomSheetRef.dismiss()
        this.remissionGuidesService.getRemissionGuideById(this.remissionGuideId).subscribe(remissionGuide => {
            this.printService.exportRemissionGuidePdfTicket80mm(remissionGuide)
        })
    }

    onExportPdf() {
        this.bottomSheetRef.dismiss()
        this.remissionGuidesService.getRemissionGuideById(this.remissionGuideId).subscribe(remissionGuide => {
            this.printService.exportPdfA4RemissionGuide(remissionGuide)
        })
    }

    onSendRemissionGuide() {
        this.bottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        if (this.sunattk) {
            this.remissionGuidesService.sendRemissionGuide(this.remissionGuideId, this.sunattk).subscribe({
                next: () => {
                    this.onSendRemissionGuide$.next()
                    this.navigationService.showMessage('Enviado a sunat')
                    this.navigationService.loadBarFinish()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.navigationService.loadBarFinish()
                }
            })
        } else {
            const params: Params = {
                clientId: this.business.clientId,
                clientSecret: this.business.clientSecret
            }
            this.remissionGuidesService.getSunatToken(params).subscribe({
                next: res => {
                    this.navigationService.loadBarFinish()
                    this.sunattk = res.sunattk
                    this.onSendRemissionGuide()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
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
        const remissionGuide = await lastValueFrom(this.remissionGuidesService.getRemissionGuideById(this.remissionGuideId))
        const fileName = `${this.business.ruc}-09-T${this.office.serialPrefix}-${remissionGuide.remissionGuideNumber}.zip`
        if (remissionGuide.cdr) {
            try {
                const blobCdr = await this.remissionGuidesService.getCdr(remissionGuide.cdr._id)
                const urlCdr = window.URL.createObjectURL(blobCdr)
                this.navigationService.loadBarFinish()
                this.downloadFile(urlCdr, 'R-' + fileName)
                const blobXml = await this.remissionGuidesService.getXml(remissionGuide.cdr._id)
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
            this.navigationService.showMessage('No hay CDR')
            this.navigationService.loadBarFinish()
        }
    }

}
