import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogSearchProductsComponent } from '../../products/dialog-search-products/dialog-search-products.component';
import { LotsService } from '../lots.service';

@Component({
    selector: 'app-create-lots',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './create-lots.component.html',
    styleUrl: './create-lots.component.sass'
})
export class CreateLotsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly lotsService: LotsService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
        private readonly matDialog: MatDialog,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        lotNumber: ['', Validators.required],
        stock: null,
        expirationAt: ['', Validators.required],
        product: this.formBuilder.group({
            _id: ['', Validators.required],
            fullName: ['', Validators.required]
        }),
    })
    isLoading: boolean = false

    ngOnInit(): void {
        this.navigationService.setTitle('Nuevo lote')
    }

    onGenerateEan13() {
        let result = ''
        let result2 = ''
        const characters = '0123456789'
        const charactersLength = characters.length
        for (let i = 0; i < 12; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        for (let i = 0; i < 4; i++) {
            result2 += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        this.formGroup.patchValue({ lotNumber: `7${result}` })
    }

    onOpenDialogSearchProducts() {
        const dialogRef = this.matDialog.open(DialogSearchProductsComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(product => {
            if (product) {
                this.formGroup.patchValue({ product })
            }
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            const { product, ...lot } = this.formGroup.value
            lot.productId = product._id
            this.lotsService.create(lot).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/lots'])
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
