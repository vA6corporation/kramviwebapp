import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { TablesService } from '../tables.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-edit-tables',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-tables.component.html',
    styleUrls: ['./edit-tables.component.sass']
})
export class EditTablesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly tablesService: TablesService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        deletedAt: null
    })
    isLoading: boolean = false
    private tableId: string = ''

    ngOnInit(): void {
        this.navigationService.setTitle('Editar mesa')

        this.tableId = this.activatedRoute.snapshot.params['tableId']
        this.tablesService.getTableById(this.tableId).subscribe(table => {
            this.formGroup.patchValue(table)
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.tablesService.update(this.formGroup.value, this.tableId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
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
