import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-create-purchase-supplies',
  templateUrl: './create-purchase-supplies.component.html',
  styleUrls: ['./create-purchase-supplies.component.sass']
})
export class CreatePurchaseSuppliesComponent implements OnInit {

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

    this.handleAuth$  = this.authService.handleAuth().subscribe(auth => {
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
