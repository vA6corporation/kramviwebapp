import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { NavigationService } from '../../navigation/navigation.service';
import { CreateSaleItemModel } from '../../sales/create-sale-item.model';
import { SaleModel } from '../../sales/sale.model';
import { SalesService } from '../../sales/sales.service';
import { UserModel } from '../../users/user.model';
import { WorkerModel } from '../../workers/worker.model';
import { WorkersService } from '../../workers/workers.service';
import { CreateCreditNoteModel } from '../create-credit-note.model';
import { CreditNotesService } from '../credit-notes.service';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { SaleItemsComponent } from '../../sales/sale-items/sale-items.component';

interface FormData {
    discount: any,
    reasonCode: any,
    reasonDescription: any,
    observations: string,
    emitionAt: Date,
    workerId: string | null
}

@Component({
    selector: 'app-create-credit-notes',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, SaleItemsComponent],
    templateUrl: './create-credit-notes.component.html',
    styleUrls: ['./create-credit-notes.component.sass']
})
export class CreateCreditNotesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly salesService: SalesService,
        private readonly creditNotesService: CreditNotesService,
        private readonly workersService: WorkersService,
        private readonly matDialog: MatDialog,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        emitionAt: new Date(),
        reasonCode: ['', Validators.required],
        reasonDescription: ['', Validators.required],
        observations: '',
        workerId: null,
    })
    saleItems: CreateSaleItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    cash: number = 0
    saleId: string = ''
    sale: SaleModel | null = null
    office: OfficeModel = new OfficeModel()
    setting: SettingModel = new SettingModel()
    user: UserModel = new UserModel()
    addresses: string[] = []
    workers: WorkerModel[] = []

    reasons = [
        { code: '01', label: 'ANULACION DE LA OPERACION' },
        { code: '02', label: 'ANULACION POR ERROR EN EL RUC' },
        { code: '03', label: 'CORRECCION POR ERROR EN LA DESCRIPCION' },
        { code: '04', label: 'DESCUENTO GLOBAL' },
        { code: '05', label: 'DESCUENTO POR ITEM' },
        { code: '06', label: 'DEVOLUCION TOTAL' },
        { code: '07', label: 'DEVOLUCION PARCIAL' },
        { code: '08', label: 'BONIFICACION' },
        { code: '09', label: 'DISMINUCION EN EL VALOR' },
    ]

    private handleClickMenu$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleWorkers$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.salesService.setSaleItems([])
        this.handleAuth$.unsubscribe()
        this.handleWorkers$.unsubscribe()
    }

    ngOnInit(): void {

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
            this.setting = auth.setting
            this.office = auth.office
        })

        this.handleWorkers$ = this.workersService.handleWorkers().subscribe(workers => {
            this.workers = workers
        })

        this.saleId = this.activatedRoute.snapshot.params['saleId']
        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            this.sale = sale
            this.salesService.setSale(sale)
            const { customer } = this.sale
            this.navigationService.setTitle(`Nueva nota de credito ${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)
            this.customer = customer
            this.formGroup.patchValue({ workerId: sale.workerId })
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
                            }
                        })
                    })
                    break

                default:
                    break
            }
        })

        this.navigationService.setTitle('Cobrar')

        this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
            this.saleItems = saleItems
            this.charge = 0
            for (const saleItem of this.saleItems) {
                if (saleItem.igvCode !== '11') {
                    this.charge += saleItem.price * saleItem.quantity
                }
            }
        })
    }

    onChangeDiscount() {
        const { discount } = this.formGroup.value
        this.charge = 0
        for (const saleItem of this.saleItems) {
            if (saleItem.igvCode !== '11') {
                this.charge += saleItem.price * saleItem.quantity
            }
        }
        this.charge -= discount
    }

    onSubmit() {
        this.isLoading = true
        try {

            if (!this.formGroup.valid) {
                throw new Error("Complete los campos")
            }

            if (this.sale === null || this.saleId === null) {
                throw new Error("No hemos encontrado la venta")
            }

            if (!this.saleItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.saleItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            this.navigationService.loadBarStart()

            const formData: FormData = this.formGroup.value

            const createdCreditNote: CreateCreditNoteModel = {
                reasonCode: formData.reasonCode,
                discount: formData.discount || null,
                reasonDescription: formData.reasonDescription,
                observations: formData.observations,
                emitionAt: formData.emitionAt,
                customerId: this.customer?._id || null,
                workerId: formData.workerId,
                igvPercent: this.sale.igvPercent,
                rcPercent: this.sale.rcPercent
            }

            this.creditNotesService.create(this.sale, createdCreditNote, this.saleItems, this.saleId).subscribe({
                next: () => {
                    this.salesService.setSaleItems([])
                    const queryParams: Params = { tabIndex: 1 }
                    this.router.navigate(['/invoices'], { queryParams })
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
