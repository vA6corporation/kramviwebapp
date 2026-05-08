import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { CustomerModel } from '../../customers/customer.model'
import { UserModel } from '../../users/user.model'
import { ProformaItemModel } from '../proforma-item.model'
import { ProformaModel } from '../proforma.model'
import { ProformasService } from '../proformas.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-dialog-detail-proformas',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-detail-proformas.component.html',
    styleUrls: ['./dialog-detail-proformas.component.sass']
})
export class DialogDetailProformasComponent {

    private readonly proformaId: number = inject(MAT_DIALOG_DATA)
    private readonly proformasService = inject(ProformasService)
    private readonly authService = inject(AuthService)

    $proforma = signal<ProformaModel | null>(null)
    $proformaItems = signal<ProformaItemModel[]>([])
    $customer = signal<CustomerModel | null>(null)
    $office = signal<OfficeModel>(new OfficeModel())
    $user = signal<UserModel>(new UserModel())

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$office.set(auth.office)
        })

        this.proformasService.getProformaById(this.proformaId).subscribe(proforma => {
            const { proformaItems, user, customer } = proforma
            this.$proforma.set(proforma)
            this.$proformaItems.set(proformaItems)
            this.$customer.set(customer)
            this.$user.set(user)
        })
    }

}
