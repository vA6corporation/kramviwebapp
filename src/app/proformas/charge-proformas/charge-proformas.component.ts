import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { DialogOutStockComponent } from '../../sales/dialog-out-stock/dialog-out-stock.component';
import { UserModel } from '../../users/user.model';
import { CreateProformaModel } from '../create-proforma.model';
import { ProformaItemModel } from '../proforma-item.model';
import { ProformasService } from '../proformas.service';
import { MaterialModule } from '../../material.module';
import { ProformaItemsComponent } from '../proforma-items/proforma-items.component';
import { CommonModule } from '@angular/common';

interface FormData {
    addressIndex: number
    observations: string
    currencyCode: string
    igvPercent: number
    discount: any
}

@Component({
    selector: 'app-charge-proformas',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, ProformaItemsComponent],
    templateUrl: './charge-proformas.component.html',
    styleUrls: ['./charge-proformas.component.sass']
})
export class ChargeProformasComponent {

    constructor(
        private readonly proformasService: ProformasService,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly matDialog: MatDialog,
        private readonly printService: PrintService,
        private readonly authService: AuthService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        addressIndex: 0,
        observations: '',
        currencyCode: 'PEN',
        igvPercent: 18,
        discount: null,
    } as FormData)
    proformaItems: ProformaItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    cash: number = 0
    setting = new SettingModel()
    addresses: string[] = []
    private user: UserModel = new UserModel()

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

        this.navigationService.setMenu([
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.user = auth.user

            this.formGroup.patchValue({ invoiceType: this.setting.defaultInvoice })
        })

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
        })
    }

    onChangePercent() {
        const { igvPercent } = this.formGroup.value
        if (igvPercent) {
            this.formGroup.patchValue({ igvPercent: 18 })
        } else {
            this.formGroup.patchValue({ igvPercent: 0 })
        }
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

            const createdProforma: CreateProformaModel = {
                addressIndex: formData.addressIndex,
                observations: formData.observations,
                discount: formData.discount,
                igvPercent: formData.igvPercent,
                currencyCode: formData.currencyCode || 'PEN',
                customerId: this.customer?._id || null,
            }

            if (this.setting.allowFreeStock) {
                this.proformasService.create(createdProforma, this.proformaItems).subscribe(proforma => {
                    proforma.user = this.user
                    proforma.proformaItems = this.proformaItems
                    proforma.customer = this.customer

                    this.printService.printA4Proforma(proforma)
                    this.proformasService.setProformaItems([])

                    this.router.navigate(['/proformas'])

                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
                }, (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                })
            } else {
                this.proformasService.createWithStock(createdProforma, this.proformaItems).subscribe(res => {
                    const { proforma, outStocks } = res
                    if (proforma) {
                        proforma.user = this.user
                        proforma.proformaItems = this.proformaItems
                        proforma.customer = this.customer

                        this.printService.printA4Proforma(proforma)
                        this.proformasService.setProformaItems([])

                        this.router.navigate(['/proformas'])

                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage('Registrado correctamente')
                    } else {
                        this.navigationService.loadBarFinish()
                        this.isLoading = false
                        this.matDialog.open(DialogOutStockComponent, {
                            width: '600px',
                            position: { top: '20px' },
                            data: outStocks,
                        })
                    }
                }, (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                })
            }

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
