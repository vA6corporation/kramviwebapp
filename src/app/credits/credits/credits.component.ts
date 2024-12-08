import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { NavigationService } from '../../navigation/navigation.service';
import { CreditModel } from '../credit.model';
import { CreditsService } from '../credits.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-credits',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './credits.component.html',
    styleUrls: ['./credits.component.sass']
})
export class CreditsComponent {

    constructor(
        private readonly creditsService: CreditsService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
        private readonly formBuilder: FormBuilder,
    ) { }

    displayedColumns: string[] = ['createdAt', 'dueDate', 'serial', 'customer', 'mobileNumber', 'worker', 'charge', 'remaining', 'actions']
    dataSource: CreditModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    formGroup: FormGroup = this.formBuilder.group({
        isPayed: '',
    })
    office: OfficeModel = new OfficeModel()

    creditTypes = [
        { code: '', label: 'TODOS LOS CREDITOS' },
        { code: 'NOTPAYED', label: 'CREDITOS PENDIENTES' },
        { code: 'PAYED', label: 'CREDITOS PAGADOS' },
    ]
    private params: Params = {}

    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Creditos')

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'export_excel', label: 'Exportar excel', icon: 'file_download', show: false },
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        const { pageIndex, pageSize, isPayed } = this.activatedRoute.snapshot.queryParams
        Object.assign(this.params, { pageIndex, pageSize, isPayed })
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)

        if (isPayed) {
            this.formGroup.patchValue({ isPayed })
        }

        this.fetchData()
        this.fetchCount()

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.creditsService.getCreditsByKey(key, this.params).subscribe({
                next: credits => {
                    this.navigationService.loadBarFinish()
                    this.dataSource = credits
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'export_excel': {
                    this.exportExcel()
                    break
                }
            }
        })
    }

    exportExcel() {
        this.navigationService.loadBarStart()
        this.creditsService.getNotPaidCredits().subscribe({
            next: credits => {
                this.navigationService.loadBarFinish()
                const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                let body = []
                body.push([
                    'F. EMISION',
                    'F. VENCIMIENTO',
                    'SERIE',
                    'I. TOTAL',
                    'M. PENDIENTE',
                    'T. DOCUMENTO',
                    'DOCUMENTO',
                    'CLIENTE',
                    'DIRECCION',
                    'CELULAR',
                    'EMAIL',
                ])
                for (const credit of credits) {
                    const { customer } = credit
                    body.push([
                        formatDate(credit.createdAt, 'dd/MM/yyyy', 'en-US'),
                        credit.dues[0] ? formatDate(credit.dues[0].dueDate, 'dd/MM/yyyy', 'en-US') : '',
                        `${credit.invoicePrefix}${this.office.serialPrefix}-${credit.invoiceNumber}`,
                        Number(credit.charge.toFixed(2)),
                        Number((credit.charge - credit.payed).toFixed(2)),
                        customer?.documentType,
                        customer?.document,
                        (customer?.name || '').toUpperCase(),
                        (customer?.addresses[0] || '').toUpperCase(),
                        customer?.mobileNumber,
                        customer?.email,
                    ])
                }
                const name = `CREDITOS_PENDIENTES_${this.office.name}`
                buildExcel(body, name, wscols, [], [])
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize

        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize }
        Object.assign(this.params, queryParams)

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
    }

    onCreditChange(isPayed: string) {
        this.pageIndex = 0

        const queryParams: Params = { isPayed, pageIndex: this.pageIndex }
        Object.assign(this.params, queryParams)

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchCount()
        this.fetchData()
    }

    fetchCount() {
        this.creditsService.getCountCredits(this.params).subscribe(count => {
            this.length = count
        })
    }

    onOpenDetails(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.creditsService.getCreditsByPage(
            this.pageIndex + 1,
            this.pageSize,
            this.params
        ).subscribe({
            next: credits => {
                this.dataSource = credits
                this.navigationService.loadBarFinish()
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }
}
