import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { NavigationService } from '../../navigation/navigation.service';
import { CreateProformaModel } from '../create-proforma.model';
import { ProformaItemModel } from '../proforma-item.model';
import { ProformaModel } from '../proforma.model';
import { ProformasService } from '../proformas.service';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { ProformaItemsComponent } from '../proforma-items/proforma-items.component';

interface FormData {
    addressIndex: number
    observations: string
    currencyCode: string
    discount: any
}

@Component({
    selector: 'app-charge-edit-proformas',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, ProformaItemsComponent],
    templateUrl: './charge-edit-proformas.component.html',
    styleUrls: ['./charge-edit-proformas.component.sass']
})
export class ChargeEditProformasComponent implements OnInit {

    constructor(
        private readonly proformasService: ProformasService,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly matDialog: MatDialog,
        private readonly authService: AuthService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        addressIndex: 0,
        observations: '',
        currencyCode: 'PEN',
        discount: null,
    } as FormData)

    proformaItems: ProformaItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    cash: number = 0
    setting = new SettingModel()
    addresses: string[] = [];
    private proforma: ProformaModel | null = null

    private handleClickMenu$: Subscription = new Subscription()
    private handleProformaItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleProformaItems$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Guardar proforma')

        this.proforma = this.proformasService.getProforma()
        if (this.proforma === null) {
            this.router.navigate(['/proformas'])
        } else {
            this.customer = this.proforma.customer
            this.addresses = this.proforma.customer?.addresses || []
            this.formGroup.patchValue(this.proforma)
        }

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })

        this.navigationService.setMenu([
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_customer':
                    const dialogRef = this.matDialog.open(DialogSearchCustomersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.setting.defaultSearchCustomer
                    })

                    dialogRef.afterClosed().subscribe(customer => {
                        if (customer) {
                            this.customer = customer
                            this.addresses = customer.addresses
                        }
                    })

                    dialogRef.componentInstance.handleCreateCustomer().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateCustomersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(customer => {
                            if (customer) {
                                this.customer = customer
                                this.addresses = customer.addresses
                            }
                        })
                    })
                    break
                default:
                    break
            }
        })

        this.handleProformaItems$ = this.proformasService.handleProformaItems().subscribe(proformaItems => {
            this.proformaItems = proformaItems
            this.charge = 0
            for (const proformaItem of this.proformaItems) {
                if (proformaItem.igvCode !== '11') {
                    this.charge += proformaItem.price * proformaItem.quantity
                }
            }
            this.charge -= this.proforma?.discount || 0
        })
    }

    addCash(cash: number) {
        this.cash += cash
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    onChangeDiscount() {
        const { discount } = this.formGroup.value
        this.charge = 0
        for (const proformaItem of this.proformaItems) {
            if (proformaItem.igvCode !== '11') {
                this.charge += proformaItem.price * proformaItem.quantity
            }
        }
        this.charge -= discount
    }

    onSubmit() {
        try {

            if (!this.proformaItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.proformaItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            this.isLoading = true
            this.navigationService.loadBarStart()

            const formData: FormData = this.formGroup.value

            const proforma: CreateProformaModel = {
                addressIndex: formData.addressIndex,
                observations: formData.observations,
                discount: formData.discount,
                currencyCode: formData.currencyCode || 'PEN',
                customerId: this.customer?._id || null,
            }

            this.proformasService.update(proforma, this.proformaItems, this.proforma?._id || '').subscribe({
                next: () => {
                    this.proformasService.setProformaItems([])
                    this.router.navigate(['/proformas'])
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
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

    onEditCustomer() {
        const dialogRef = this.matDialog.open(DialogEditCustomersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.customer,
        })

        dialogRef.afterClosed().subscribe(customer => {
            if (customer) {
                this.customer = customer
                this.addresses = customer.addresses
            }
        })
    }

}