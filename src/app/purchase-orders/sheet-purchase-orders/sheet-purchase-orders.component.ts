import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { PurchaseOrdersService } from '../purchase-orders.service';
import { PrintService } from '../../print/print.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-sheet-purchase-orders',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './sheet-purchase-orders.component.html',
  styleUrl: './sheet-purchase-orders.component.sass'
})
export class SheetPurchaseOrdersComponent {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        private readonly purchaseOrderId: string,
        private readonly printService: PrintService,
        private readonly navigationService: NavigationService,
        private readonly purchaseOrdersService: PurchaseOrdersService,
        private readonly bottomSheetRef: MatBottomSheetRef<SheetPurchaseOrdersComponent>,
    ) { }

    onPrint(printerType: string) {
        this.bottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        this.purchaseOrdersService.getPurchaseOrderById(this.purchaseOrderId).subscribe(purchaseOrder => {
            this.navigationService.loadBarFinish()
            if (printerType === 'a4') {
                this.printService.printA4PurchaseOrder(purchaseOrder)
            } else {
                this.printService.printTicket80mmPurchaseOrder(purchaseOrder)
            }
        })
    }

    onExportPdf(printerType: string) {
        this.bottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        this.purchaseOrdersService.getPurchaseOrderById(this.purchaseOrderId).subscribe(purchaseOrder => {
            this.navigationService.loadBarFinish()
            if (printerType === 'a4') {
                this.printService.exportPdfA4PurchaseOrder(purchaseOrder)
            } else {
                this.printService.exportPdfTicket80mmPurchaseOrder(purchaseOrder)
            }
        })
    }

}
