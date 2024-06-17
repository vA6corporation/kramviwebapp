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
    selector: 'app-charge-edit-moves',
    templateUrl: './charge-edit-moves.component.html',
    styleUrls: ['./charge-edit-moves.component.sass']
})
export class ChargeEditMovesComponent implements OnInit {

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
        officeId: ['', Validators.required],
        toOfficeId: ['', Validators.required],
        observations: '',
    } as FormData);
    offices: OfficeModel[] = [];
    invoiceTypes = [
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ];
    paymentMethods: PaymentMethodModel[] = [];
    private moveId: string = '';

    private handleAuth$: Subscription = new Subscription();
    private handleMoveItems$: Subscription = new Subscription();
    private handleOfficesByActivity$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleAuth$.unsubscribe();
        this.handleMoveItems$.unsubscribe();
        this.handleOfficesByActivity$.unsubscribe();
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Traspasar');

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.handleOfficesByActivity$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
                this.offices = offices;
            });
        });

        const move = this.movesService.getMove();
        if (move) {
            this.moveId = move._id;
            this.formGroup.patchValue(move);
            this.formGroup.patchValue({ officeId: move.officeId });
        } else {
            this.router.navigate(['/moves']);
        }

        this.handleMoveItems$ = this.movesService.handleMoveItems().subscribe(moveItems => {
            this.moveItems = moveItems;
        });
    }

    onSubmit() {
        try {
            const formData: FormData = this.formGroup.value;

            const move: CreateMoveModel = {
                toOfficeId: formData.toOfficeId,
                observations: formData.observations,
            }

            if (this.moveItems.length === 0) {
                throw new Error('Agrega un producto');
            }

            if (!this.formGroup.valid) {
                throw new Error('Seleccione una sucursal de destino');
            }

            this.isLoading = true;
            this.navigationService.loadBarStart();

            this.movesService.update(move, this.moveItems, this.moveId).subscribe(moves => {
                this.movesService.setMoveItems([]);
                this.router.navigate(['/moves']);
                this.isLoading = false;
                this.navigationService.loadBarFinish();
                this.navigationService.showMessage('Registrado correctamente');
            }, (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message);
                this.isLoading = false;
                this.navigationService.loadBarFinish();
            });
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message);
            }
            this.isLoading = false;
            this.navigationService.loadBarFinish();
        }
    }

}
