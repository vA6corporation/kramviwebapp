import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
    selector: 'app-index-purchases',
    templateUrl: './index-purchases.component.html',
    styleUrls: ['./index-purchases.component.sass']
})
export class IndexPurchasesComponent implements OnInit {

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
