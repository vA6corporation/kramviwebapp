import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { PurchaseModel } from '../../purchases/purchase.model';
import { DialogDetailPurchaseSuppliesComponent } from '../dialog-detail-purchase-supplies/dialog-detail-purchase-supplies.component';
import { PurchaseSuppliesService } from '../purchase-supplies.service';

@Component({
    selector: 'app-purchase-supplies',
    templateUrl: './purchase-supplies.component.html',
    styleUrls: ['./purchase-supplies.component.sass']
})
export class PurchaseSuppliesComponent implements OnInit {

    constructor(
        private readonly purchaseSuppliesService: PurchaseSuppliesService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    });

    displayedColumns: string[] = ['created', 'serial', 'customer', 'charge', 'actions'];
    dataSource: PurchaseModel[] = [];
    length: number = 0;
    pageIndex: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 30, 50];
    office: OfficeModel = new OfficeModel();

    private handleCategorySupplies$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleCategorySupplies$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Compra de insumos');

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office;
        });

        const { startDate, endDate, pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams;

        this.pageIndex = Number(pageIndex || 0);
        this.pageSize = Number(pageSize || 10);

        if (startDate && endDate) {
            this.formGroup.get('startDate')?.patchValue(new Date(Number(startDate)));
            this.formGroup.get('endDate')?.patchValue(new Date(Number(endDate)));
        }

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            // { id: 'excel_detail', label: 'Excel detallado', icon: 'file_download', show: false },
            { id: 'excel_simple', label: 'Excel Simple', icon: 'file_download', show: false },
        ]);

        this.fetchData()
        this.fetchCount()

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'excel_detail':
                    this.navigationService.loadBarStart();
                    const { startDate, endDate } = this.formGroup.value;
                    this.purchaseSuppliesService.getPurchaseSupplyItemsByRangeDate(startDate, endDate).subscribe(purchaseSupplies => {
                        this.navigationService.loadBarFinish();
                        const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
                        let body = [];
                        body.push([
                            'F. REGISTRO',
                            'SERIE',
                            'INSUMO',
                            'CATEGORIA',
                            'CANTIDAD',
                            'COSTO',
                            'TOTAL',
                            'PROVEEDOR',
                            'USUARIO',
                            'OBSERVACIONES'
                        ]);
                        // for (const purchaseSupply of purchaseSupplies) {
                        //   for (const purchaseSupplyItem of purchaseSupply.purchaseSupplyItems) {
                        //     body.push([
                        //       formatDate(purchaseSupply.createdAt, 'dd/MM/yyyy', 'en-US'),
                        //       purchaseSupply.serie,
                        //       purchaseSupplyItem.fullName.toUpperCase(),
                        //       this.categorySupplies.find(e => e._id === purchaseSupplyItem.categoryId)?.name.toUpperCase(),
                        //       purchaseSupplyItem.quantity,
                        //       purchaseSupplyItem.cost,
                        //       Number((purchaseSupplyItem.cost * purchaseSupplyItem.quantity).toFixed(2)),
                        //       (purchaseSupply.provider?.name || '')?.toUpperCase(),
                        //       purchaseSupply.user.name.toUpperCase(),
                        //       (purchaseSupply.observations || '').toUpperCase()
                        //     ]);
                        //   }
                        // }
                        const name = `COMPRAS_DETALLADO_${this.office.name.replace(/ /g, '_')}`;
                        buildExcel(body, name, wscols, []);
                    }, (error: HttpErrorResponse) => {
                        console.log(error);
                        this.navigationService.loadBarFinish();
                    });
                    break;

                case 'excel_simple': {
                    this.navigationService.loadBarStart();
                    const { startDate, endDate } = this.formGroup.value;
                    this.purchaseSuppliesService.getPurchaseSuppliesByRangeDate(startDate, endDate).subscribe(purchaseSupplies => {
                        this.navigationService.loadBarFinish();
                        const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
                        let body = [];
                        body.push([
                            'F. REGISTRO',
                            'F. COMPRA',
                            'SERIE',
                            'TOTAL',
                            'PROVEEDOR',
                            'USUARIO',
                            'OBSERVACIONES'
                        ]);
                        for (const purchaseSupply of purchaseSupplies) {
                            body.push([
                                formatDate(purchaseSupply.createdAt, 'dd/MM/yyyy', 'en-US'),
                                formatDate(purchaseSupply.purchasedAt, 'dd/MM/yyyy', 'en-US'),
                                purchaseSupply.serie,
                                purchaseSupply.charge,
                                (purchaseSupply.provider?.name || '')?.toUpperCase(),
                                purchaseSupply.user.name.toUpperCase(),
                                (purchaseSupply.observations || '').toUpperCase()
                            ]);
                        }
                        const name = `COMPRAS_DETALLADO_${this.office.name.replace(/ /g, '_')}`;
                        buildExcel(body, name, wscols, []);
                    }, (error: HttpErrorResponse) => {
                        console.log(error);
                        this.navigationService.loadBarFinish();
                    });
                }
                    break;
            }
        });
    }

    fetchData() {
        this.navigationService.loadBarStart();
        const { startDate, endDate } = this.formGroup.value;
        this.purchaseSuppliesService.getPurchaseSuppliesByRangeDatePage(startDate, endDate, this.pageIndex + 1, this.pageSize).subscribe(purchaseSupplies => {
            this.navigationService.loadBarFinish();
            console.log(purchaseSupplies);
            this.dataSource = purchaseSupplies;
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish();
            this.navigationService.showMessage(error.error.message);
        })
    }

    fetchCount() {
        const { startDate, endDate } = this.formGroup.value;
        this.purchaseSuppliesService.getCountPurchaseSuppliesByRangeDate(startDate, endDate).subscribe(count => {
            this.length = count;
        })
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
            this.fetchCount()
        }
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

    onOpenDetails(purchaseId: string) {
        this.matDialog.open(DialogDetailPurchaseSuppliesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseId,
        });
    }

    onDeletePurchase(purchaseId: string) {
        const ok = confirm('Esta seguro de eliminar?...');
        if (ok) {
            this.navigationService.loadBarStart();
            this.purchaseSuppliesService.deletePurchaseSupply(purchaseId).subscribe(() => {
                this.navigationService.loadBarFinish();
                this.navigationService.showMessage('Eliminado correctamente');
                this.fetchData();
            });
        }
    }

}
