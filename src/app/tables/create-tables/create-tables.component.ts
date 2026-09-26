import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { NavigationService } from '../../navigation/navigation.service'
import { TablesService } from '../tables.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-create-tables',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './create-tables.component.html',
    styleUrls: ['./create-tables.component.sass']
})
export class CreateTablesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly tablesService = inject(TablesService)
    private readonly navigationService = inject(NavigationService)
    private readonly router = inject(Router)

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
    })
    $isLoading = signal<boolean>(false)

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva mesa')
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.navigationService.loadBarStart()
            this.tablesService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/tables'])
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    console.log(error)
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
