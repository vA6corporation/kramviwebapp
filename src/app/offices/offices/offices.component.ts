import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../offices.service';

@Component({
    selector: 'app-offices',
    templateUrl: './offices.component.html',
    styleUrls: ['./offices.component.sass']
})
export class OfficesComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly officesService: OfficesService,
    ) { }

    displayedColumns: string[] = ['name', 'address', 'activityName', 'serialPrefix', 'codigoAnexo', 'actions'];
    dataSource: OfficeModel[] = [];
    length: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 30, 50];
    pageIndex: number = 0;

    ngOnInit(): void {
        this.navigationService.setTitle('Sucursales');
        this.navigationService.loadBarStart();
        this.officesService.getOffices().subscribe(offices => {
            this.navigationService.loadBarFinish();
            this.dataSource = offices;
        }, (error: HttpErrorResponse) => {
            this.navigationService.showMessage(error.error.message);
        });
    }

    onDeleteOffice(officeId: string) {
        const ok = confirm('Estas seguro de eliminar?...');
        if (ok) {
            this.navigationService.loadBarStart();
            this.officesService.delete(officeId).subscribe(() => {
                this.navigationService.loadBarFinish();
                this.navigationService.showMessage('Eliminado correctamente');
                this.dataSource = this.dataSource.filter(e => e._id !== officeId);
            });
        }
    }

}
