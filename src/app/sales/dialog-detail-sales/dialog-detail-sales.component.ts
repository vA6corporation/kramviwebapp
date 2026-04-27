import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'
import { Subscription } from 'rxjs'
import { TicketModel } from '../ticket.model'
import { SalesService } from '../../sales/sales.service'
import { NavigationService } from '../../navigation/navigation.service'
import { AuthService } from '../../auth/auth.service'
import { SaleModel } from '../../sales/sale.model'
import { CustomerModel } from '../../customers/customer.model'
import { SaleItemModel } from '../../sales/sale-item.model'
import { CdrModel } from '../cdr.model'
import { OfficeModel } from '../../offices/office.model'
import { PaymentModel } from '../../payments/payment.model'
import { BusinessModel } from '../../businesses/business.model'
import { UserModel } from '../../users/user.model'
import { MaterialModule } from '../../material.module'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-dialog-detail-sales',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './dialog-detail-sales.component.html',
    styleUrls: ['./dialog-detail-sales.component.sass']
})
export class DialogDetailSalesComponent {

    private readonly saleId: any = inject(MAT_DIALOG_DATA)
    private readonly salesService = inject(SalesService)
    private readonly navigationService = inject(NavigationService)
    private readonly authService = inject(AuthService)
    private readonly sanitizer = inject(DomSanitizer)

    $sale = signal<SaleModel | null>(null)
    $customer = signal<CustomerModel | null>(null)
    $saleItems = signal<SaleItemModel[]>([])
    $payments = signal<PaymentModel[]>([])
    cdr: CdrModel | null = null
    ticket: TicketModel | null = null
    $office = signal<OfficeModel>(new OfficeModel())
    //business: BusinessModel = new BusinessModel()
    $user = signal<UserModel>(new UserModel())

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            //this.business = auth.business
            //this.user = auth.user
            this.$office.set(auth.office)
        })

        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            console.log(sale)
            const { saleItems, customer, payments, user, cdr, ticket } = sale
            this.$sale.set(sale)
            this.$customer.set(customer)
            this.$payments.set(payments)
            this.$saleItems.set(saleItems)
            //this.cdr = cdr
            //this.ticket = ticket
            this.$user.set(user)
        })
    }

    onClickCopy() {
        this.navigationService.showMessage('ID copiado al portapapeles')
    }

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url)
    }

}
