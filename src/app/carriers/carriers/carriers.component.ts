import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { NavigationService } from '../../navigation/navigation.service'
import { CarrierModel } from '../carrier.model'
import { CarriersService } from '../carriers.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-carriers',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './carriers.component.html',
    styleUrls: ['./carriers.component.sass'],
})
export class CarriersComponent {

    private readonly carriersService = inject(CarriersService)
    private readonly navigationService = inject(NavigationService)
    private readonly matDialog = inject(MatDialog)
    private readonly router = inject(Router)
    private readonly activatedRoute = inject(ActivatedRoute)

    displayedColumns: string[] = ['document', 'name', 'address', 'email', 'phone', 'actions']
    $dataSource = signal<CarrierModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Transportistas')

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'excel_kramvi': { }
            }
        })

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
        ])

        const { pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.fetchData()
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

        this.fetchData()
    }

    onLocationChange() {
        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()

        this.carriersService.getCarriersCount().subscribe(count => {
            this.$length.set(count)
        })

        this.carriersService.getCarriersByPage(this.pageIndex + 1, this.pageSize).subscribe(carriers => {
            this.navigationService.loadBarFinish()
            this.$dataSource.set(carriers)
        })
    }

    onDelete(customerId: any) {
        // const ok = confirm('Esta seguro de eliminar?...')
        // if (ok) {
        //   this.customersService.delete(customerId).subscribe(() => {
        //     this.navigationService.showMessage('Eliminado correctamente')
        //     this.fetchData()
        //   }, (error: HttpErrorResponse) => {
        //     this.navigationService.showMessage(error.error.message)
        //   })
        // }
    }

}
