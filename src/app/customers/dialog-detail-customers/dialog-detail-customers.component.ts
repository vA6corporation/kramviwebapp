import { Component, inject, signal } from '@angular/core'
import { MaterialModule } from '../../material.module'
import { CustomersService } from '../customers.service'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { CustomerModel } from '../customer.model'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-dialog-detail-customers',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-detail-customers.component.html',
    styleUrl: './dialog-detail-customers.component.sass'
})
export class DialogDetailCustomersComponent {

    private readonly customerId: any = inject(MAT_DIALOG_DATA)
    private readonly customersService = inject(CustomersService)

    $customer = signal<CustomerModel | null>(null)

    ngOnInit() {
        this.customersService.getCustomerById(this.customerId).subscribe(customer => {
            this.$customer.set(customer)
        })
    }

}
