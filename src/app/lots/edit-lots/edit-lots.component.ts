import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogSearchProductsComponent } from '../../products/dialog-search-products/dialog-search-products.component';
import { LotsService } from '../lots.service';
import { MaterialModule } from '../../material.module';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-lots',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-lots.component.html',
  styleUrl: './edit-lots.component.sass'
})
export class EditLotsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly lotsService: LotsService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        lotNumber: ['', Validators.required],
        stock: null,
        expirationAt: [null, Validators.required],
        product: this.formBuilder.group({
            _id: ['', Validators.required],
            fullName: ['', Validators.required]
        }),
    })
    isLoading: boolean = false;
    private lotId: string = ''

    ngOnInit(): void {
        this.navigationService.setTitle('Editar lote')

        this.lotId = this.activatedRoute.snapshot.params['lotId']
        this.lotsService.getLotById(this.lotId).subscribe(lot => {
            this.formGroup.patchValue(lot)
        })
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
            this.lotsService.update(lot, this.lotId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
