import { Component } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../offices.service';
import { OfficeModel } from '../../auth/office.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-disabled-offices',
    imports: [MaterialModule, CommonModule],
    templateUrl: './disabled-offices.component.html',
    styleUrls: ['./disabled-offices.component.sass'],
})
export class DisabledOfficesComponent {

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
        this.officesService.getDisabledOffices().subscribe(offices => {
            this.navigationService.loadBarFinish();
            this.dataSource = offices;
        }, (error: HttpErrorResponse) => {
            this.navigationService.showMessage(error.error.message);
        });
    }

    onRestoreOffice(officeId: string) {
        this.navigationService.loadBarStart();
        this.officesService.restore(officeId).subscribe(() => {
            this.navigationService.loadBarFinish();
            this.navigationService.showMessage('Restablecido correctamente');
            this.dataSource = this.dataSource.filter(e => e._id !== officeId);
        });
    }

}
