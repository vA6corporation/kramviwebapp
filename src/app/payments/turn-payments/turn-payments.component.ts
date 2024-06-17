import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentModel } from '../payment.model';
import { PaymentsService } from '../payments.service';

@Component({
    selector: 'app-turn-payments',
    templateUrl: './turn-payments.component.html',
    styleUrls: ['./turn-payments.component.sass']
})
export class TurnPaymentsComponent implements OnInit {

    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    displayedColumns: string[] = ['createdAt', 'paymentType', 'charge', 'serial', 'actions'];
    dataSource: PaymentModel[] = [];
    length: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 30, 50];
    pageIndex: number = 0;
    office: OfficeModel = new OfficeModel();
    private turnId: string = '';

    private handleAuth$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleAuth$.unsubscribe();
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Pagos');
        this.turnId = this.activatedRoute.snapshot.params['turnId'];

        this.paymentsService.getCountPaymentsByTurn(this.turnId).subscribe(count => {
            this.length = count;
        });
        
        const { pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams

        this.pageIndex = Number(pageIndex || 0);
        this.pageSize = Number(pageSize || 10);
        this.fetchData();

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office;
        });
    }

    fetchData(): void {
        this.navigationService.loadBarStart();
        this.paymentsService.getPaymentsByPageTurn(this.pageIndex + 1, this.pageSize, this.turnId).subscribe(payments => {
            this.navigationService.loadBarFinish();
            this.dataSource = payments;
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish();
            this.navigationService.showMessage(error.error.message);
        });
    }

    onShowDetails(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        });
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize };

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        });

        this.fetchData()
    }

}
