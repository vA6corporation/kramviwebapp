import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { SaleItemModel } from '../../sales/sale-item.model';
import { ReportsService } from '../reports.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

export interface Section {
    name: string;
    updated: Date;
}

@Component({
    selector: 'app-summary',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.sass']
})
export class SummaryComponent implements OnInit {

    constructor(
        private readonly reportsService: ReportsService,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
        officeId: '',
    })
    offices: OfficeModel[] = []
    saleItems: SaleItemModel[] = []
    summarySales: number = 0
    summaryPayments: number = 0
    summaryPurchaseSupplies: number = 0
    summaryExpenses: number = 0
    summaryTotal: number = 0

    private handleAuth$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleOffices$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.formGroup.patchValue({ officeId: auth.office._id })
            this.fetchData()
        })

        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.offices = offices
        })
    }

    fetchData() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.summaryTotal = 0
            this.reportsService.getSummariesByRangeDate(this.formGroup.value).subscribe({
                next: res => {
                    this.navigationService.loadBarFinish()
                    const { summaryPayments, summaryPurchaseSupplies, summaryExpenses } = res
                    this.summaryPayments = summaryPayments
                    this.summaryPurchaseSupplies = summaryPurchaseSupplies
                    this.summaryExpenses = summaryExpenses
                    this.summaryTotal = summaryPayments - summaryExpenses - summaryExpenses
                }, error: (error: HttpErrorResponse) => {
                    console.log(error)
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onRangeChange() {
        this.fetchData()
    }

    onOfficeChange() {
        this.fetchData()
    }

}
