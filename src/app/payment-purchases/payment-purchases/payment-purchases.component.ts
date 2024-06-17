import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogFindProvidersComponent } from '../../providers/dialog-find-providers/dialog-find-providers.component';
import { DialogDetailPurchasesComponent } from '../../purchases/dialog-detail-purchases/dialog-detail-purchases.component';
import { PaymentPurchaseModel } from '../payment-purchase.model';
import { PaymentPurchasesService } from '../payment-purchases.service';

@Component({
    selector: 'app-payment-purchases',
    templateUrl: './payment-purchases.component.html',
    styleUrls: ['./payment-purchases.component.sass']
})
export class PaymentPurchasesComponent implements OnInit {

    constructor(
        private readonly paymentPurchasesService: PaymentPurchasesService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        userId: '',
        provider: this.formBuilder.group({
            _id: '',
            name: ''
        }),
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
    });

    displayedColumns: string[] = ['created', 'charge', 'paymentMethod', 'provider', 'user', 'actions'];
    dataSource: PaymentPurchaseModel[] = [];
    length: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 30, 50];
    pageIndex: number = 0;
    invoiceType: string = '';
    office: OfficeModel = new OfficeModel();
    private endDate: Date = new Date();
    private startDate: Date = new Date();
    private params: Params = {};

    invoiceTypes = [
        { code: '', label: 'TODOS LOS COMPROBANTES' },
        { code: 'NOTA DE VENTA', label: 'NOTA DE VENTA' },
        { code: 'BOLETA', label: 'BOLETA' },
        { code: 'FACTURA', label: 'FACTURA' },
        { code: 'BOLETAFACTURA', label: 'BOLETA Y FACTURA' },
    ];

    private handleClickMenu: Subscription = new Subscription();
    private handleAuth$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleClickMenu.unsubscribe();
        this.handleAuth$.unsubscribe();
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Compras');

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office;
        });

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Excel Simple', icon: 'file_download', show: false },
        ])
        
        const { startDate, endDate, pageIndex, pageSize, invoiceType } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0);
        this.pageSize = Number(pageSize || 10);
        this.formGroup.get('invoiceType')?.patchValue(invoiceType || '');

        if (startDate && endDate) {
            this.startDate = new Date(startDate);
            this.endDate = new Date(endDate);
            this.formGroup.patchValue({ startDate: this.startDate, endDate: this.endDate });
        }

        this.fetchData();
        this.fetchCount();
    }

    onDialogProviders() {
        const dialogRef = this.matDialog.open(DialogFindProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
        });

        dialogRef.afterClosed().subscribe(provider => {
            if (provider) {
                this.formGroup.patchValue({ provider });
                this.fetchData();
                this.fetchCount();
            }
        });
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0;
            const { startDate, endDate } = this.formGroup.value;
            const queryParams: Params = { startDate: startDate, endDate: endDate, pageIndex: 0 };

            Object.assign(this.params, queryParams);

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            });

            this.fetchData();
            this.fetchCount();
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.fetchData();
    }

    fetchData() {
        this.navigationService.loadBarStart();
        const { provider } = this.formGroup.value;
        Object.assign(this.params, { providerId: provider._id });
        this.paymentPurchasesService.getPaymentPurchasesByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(paymentPurchases => {
            this.navigationService.loadBarFinish();
            console.log(paymentPurchases);
            this.dataSource = paymentPurchases;
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish();
            this.navigationService.showMessage(error.error.message);
        });
    }

    fetchCount() {
        this.paymentPurchasesService.getCountPaymentPurchases(this.params).subscribe(count => {
            this.length = count;
        });
    }

    onOpenDetails(purchaseId: string) {
        this.matDialog.open(DialogDetailPurchasesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseId,
        });
    }

    onDeletePurchase(purchaseId: string) {
        // const ok = confirm('Esta seguro de eliminar?...');
        // if (ok) {
        //   this.navigationService.loadBarStart();
        //   this.paymentPurchasesService.delete(purchaseId).subscribe(() => {
        //     this.navigationService.loadBarFinish();
        //     this.navigationService.showMessage('Eliminado correctamente');
        //     this.fetchData();
        //   });
        // }
    }

}
