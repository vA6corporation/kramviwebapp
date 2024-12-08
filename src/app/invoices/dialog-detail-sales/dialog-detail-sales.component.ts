import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { TicketModel } from '../ticket.model';
import { SalesService } from '../../sales/sales.service';
import { NavigationService } from '../../navigation/navigation.service';
import { AuthService } from '../../auth/auth.service';
import { SaleModel } from '../../sales/sale.model';
import { CustomerModel } from '../../customers/customer.model';
import { SaleItemModel } from '../../sales/sale-item.model';
import { CdrModel } from '../cdr.model';
import { OfficeModel } from '../../auth/office.model';
import { PaymentModel } from '../../payments/payment.model';
import { BusinessModel } from '../../auth/business.model';
import { UserModel } from '../../users/user.model';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-detail-sales',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './dialog-detail-sales.component.html',
    styleUrls: ['./dialog-detail-sales.component.sass']
})
export class DialogDetailSalesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly saleId: string,
        private readonly salesService: SalesService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly sanitizer: DomSanitizer,
    ) { }

    sale: SaleModel | null = null
    customer: CustomerModel | null = null
    saleItems: SaleItemModel[] = []
    payments: PaymentModel[] = []
    cdr: CdrModel | null = null
    ticket: TicketModel | null = null
    office: OfficeModel = new OfficeModel()
    business: BusinessModel = new BusinessModel()
    user: UserModel = new UserModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.business = auth.business
            this.user = auth.user
            this.office = auth.office
        })

        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            console.log(sale)
            this.sale = sale
            const { saleItems, customer, payments, user, cdr, ticket } = sale
            this.customer = customer
            this.payments = payments
            this.saleItems = saleItems
            this.cdr = cdr
            this.ticket = ticket
            this.user = user
        })
    }

    onClickCopy() {
        this.navigationService.showMessage('ID copiado al portapapeles')
    }

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url)
    }
}
