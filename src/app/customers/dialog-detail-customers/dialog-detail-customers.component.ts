import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CustomersService } from '../customers.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerModel } from '../customer.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-detail-customers',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-detail-customers.component.html',
    styleUrl: './dialog-detail-customers.component.sass'
})
export class DialogDetailCustomersComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly customerId: string,
        private readonly customersService: CustomersService,
    ) { }

    customer: CustomerModel | null = null

    ngOnInit() {
        this.customersService.getCustomerById(this.customerId).subscribe(customer => {
            this.customer = customer
        })
    }

}
