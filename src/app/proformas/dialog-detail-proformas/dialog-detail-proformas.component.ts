import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { CustomerModel } from '../../customers/customer.model';
import { UserModel } from '../../users/user.model';
import { ProformaItemModel } from '../proforma-item.model';
import { ProformaModel } from '../proforma.model';
import { ProformasService } from '../proformas.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-detail-proformas',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-detail-proformas.component.html',
    styleUrls: ['./dialog-detail-proformas.component.sass']
})
export class DialogDetailProformasComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly proformaId: string,
        private readonly proformasService: ProformasService,
        private readonly authService: AuthService,
    ) { }

    proforma: ProformaModel | null = null
    proformaItems: ProformaItemModel[] = []
    customer: CustomerModel | null = null
    office: OfficeModel = new OfficeModel()
    user: UserModel = new UserModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.proformasService.getProformaById(this.proformaId).subscribe(proforma => {
            this.proforma = proforma
            const { proformaItems, user, customer } = proforma
            this.proformaItems = proformaItems
            this.customer = customer
            this.user = user
        })
    }

}
