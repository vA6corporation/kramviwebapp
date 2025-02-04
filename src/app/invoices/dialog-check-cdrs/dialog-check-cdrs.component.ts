import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { CdrModel } from '../cdr.model';
import { InvoicesService } from '../invoices.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-check-cdrs',
    imports: [MaterialModule],
    templateUrl: './dialog-check-cdrs.component.html',
    styleUrls: ['./dialog-check-cdrs.component.sass']
})
export class DialogCheckCdrsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly salesId: string[],
        private readonly invoicesService: InvoicesService,
        private readonly navigationService: NavigationService,
    ) { }

    cdrs: CdrModel[] = []
    isLoading = true

    ngOnInit(): void {
        this.navigationService.loadBarStart()
        this.invoicesService.getCheckCdrs(this.salesId).subscribe({
            next: cdrs => {
                this.navigationService.loadBarFinish()
                this.isLoading = false
                this.cdrs = cdrs
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.isLoading = false
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

}
