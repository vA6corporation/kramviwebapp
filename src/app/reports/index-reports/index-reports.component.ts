import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { Subscription } from 'rxjs';
import { BoardsComponent } from '../boards/boards.component';
import { CategoriesComponent } from '../categories/categories.component';
import { CustomersComponent } from '../customers/customers.component';
import { CollectionsComponent } from '../collections/collections.component';
import { IncomesComponent } from '../incomes/incomes.component';
import { InoutComponent } from '../inout/inout.component';
import { InvoicesComponent } from '../invoices/invoices.component';
import { ProductsComponent } from '../products/products.component';
import { ProformasComponent } from '../proformas/proformas.component';
import { PurchasesComponent } from '../purchases/purchases.component';
import { SummaryComponent } from '../summary/summary.component';
import { SuppliesComponent } from '../supplies/supplies.component';
import { SuppliesInComponent } from '../supplies-in/supplies-in.component';
import { SuppliesOutComponent } from '../supplies-out/supplies-out.component';
import { UtilitiesComponent } from '../utilities/utilities.component';
import { WorkersComponent } from '../workers/workers.component';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-index-reports',
    imports: [
        MaterialModule,
        IncomesComponent,
        InoutComponent,
        UtilitiesComponent,
        ProductsComponent,
        CategoriesComponent,
        CustomersComponent,
        InvoicesComponent,
        BoardsComponent,
        ProformasComponent,
        // CollectionsComponent,
        // PurchasesComponent,
        // SummaryComponent,
        // SuppliesComponent,
        SuppliesInComponent,
        SuppliesOutComponent,
        WorkersComponent
    ],
    templateUrl: './index-reports.component.html',
    styleUrls: ['./index-reports.component.sass']
})
export class IndexReportsComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly router: Router,
    ) { }

    selectedIndex: number = 0
    business: BusinessModel = new BusinessModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Reportes')
        const { tabIndex } = this.activatedRoute.snapshot.queryParams
        this.selectedIndex = tabIndex
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.business = auth.business
        })
    }

    onChangeSelected(tabIndex: number) {
        const queryParams: Params = { tabIndex }
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })
    }


}
