import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { InvoicesComponent } from '../invoices/invoices.component';
import { CreditNotesComponent } from '../../credit-notes/credit-notes/credit-notes.component';

@Component({
    selector: 'app-invoices-index',
    standalone: true,
    imports: [MaterialModule, InvoicesComponent, CreditNotesComponent],
    templateUrl: './invoices-index.component.html',
    styleUrls: ['./invoices-index.component.sass']
})
export class InvoicesIndexComponent {

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
