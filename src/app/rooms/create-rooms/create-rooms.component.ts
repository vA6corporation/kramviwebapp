import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { RoomsService } from '../rooms.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-create-rooms',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './create-rooms.component.html',
    styleUrls: ['./create-rooms.component.sass']
})
export class CreateRoomsComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly roomsService: RoomsService,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required],
        roomNumber: [null, Validators.required],
        beds: [null, Validators.required],
        description: [null, Validators.required],
        price: [null, Validators.required]
    });
    isLoading: boolean = false

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva habitacion')
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.isLoading = true
            this.roomsService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.isLoading = false
                    this.router.navigate(['/rooms'])
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
