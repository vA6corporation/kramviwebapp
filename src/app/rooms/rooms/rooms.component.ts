import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { RoomModel } from '../room.model';
import { RoomsService } from '../rooms.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-rooms',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './rooms.component.html',
    styleUrls: ['./rooms.component.sass']
})
export class RoomsComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly roomsService: RoomsService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    displayedColumns: string[] = ['name', 'roomNumber', 'beds', 'description', 'price', 'actions']
    dataSource: RoomModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Habitaciones')

        this.roomsService.getCountRooms().subscribe(count => {
            this.length = count
        })

        const { pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams

        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)

        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.roomsService.getRoomsByPage(this.pageIndex + 1, this.pageSize).subscribe(rooms => {
            this.navigationService.loadBarFinish()
            this.dataSource = rooms
        })
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

}
