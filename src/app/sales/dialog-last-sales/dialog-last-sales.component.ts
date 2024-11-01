import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SaleModel } from '../sale.model';
import { SalesService } from '../sales.service';
import { AuthService } from '../../auth/auth.service';
import { PrintService } from '../../print/print.service';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-last-sales',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './dialog-last-sales.component.html',
    styleUrls: ['./dialog-last-sales.component.sass']
})
export class DialogLastSalesComponent implements OnInit {

    constructor(
        private readonly salesService: SalesService,
        private readonly authService: AuthService,
        private readonly printService: PrintService,
        private readonly navigationService: NavigationService,
        private readonly dialogRef: MatDialogRef<DialogLastSalesComponent>
    ) { }

    sales: SaleModel[] = []
    office: OfficeModel = new OfficeModel()
    setting: SettingModel = new SettingModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.salesService.getSalesByPage(1, 5, {}).subscribe(sales => {
            this.sales = sales
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting
        })
    }

    printSale(saleId: string) {
        this.dialogRef.close()
        this.navigationService.loadBarStart()
        this.salesService.getSaleById(saleId).subscribe({
            next: sale => {
                this.navigationService.loadBarFinish()
                switch (this.setting.papelImpresion) {
                    case 'a4':
                        this.printService.printA4Invoice(sale)
                        break
                    case 'ticket80mm':
                        this.printService.printTicket80mm(sale)
                        break
                    default:
                        this.printService.printTicket58mm(sale)
                        break
                }
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

}
