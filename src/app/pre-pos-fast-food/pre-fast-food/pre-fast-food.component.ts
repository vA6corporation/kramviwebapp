import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { DialogPasswordComponent } from '../../boards/dialog-password/dialog-password.component';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { PreSaleModel } from '../../pre-sales/pre-sale.model';
import { PrintService } from '../../print/print.service';
import { CreateSaleItemModel } from '../../sales/create-sale-item.model';
import { SaleModel } from '../../sales/sale.model';
import { SalesService } from '../../sales/sales.service';

@Component({
    selector: 'app-pre-fast-food',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './pre-fast-food.component.html',
    styleUrl: './pre-fast-food.component.sass'
})
export class PreFastFoodComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly printService: PrintService,
        private readonly salesService: SalesService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    sales: SaleModel[] = []
    selectedIndex: number = 0
    private setting = new SettingModel()

    ngOnInit(): void {
        this.navigationService.setTitle('Entregas')
        this.salesService.setSaleItems([])
        this.fetchData()

        this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
    }

    checkHours(createdAt: string): string {
        const date = new Date(createdAt)
        const currentDate = new Date()
        const dif = Math.abs(currentDate.getTime() - date.getTime())
        let minutes = Math.round((dif / 1000) / 60)
        if (minutes > 60) {
            let hours = 0
            while (minutes > 60) {
                hours++
                minutes -= 60
            }
            if (minutes > 9) {
                return `${hours}:${minutes}`
            } else {
                return `${hours}:0${minutes}`
            }
        } else {
            if (minutes > 9) {
                return `0:${minutes}`
            } else {
                return `0:0${minutes}`
            }
        }
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.salesService.getSalesOfTheDay().subscribe({
            next: sales => {
                this.navigationService.loadBarFinish()
                this.sales = sales
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onDeliverySale(saleId: string) {
        this.navigationService.loadBarStart()
        this.salesService.updateDeliverySale(saleId).subscribe(() => {
            this.navigationService.loadBarFinish()
            this.fetchData()
        })
    }

    onDeliverySaleItem(saleId: string, saleItemId: string) {
        this.navigationService.loadBarStart()
        this.salesService.updateDeliverySaleItem(saleId, saleItemId).subscribe(() => {
            this.navigationService.loadBarFinish()
            this.fetchData()
        })
    }

    onPrintCommand(sale: SaleModel) {
        this.printService.printCommandFastFood80mm(sale)
    }

    onEditSale(sale: SaleModel) {
        if (this.setting.password) {
            const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    this.router.navigate(['/posStandard', sale._id, 'edit'])
                }
            })
        } else {
            this.router.navigate(['/posStandard', sale._id, 'edit'])
        }
    }

    onCharge(preSale: PreSaleModel) {
        const saleItems: CreateSaleItemModel[] = []
        for (const preSaleItem of preSale.preSaleItems) {
            const saleItem: CreateSaleItemModel = {
                fullName: preSaleItem.fullName,
                onModel: preSaleItem.onModel,
                price: preSaleItem.price,
                quantity: preSaleItem.quantity,
                preIgvCode: preSaleItem.igvCode,
                igvCode: preSaleItem.igvCode,
                unitCode: preSaleItem.unitCode,
                isTrackStock: preSaleItem.isTrackStock,
                observations: preSaleItem.observations,
                prices: [],
                productId: preSaleItem.productId,
            }
            saleItems.push(saleItem)
        }
        this.salesService.setSaleItems(saleItems)
        // this.preSalesService.setPreSale(preSale)
        this.router.navigate(['/preSales/charge'])
    }

    onChargeCredit(preSale: PreSaleModel) {
        const saleItems: CreateSaleItemModel[] = []
        for (const preSaleItem of preSale.preSaleItems) {
            const saleItem: CreateSaleItemModel = {
                fullName: preSaleItem.fullName,
                onModel: preSaleItem.onModel,
                price: preSaleItem.price,
                quantity: preSaleItem.quantity,
                preIgvCode: preSaleItem.igvCode,
                igvCode: preSaleItem.igvCode,
                unitCode: preSaleItem.unitCode,
                isTrackStock: preSaleItem.isTrackStock,
                observations: preSaleItem.observations,
                prices: [],
                productId: preSaleItem.productId,
            }
            saleItems.push(saleItem)
        }
        this.salesService.setSaleItems(saleItems)
        // this.preSalesService.setPreSale(preSale)
        this.router.navigate(['/charge/credit'])
    }

    onDelete(preSaleId: string) {
        const ok = confirm('Esta seguro de anular?...')
        if (ok) {
            this.navigationService.loadBarStart()
            // this.preSalesService.delete(preSaleId).subscribe(() => {
            //     this.fetchData()
            //     this.navigationService.loadBarFinish()
            // })
        }
    }


}
