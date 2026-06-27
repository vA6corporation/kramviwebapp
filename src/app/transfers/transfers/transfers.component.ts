import { Component, inject, signal } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { Subscription } from 'rxjs'
import { buildExcel } from '../../buildExcel'
import { NavigationService } from '../../navigation/navigation.service'
import { TransferModel } from '../transfer.model'
import { TransfersService } from '../transfers.service'
import { HttpErrorResponse } from '@angular/common/http'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
    selector: 'app-transfers',
    imports: [MaterialModule, CommonModule, RouterModule],
    templateUrl: './transfers.component.html',
    styleUrl: './transfers.component.sass',
})
export class TransfersComponent {

    private readonly transfersService = inject(TransfersService)
    private readonly navigationService = inject(NavigationService)

    displayedColumns: string[] = ['createdAt', 'user', 'office', 'destinyOffice', 'observation', 'actions']
    $dataSource = signal<TransferModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    private handleAuth$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()

    ngOnDestroy(): void {
        this.handleAuth$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleSearch$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Traspasos')
        this.navigationService.setMenu([
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
            { id: 'search', icon: 'search', show: true, label: '' },
        ])

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
           // this.navigationService.loadBarStart()
           // this.transfersService.getTransfersByKey(key).subscribe(transfers => {
           //     this.navigationService.loadBarFinish()
           //     this.$dataSource.set(transfers)
           // }, (error: HttpErrorResponse) => {
           //     this.navigationService.loadBarFinish()
           //     this.navigationService.showMessage(error.error.message)
           // })
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'excel_simple':
                   // this.navigationService.loadBarFinish()
                   // const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                   // let body = []
                   // body.push([
                   //     'NOMBRE',
                   //     'EMAIL',
                   //     'SUCURSAL'
                   // ])
                   // for (const transfer of this.$dataSource()) {
                   //     body.push([
                   //         transfer.name,
                   //         transfer.email,
                   //         transfer.office ? transfer.office.name.toUpperCase() : 'TODAS'
                   //     ])
                   // }
                   // const name = `USUARIOS`
                   // buildExcel(body, name, wscols, [], [])
                    break

                default:
                    break
            }
        })

        this.fetchData()
        this.fetchCount()
    }

    fetchCount() {
        this.transfersService.getCountTransfers().subscribe(count => {
            this.$length.set(count)
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.transfersService.getTransfersByPage(this.pageIndex + 1, this.pageSize).subscribe(transfers => {
            console.log(transfers)
            this.navigationService.loadBarFinish()
            this.$dataSource.set(transfers)
        })
    }

    onDeleteTransfer(transferId: any) {
        const ok = confirm('Estas seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.transfersService.delete(transferId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.fetchData()
            })
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

}
