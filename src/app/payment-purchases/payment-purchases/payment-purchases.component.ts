import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogDetailPurchasesComponent } from '../../purchases/dialog-detail-purchases/dialog-detail-purchases.component';
import { PaymentPurchaseModel } from '../payment-purchase.model';
import { PaymentPurchasesService } from '../payment-purchases.service';
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-payment-purchases',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './payment-purchases.component.html',
    styleUrls: ['./payment-purchases.component.sass']
})
export class PaymentPurchasesComponent {

    constructor(
        private readonly paymentPurchasesService: PaymentPurchasesService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute
    ) { }

    displayedColumns: string[] = ['created', 'charge', 'paymentMethod', 'provider', 'user', 'actions']
    dataSource: PaymentPurchaseModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    formGroup: FormGroup = this.formBuilder.group({
        userId: '',
        provider: this.formBuilder.group({
            _id: '',
            name: ''
        }),
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    invoiceType: string = ''
    office: OfficeModel = new OfficeModel()
    private endDate: Date = new Date()
    private startDate: Date = new Date()
    private params: Params = {}

    invoiceTypes = [
        { code: '', label: 'TODOS LOS COMPROBANTES' },
        { code: 'NOTA DE VENTA', label: 'NOTA DE VENTA' },
        { code: 'BOLETA', label: 'BOLETA' },
        { code: 'FACTURA', label: 'FACTURA' },
        { code: 'BOLETAFACTURA', label: 'BOLETA Y FACTURA' },
    ]

    private handleClickMenu: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Compras')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Excel Simple', icon: 'file_download', show: false },
        ])

        const { startDate, endDate, pageIndex, pageSize, invoiceType } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.formGroup.get('invoiceType')?.patchValue(invoiceType || '')

        if (startDate && endDate) {
            this.startDate = new Date(startDate)
            this.endDate = new Date(endDate)
            this.formGroup.patchValue({ startDate: this.startDate, endDate: this.endDate })
        }

        this.fetchData()
        this.fetchCount()
    }

    onDialogSearchProviders() {
        const dialogRef = this.matDialog.open(DialogSearchProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(provider => {
            if (provider) {
                this.formGroup.patchValue({ provider })
                this.fetchData()
                this.fetchCount()
            }
        })
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0
            const { startDate, endDate } = this.formGroup.value
            const queryParams: Params = { startDate: startDate, endDate: endDate, pageIndex: 0 }

            Object.assign(this.params, queryParams)

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchData()
            this.fetchCount()
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        const { provider } = this.formGroup.value
        Object.assign(this.params, { providerId: provider._id })
        this.paymentPurchasesService.getPaymentPurchasesByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe({
            next: paymentPurchases => {
                this.navigationService.loadBarFinish()
                this.dataSource = paymentPurchases
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    fetchCount() {
        this.paymentPurchasesService.getCountPaymentPurchases(this.params).subscribe(count => {
            this.length = count
        })
    }

    onOpenDetails(purchaseId: string) {
        this.matDialog.open(DialogDetailPurchasesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseId,
        })
    }

}
