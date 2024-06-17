import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { NavigationService } from '../../navigation/navigation.service';
import { SaleModel } from '../../sales/sale.model';
import { SalesService } from '../../sales/sales.service';

@Component({
    selector: 'app-deliveries',
    templateUrl: './deliveries.component.html',
    styleUrls: ['./deliveries.component.sass']
})
export class DeliveriesComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly formBuilder: FormBuilder,
        private readonly salesService: SalesService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
    ) { }

    displayedColumns: string[] = ['deliveryAt', 'createdAt', 'serial', 'customer', 'charge', 'actions'];
    dataSource: SaleModel[] = [];
    length: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 30, 50];
    pageIndex: number = 0;
    formGroup: FormGroup = this.formBuilder.group({
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    });

    office: OfficeModel = new OfficeModel();

    private handleAuth$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleAuth$.unsubscribe();
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Entregas');

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office;
        });
    
        const { startDate, endDate } = this.activatedRoute.snapshot.queryParams;
        if (startDate && endDate) {
            this.formGroup.get('startDate')?.patchValue(new Date(Number(startDate)));
            this.formGroup.get('endDate')?.patchValue(new Date(Number(endDate)));
        }
        this.fetchData();
    }

    fetchData() {
        const { startDate, endDate } = this.formGroup.value;
        this.navigationService.loadBarStart();
        this.salesService.getSalesByRangeDateDeliveryAt(startDate, endDate).subscribe(sales => {
            this.navigationService.loadBarFinish();
            this.dataSource = sales;
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish();
            this.navigationService.showMessage(error.error.message);
        });
    }

    onOpenDetails(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        });
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0;
            const { startDate, endDate } = this.formGroup.value;

            const queryParams: Params = { startDate: startDate.getTime(), endDate: endDate.getTime(), pageIndex: 0 };

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });

            this.fetchData()
        }
    }

}
