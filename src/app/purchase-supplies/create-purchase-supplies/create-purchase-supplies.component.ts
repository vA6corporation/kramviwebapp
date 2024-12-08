import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { NavigationService } from '../../navigation/navigation.service';
import { CategorySuppliesService } from '../../supplies/category-supplies.service';
import { CategorySupplyModel } from '../../supplies/category-supply.model';
import { SuppliesService } from '../../supplies/supplies.service';
import { SupplyModel } from '../../supplies/supply.model';
import { PurchaseSuppliesService } from '../purchase-supplies.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { PurchaseSupplyItemsComponent } from '../purchase-supply-items/purchase-supply-items.component';

@Component({
    selector: 'app-create-purchase-supplies',
    imports: [MaterialModule, PurchaseSupplyItemsComponent],
    templateUrl: './create-purchase-supplies.component.html',
    styleUrls: ['./create-purchase-supplies.component.sass'],
})
export class CreatePurchaseSuppliesComponent {

    constructor(
        private readonly categorySuppliesService: CategorySuppliesService,
        private readonly navigationService: NavigationService,
        private readonly suppliesService: SuppliesService,
        private readonly purchaseSuppliesService: PurchaseSuppliesService,
        private readonly authService: AuthService,
    ) { }

    filterSupplies: SupplyModel[] = []
    categorySupplies: CategorySupplyModel[] = []
    supplies: SupplyModel[] = []
    selectedIndex: number = 0
    gridListCols = 4
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()

    private handleCategorySupplies$: Subscription = new Subscription()
    private handleSupplies$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleCategorySupplies$.unsubscribe()
        this.handleSupplies$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva compra')
        this.navigationService.showSearch()

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting
        })

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' }
        ])

        this.handleCategorySupplies$ = this.categorySuppliesService.handleCategorySupplies().subscribe(categorySupplies => {
            this.categorySupplies = categorySupplies
        })

        this.handleSupplies$ = this.suppliesService.handleSupplies().subscribe(supplies => {
            this.supplies = supplies
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.suppliesService.getSuppliesByKey(key).subscribe({
                next: supplies => {
                    this.selectedIndex = 1
                    this.filterSupplies = supplies
                    this.navigationService.loadBarFinish()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.purchaseSuppliesService.setPurchaseSupplyItems([])
        }
    }

    onSelectCategorySupply(categorySupply: CategorySupplyModel): void {
        this.filterSupplies = this.supplies.filter(e => e.categorySupplyId === categorySupply._id)
        this.selectedIndex = 1
    }

    onClickSupply(supply: SupplyModel): void {
        this.purchaseSuppliesService.addPurchaseItem(supply)
    }

}
