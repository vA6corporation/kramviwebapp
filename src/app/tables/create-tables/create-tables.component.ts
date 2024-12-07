import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { TablesService } from '../tables.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-create-tables',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './create-tables.component.html',
    styleUrls: ['./create-tables.component.sass']
})
export class CreateTablesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly tablesService: TablesService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
    })
    isLoading: boolean = false

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva mesa')
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.tablesService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/tables'])
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    console.log(error)
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
