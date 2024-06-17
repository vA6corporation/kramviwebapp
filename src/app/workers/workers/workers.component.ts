import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CustomerModel } from '../../customers/customer.model';
import { NavigationService } from '../../navigation/navigation.service';
import { WorkersService } from '../workers.service';

@Component({
    selector: 'app-workers',
    templateUrl: './workers.component.html',
    styleUrls: ['./workers.component.sass']
})
export class WorkersComponent implements OnInit {

    constructor(
        private readonly workersService: WorkersService,
        private readonly navigationService: NavigationService,
    ) { }

    displayedColumns: string[] = ['document', 'name', 'email', 'mobileNumber', 'actions']
    dataSource: CustomerModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Personal')
        this.workersService.getWorkersCount().subscribe(count => {
            this.length = count
        })

        this.navigationService.loadBarStart()
        this.workersService.getWorkersByPage(this.pageIndex + 1, this.pageSize).subscribe(workers => {
            this.navigationService.loadBarFinish()
            this.dataSource = workers
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage(error.error.message)
        })
    }

    onDeleteWorker(workerId: string) {
        const ok = confirm('Esta seguro de anular?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.workersService.delete(workerId).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Anulado correctamente')
                    this.dataSource = this.dataSource.filter(e => e._id !== workerId)
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.navigationService.loadBarStart()
        this.workersService.getWorkersByPage(event.pageIndex + 1, event.pageSize).subscribe({
            next: workers => {
                this.dataSource = workers
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

}
