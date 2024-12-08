import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { ActivitiesService } from '../activities.service';
import { ActivityModel } from '../activity.model';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-activities',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.sass'],
})
export class ActivitiesComponent {

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
        })
    }

}
