import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../../offices/offices.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { ProviderModel } from '../../providers/provider.model';
import { CreateMoveItemModel } from '../create-move-item.model';
import { CreateMoveModel } from '../create-move.model';
import { MovesService } from '../moves.service';

interface FormData {
    toOfficeId: any,
    observations: string,
}

@Component({
    selector: 'app-charge-moves',
    templateUrl: './charge-moves.component.html',
    styleUrls: ['./charge-moves.component.sass']
})
export class ChargeMovesComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly movesService: MovesService,
        private readonly authService: AuthService,
        private readonly officesService: OfficesService,
        private readonly router: Router,
    ) { }

    moveItems: CreateMoveItemModel[] = [];
    provider: ProviderModel | null = null;
    isLoading: boolean = false;
    formGroup: FormGroup = this.formBuilder.group({
        toOfficeId: ['', Validators.required],
        officeId: ['', Validators.required],
        observations: '',
    } as FormData);
    private office: OfficeModel = new OfficeModel();
    offices: OfficeModel[] = [];
    private handleOfficesByActivity$: Subscription = new Subscription();

    invoiceTypes = [
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ];

    paymentMethods: PaymentMethodModel[] = [];

    private handleAuth$: Subscription = new Subscription();
    private handleMoveItems$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleAuth$.unsubscribe();
        this.handleMoveItems$.unsubscribe();
        this.handleOfficesByActivity$.unsubscribe();
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Traspasar')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.formGroup.patchValue({ officeId: this.office._id })
            this.handleOfficesByActivity$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
                this.offices = offices
            })
        })

        this.handleMoveItems$ = this.movesService.handleMoveItems().subscribe(moveItems => {
            this.moveItems = moveItems
        })
    }

    onSubmit() {
        try {
            const formData: FormData = this.formGroup.value
            const move: CreateMoveModel = {
                toOfficeId: formData.toOfficeId,
                observations: formData.observations,
            }
            if (this.moveItems.length === 0) {
                throw new Error('Agrega un producto')
            }
            if (!this.formGroup.valid) {
                throw new Error('Seleccione una sucursal de destino')
            }
            this.isLoading = true
            this.navigationService.loadBarStart()

            this.movesService.create(move, this.moveItems).subscribe({
                next: () => {
                    this.movesService.setMoveItems([])
                    this.router.navigate(['/moves'])
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                }
            })
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
            this.isLoading = false
            this.navigationService.loadBarFinish()
        }
    }

}
