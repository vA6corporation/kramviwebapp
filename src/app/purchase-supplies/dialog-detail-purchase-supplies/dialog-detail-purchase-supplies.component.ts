import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProviderModel } from '../../providers/provider.model';
import { UserModel } from '../../users/user.model';
import { PurchaseSuppliesService } from '../purchase-supplies.service';
import { PurchaseSupplyItemModel } from '../purchase-supply-item.model';
import { PurchaseSupplyModel } from '../purchase-supply.model';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-detail-purchase-supplies',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './dialog-detail-purchase-supplies.component.html',
    styleUrls: ['./dialog-detail-purchase-supplies.component.sass'],
})
export class DialogDetailPurchaseSuppliesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly purchaseId: string,
        private readonly purchaseSuppliesService: PurchaseSuppliesService,
    ) { }

    user: UserModel | null = null
    provider: ProviderModel | null = null
    purchaseSupply: PurchaseSupplyModel | null = null
    purchaseSupplyItems: PurchaseSupplyItemModel[] = []

    ngOnInit(): void {
        this.purchaseSuppliesService.getPurchaseSupplyById(this.purchaseId).subscribe(purchaseSupply => {
            this.purchaseSupply = purchaseSupply
            this.purchaseSupplyItems = purchaseSupply.purchaseSupplyItems
            this.provider = purchaseSupply.provider
            this.user = purchaseSupply.user
        })
    }

}
