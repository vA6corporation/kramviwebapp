import { Component, inject, signal } from '@angular/core'
import { NavigationService } from '../../navigation/navigation.service'
import { OfficesService } from '../offices.service'
import { OfficeModel } from '../office.model'
import { HttpErrorResponse } from '@angular/common/http'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-deleted-offices',
    imports: [MaterialModule, CommonModule],
    templateUrl: './deleted-offices.component.html',
    styleUrl: './deleted-offices.component.sass',
})
export class DeletedOfficesComponent {

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

    fetchData() {
        this.navigationService.loadBarStart()
        this.officesService.getDeletedOffices().subscribe(offices => {
            this.navigationService.loadBarFinish()
            this.$dataSource.set(offices)
        }, (error: HttpErrorResponse) => {
            this.navigationService.showMessage(error.error.message)
        })
    }

    onRestoreOffice(officeId: any) {
        this.navigationService.loadBarStart()
        this.officesService.restore(officeId).subscribe(() => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage('Restablecido correctamente')
            this.fetchData()
        })
    }

}
