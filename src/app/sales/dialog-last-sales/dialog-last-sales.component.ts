import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { SaleModel } from '../sale.model'
import { SalesService } from '../sales.service'
import { AuthService } from '../../auth/auth.service'
import { PrintService } from '../../print/print.service'
import { NavigationService } from '../../navigation/navigation.service'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-dialog-last-sales',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-last-sales.component.html',
    styleUrls: ['./dialog-last-sales.component.sass']
})
export class DialogLastSalesComponent {

    private readonly salesService = inject(SalesService)
    private readonly authService = inject(AuthService)
    private readonly printService = inject(PrintService)
    private readonly navigationService = inject(NavigationService)
    private readonly dialogRef: MatDialogRef<DialogLastSalesComponent> = inject(MatDialogRef)

    $sales = signal<SaleModel[]>([])
    $office = signal<OfficeModel>(new OfficeModel())
    private setting: SettingModel = new SettingModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.salesService.getSalesOfTheDay().subscribe(sales => {
            this.$sales.set(sales)
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$office.set(auth.office)
            this.setting = auth.setting
        })
    }

    printSale(saleId: any) {
        this.dialogRef.close()
        this.navigationService.loadBarStart()
        this.salesService.getSaleById(saleId).subscribe({
            next: sale => {
                this.navigationService.loadBarFinish()
                switch (this.setting.defaultTicket) {
                    case 'A4':
                        this.printService.printA4Invoice(sale)
                        break
                    case '80MM':
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
