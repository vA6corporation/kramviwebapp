import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { ActivitiesService } from '../activities.service';
import { ActivityModel } from '../activity.model';

@Component({
    selector: 'app-activities',
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.sass']
})
export class ActivitiesComponent implements OnInit {

    constructor(
        private readonly activitiesService: ActivitiesService,
        private readonly navigationService: NavigationService,
    ) { }

    displayedColumns: string[] = ['name', 'actions']
    dataSource: ActivityModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Actividades')
        this.navigationService.loadBarStart()
        this.activitiesService.getActivities().subscribe({
            next: activities => {
                this.navigationService.loadBarFinish()
                this.dataSource = activities
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        });
    }

}
