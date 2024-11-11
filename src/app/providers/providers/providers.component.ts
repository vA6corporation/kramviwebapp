import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { ProviderModel } from '../provider.model';
import { ProvidersService } from '../providers.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-providers',
    standalone: true,
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './providers.component.html',
    styleUrls: ['./providers.component.sass']
})
export class ProvidersComponent {

    constructor(
        private readonly providersService: ProvidersService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    displayedColumns: string[] = ['document', 'name', 'address', 'email', 'mobileNumber', 'actions']
    dataSource: ProviderModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Proveedores')

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'export_excel': {
                    // this.navigationService.loadBarStart()
                    // this.customersService.getCustomers().subscribe(customers => {
                    //   this.navigationService.loadBarFinish()
                    //   const wscols = [ 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20 ]
                    //   let body = []
                    //   body.push([
                    //     'T. DOCUMENTO',
                    //     'DOCUMENTO',
                    //     'NOMBRES',
                    //     'DIRECCION',
                    //     'EMAIL',
                    //     'CELULAR',
                    //   ])
                    //   for (const customer of customers) {
                    //     body.push([
                    //       customer.identificationType,
                    //       customer.identificationNumber,
                    //       customer.name,
                    //       customer.address,
                    //       customer.email,
                    //       customer.mobileNumber,
                    //     ])
                    //   }
                    //   const name = `Clientes_${formatDate(new Date(), 'dd/MM/yyyy', 'en-US')}_${this.business.businessName.replace(/ /g, '_')}`
                    //   buildExcel(body, name, wscols, [])
                    // }, (error: HttpErrorResponse) => {
                    //   this.navigationService.showMessage(error.error.message)
                    // })
                }
            }
        })

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'export_excel', label: 'Exportar Excel', icon: 'file_download', show: false },
        ])

        const { pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.fetchData()
        this.fetchCount()

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.providersService.getProvidersByKey(key).subscribe(providers => {
                this.dataSource = providers
            })
        })
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize

        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })
    }

    fetchCount() {
        this.providersService.getCountProviders().subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.providersService.getProvidersByPage(this.pageIndex + 1, this.pageSize).subscribe(providers => {
            this.navigationService.loadBarFinish()
            this.dataSource = providers
        })
    }

    onDelete(providerId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.providersService.delete(providerId).subscribe(() => {
                this.navigationService.showMessage('Eliminado correctamente')
                this.fetchData()
            })
        }
    }

}
