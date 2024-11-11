import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { CustomerModel } from '../../customers/customer.model';
import { NavigationService } from '../../navigation/navigation.service';
import { SpecialtiesService } from '../specialties.service';

@Component({
    selector: 'app-specialties',
    templateUrl: './specialties.component.html',
    styleUrls: ['./specialties.component.sass']
})
export class SpecialtiesComponent {

    constructor(
        private readonly specialtiesService: SpecialtiesService,
        private readonly navigationService: NavigationService,
    ) { }

    displayedColumns: string[] = ['name', 'actions']
    dataSource: CustomerModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    private subscription: Subscription = new Subscription()

    handlePageEvent(event: PageEvent): void {
        this.specialtiesService.getSpecialtiesByPage(event.pageIndex + 1, event.pageSize).subscribe(specialties => {
            this.dataSource = specialties
        })
    }

    fetchData() {
        this.navigationService.setTitle('Especialidades')
        this.specialtiesService.getSpecialtiesCount().subscribe(count => {
            this.length = count
        })

        this.specialtiesService.getSpecialtiesByPage(this.pageIndex + 1, this.pageSize).subscribe(specialties => {
            console.log(specialties)
            this.dataSource = specialties
        })
    }

    ngOnInit(): void {
        this.fetchData()
    }

    onDelete(specialtyId: string) {
        const ok = confirm('Esta seguro de anular?...')
        if (ok) {
            this.specialtiesService.deleteSpecialty(specialtyId).subscribe(() => {
                this.fetchData()
            })
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
