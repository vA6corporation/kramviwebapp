import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { OfficeModel } from '../office.model'
import { NavigationService } from '../../navigation/navigation.service'
import { OfficesService } from '../offices.service'
import { MaterialModule } from '../../material.module'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-offices',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './offices.component.html',
    styleUrls: ['./offices.component.sass'],
})
export class OfficesComponent {

    private readonly navigationService = inject(NavigationService)
    private readonly officesService = inject(OfficesService)

    displayedColumns: string[] = ['name', 'address', 'activityName', 'serialPrefix', 'codigoAnexo', 'actions']
    $dataSource = signal<OfficeModel[]>([])
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Sucursales')
        this.fetchData()
    }

    onDeleteOffice(officeId: any) {
        const ok = confirm('Estas seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.officesService.delete(officeId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Eliminado correctamente')
                this.fetchData()
            })
        }
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.officesService.getOffices().subscribe({
            next: offices => {
                this.navigationService.loadBarFinish()
                this.$dataSource.set(offices)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

}
