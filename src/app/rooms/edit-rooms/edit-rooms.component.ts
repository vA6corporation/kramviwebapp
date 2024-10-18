import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { RoomsService } from '../rooms.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-edit-rooms',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-rooms.component.html',
    styleUrls: ['./edit-rooms.component.sass']
})
export class EditRoomsComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly roomsService: RoomsService,
        private readonly formBuilder: FormBuilder,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        roomNumber: ['', Validators.required],
        beds: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        igvCode: '10'
    })
    isLoading: boolean = false
    private roomId: string = ''

    ngOnInit(): void {
        this.navigationService.setTitle('Editar habitacion')
        this.navigationService.loadBarStart()

        this.roomId = this.activatedRoute.snapshot.params['roomId']
        this.roomsService.getRoomById(this.roomId).subscribe({
            next: room => {
                this.navigationService.loadBarFinish()
                this.formGroup.patchValue(room)
            },
            error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.isLoading = true
            this.roomsService.update(this.formGroup.value, this.roomId).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.isLoading = false
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
