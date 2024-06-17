import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { CreditModel } from '../credit.model';
import { CreditsService } from '../credits.service';

@Component({
    selector: 'app-payed-credits',
    templateUrl: './payed-credits.component.html',
    styleUrls: ['./payed-credits.component.sass']
})
export class PayedCreditsComponent implements OnInit {

    constructor(
        private readonly creditsService: CreditsService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly formBuilder: FormBuilder,
        private readonly usersService: UsersService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        invoiceType: '',
        userId: '',
    });
    displayedColumns: string[] = ['createdAt', 'expirationAt', 'serial', 'customer', 'charge', 'remaining', 'actions'];
    dataSource: CreditModel[] = [];
    length: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 30, 50];
    pageIndex: number = 0;
    users: UserModel[] = [];
    office: OfficeModel = new OfficeModel();
    private params: Params = {};

    invoiceTypes = [
        { code: '', name: 'TODOS LOS COMPROBANTES' },
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ];

    private handleClickMenu$: Subscription = new Subscription();
    private handleAuth$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleAuth$.unsubscribe();
        this.handleClickMenu$.unsubscribe();
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Creditos');
        const { pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams
        Object.assign(this.params, { pageIndex, pageSize })
        this.pageIndex = Number(pageIndex || 0);
        this.pageSize = Number(pageSize || 10);

        this.fetchData();

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'export_excel', label: 'Exportar', icon: 'file_download', show: false },
        ]);

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office;
        });

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'export_excel': {
                    this.exportExcel();
                    break;
                }
            }
        });
    }

    exportExcel() {
        this.navigationService.loadBarStart();
        this.creditsService.getPaidCredits().subscribe(credits => {
            console.log(credits);
            this.navigationService.loadBarFinish();
            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
            let body = [];
            body.push([
                'F. EMISION',
                'F. VENCIMIENTO',
                'SERIE',
                'CLIENTE',
                'I. TOTAL',
                'M. PENDIENTE',
            ]);
            for (const credit of credits) {
                const { customer } = credit;
                body.push([
                    formatDate(credit.createdAt, 'dd/MM/yyyy', 'en-US'),
                    // formatDate(credit.expirationAt, 'dd/MM/yyyy', 'en-US'),
                    `${credit.invoicePrefix}${this.office.serialPrefix}-${credit.invoiceNumber}`,
                    customer?.name.toUpperCase(),
                    Number(credit.charge.toFixed(2)),
                    Number((credit.charge - credit.payed).toFixed(2))
                ]);
            }
            const name = `CREDITOS_${this.office.name}`;
            buildExcel(body, name, wscols, [], []);
        });
    }

    handlePageEvent(event: PageEvent): void {
        this.navigationService.loadBarStart();
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize };

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        });

        this.fetchData();
    }

    onInvoiceChange(invoiceType: string) {
        const queryParams: Params = { invoiceType };

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        });

        this.fetchData()
    }

    onUserChange(userId: string) {
        const queryParams: Params = { userId };

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        });

        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart();
        this.creditsService.getPaidCreditsByPage(
            this.pageIndex + 1,
            this.pageSize,
            this.params
        ).subscribe(res => {
            const { credits, count } = res;
            this.dataSource = credits;
            this.length = count;
            this.navigationService.loadBarFinish();
        });
    }

}
