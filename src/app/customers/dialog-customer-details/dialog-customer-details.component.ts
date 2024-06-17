import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerModel } from '../customer.model';
import { CustomersService } from '../customers.service';

@Component({
    selector: 'app-dialog-customer-details',
    templateUrl: './dialog-customer-details.component.html',
    styleUrls: ['./dialog-customer-details.component.sass']
})
export class DialogCustomerDetailsComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly customerId: string,
        private readonly customersService: CustomersService,
    ) { }

    customer: CustomerModel | null = null;

    ngOnInit(): void {
        this.customersService.getCustomerById(this.customerId).subscribe(customer => {
            this.customer = customer
        })
    }

}
