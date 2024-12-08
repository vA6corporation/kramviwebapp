import { Component } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { PurchasesComponent } from '../purchases/purchases.component';
import { PaymentPurchasesComponent } from '../../payment-purchases/payment-purchases/payment-purchases.component';
import { CreditPurchasesComponent } from '../credit-purchases/credit-purchases.component';

@Component({
    selector: 'app-index-purchases',
    imports: [MaterialModule, PurchasesComponent, CreditPurchasesComponent, PaymentPurchasesComponent],
    templateUrl: './index-purchases.component.html',
    styleUrls: ['./index-purchases.component.sass']
})
export class IndexPurchasesComponent {

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    selectedIndex: number = 0

    ngOnInit(): void {
        const { tabIndex } = this.activatedRoute.snapshot.queryParams
        this.selectedIndex = tabIndex
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
