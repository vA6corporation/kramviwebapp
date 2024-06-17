import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { ProformasService } from '../proformas.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-sheet-print-proformas',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './sheet-print-proformas.component.html',
    styleUrls: ['./sheet-print-proformas.component.sass']
})
export class SheetPrintProformasComponent implements OnInit {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        private readonly proformaId: string,
        private readonly navigationService: NavigationService,
        private readonly bottomSheetRef: MatBottomSheetRef<SheetPrintProformasComponent>,
        private readonly proformasService: ProformasService,
        private readonly printService: PrintService,
    ) { }

    ngOnInit(): void {
    }

    onPrintTicket() {
        this.bottomSheetRef.dismiss();
        this.navigationService.loadBarStart();
        this.proformasService.getProformaById(this.proformaId).subscribe(proforma => {
            this.navigationService.loadBarFinish();
            this.printService.printTicketProforma(proforma);
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish();
            this.navigationService.showMessage(error.error.message);
        });
    }

    onPrintA4() {
        this.bottomSheetRef.dismiss();
        this.navigationService.loadBarStart();
        this.proformasService.getProformaById(this.proformaId).subscribe(proforma => {
            this.navigationService.loadBarFinish();
            this.printService.printA4Proforma(proforma);
        });
    }

    onPrintA4Image() {
        this.bottomSheetRef.dismiss();
        this.navigationService.loadBarStart();
        this.proformasService.getProformaById(this.proformaId).subscribe(proforma => {
            console.log(proforma);
            this.navigationService.loadBarFinish();
            this.printService.printA4ProformaImage(proforma);
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish();
            this.navigationService.showMessage(error.error.message);
        });
    }

}
