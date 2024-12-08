import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CarrierModel } from '../../carriers/carrier.model';
import { DialogCarriersComponent } from '../../carriers/dialog-carriers/dialog-carriers.component';
import { DialogCreateCarriersComponent } from '../../carriers/dialog-create-carriers/dialog-create-carriers.component';
import { DialogEditCarriersComponent } from '../../carriers/dialog-edit-carriers/dialog-edit-carriers.component';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { NavigationService } from '../../navigation/navigation.service';
import { SalesService } from '../../sales/sales.service';
import { CreateRemissionGuideModel } from '../create-remission-guide.model';
import { RemissionGuideItemModel } from '../remission-guide-item.model';
import { RemissionGuidesService } from '../remission-guides.service';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { RemissionGuideItemsComponent } from '../remission-guide-items/remission-guide-items.component';

@Component({
    selector: 'app-charge-remission-guides',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, RemissionGuideItemsComponent],
    templateUrl: './charge-remission-guides.component.html',
    styleUrls: ['./charge-remission-guides.component.sass'],
})
export class ChargeRemissionGuidesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly matDialog: MatDialog,
        private readonly authService: AuthService,
        private readonly remissionGuidesService: RemissionGuidesService,
        private readonly salesService: SalesService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        addressIndex: 0,
        transportAt: [new Date(), Validators.required],
        carriageTypeCode: ['01', Validators.required],
        remissionGuideTypeCode: ['', Validators.required],
        reasonDescription: ['', Validators.required],
        shippingWeight: ['', Validators.required],
        observations: '',
        originDepartment: ['15', Validators.required],
        originProvince: ['1501', Validators.required],
        originLocationCode: ['', Validators.required],
        destinyDepartment: ['15', Validators.required],
        destinyProvince: ['1501', Validators.required],
        originAddress: ['', Validators.required],
        destinyAddress: ['', Validators.required],
        destinyLocationCode: ['', Validators.required],
    })

    remissionGuideTypes: any[] = [
        { code: '01', label: 'VENTA' },
        { code: '02', label: 'COMPRA' },
        { code: '04', label: 'TRASLADO ENTRE ESTABLECIMIENTO DE LA MISMA EMPRESA' },
        { code: '08', label: 'IMPORTACION' },
        { code: '09', label: 'EXPORTACION' },
        { code: '14', label: 'VENTA SUJETA A CONFIRMACION DEL COMPRADOR' },
        { code: '18', label: 'TRASLADO EMISOR ETINERANTE CP' },
        { code: '19', label: 'TRASLADO ZONA PRIMARIA' }
    ]

    departments: any[] = [
        { code: '01', name: 'Amazonas' },
        { code: '02', name: 'Ancash' },
        { code: '03', name: 'Apurimac' },
        { code: '04', name: 'Arequipa' },
        { code: '05', name: 'Ayacucho' },
        { code: '06', name: 'Cajamarca' },
        { code: '07', name: 'Callao' },
        { code: '08', name: 'Cusco' },
        { code: '09', name: 'Huancavelica' },
        { code: '10', name: 'Huanuco' },
        { code: '11', name: 'Ica' },
        { code: '12', name: 'Junin' },
        { code: '13', name: 'La Libertad' },
        { code: '14', name: 'Lambayeque' },
        { code: '15', name: 'Lima' },
        { code: '16', name: 'Loreto' },
        { code: '17', name: 'Madre de Dios' },
        { code: '18', name: 'Moquegua' },
        { code: '19', name: 'Pasco' },
        { code: '20', name: 'Piura' },
        { code: '21', name: 'Puno' },
        { code: '22', name: 'San Martin' },
        { code: '23', name: 'Tacna' },
        { code: '24', name: 'Tumbes' },
        { code: '25', name: 'Ucayali' }
    ]

    provinces: any[] = [
        { name: 'Cajatambo ', code: '1503', departmentCode: '15' },
        { name: 'Lima ', code: '1501', departmentCode: '15' },
        { name: 'Oyón ', code: '1509', departmentCode: '15' },
        { name: 'Cañete ', code: '1505', departmentCode: '15' },
        { name: 'Huaura ', code: '1508', departmentCode: '15' },
        { name: 'Huarochirí ', code: '1507', departmentCode: '15' },
        { name: 'Canta ', code: '1504', departmentCode: '15' },
        { name: 'Yauyos ', code: '1510', departmentCode: '15' },
        { name: 'Huaral ', code: '1506', departmentCode: '15' },
        { name: 'Barranca ', code: '1502', departmentCode: '15' }
    ]

    districts: any[] = [
        { name: 'La Molina', code: '150114', departmentCode: '15', provinceCode: '1501' },
        { name: 'Los Olivos', code: '150117', departmentCode: '15', provinceCode: '1501' },
        { name: 'Lurigancho', code: '150118', departmentCode: '15', provinceCode: '1501' },
        { name: 'Pucusana', code: '150124', departmentCode: '15', provinceCode: '1501' },
        { name: 'Breña', code: '150105', departmentCode: '15', provinceCode: '1501' },
        { name: 'Surquillo', code: '150141', departmentCode: '15', provinceCode: '1501' },
        { name: 'Punta Hermosa', code: '150126', departmentCode: '15', provinceCode: '1501' },
        { name: 'Puente Piedra', code: '150125', departmentCode: '15', provinceCode: '1501' },
        { name: 'Barranco', code: '150104', departmentCode: '15', provinceCode: '1501' },
        { name: 'Ate', code: '150103', departmentCode: '15', provinceCode: '1501' },
        { name: 'Santiago de Surco', code: '150140', departmentCode: '15', provinceCode: '1501' },
        { name: 'San Borja', code: '150130', departmentCode: '15', provinceCode: '1501' },
        { name: 'Ancón', code: '150102', departmentCode: '15', provinceCode: '1501' },
        { name: 'Independencia', code: '150112', departmentCode: '15', provinceCode: '1501' },
        { name: 'El Agustino', code: '150111', departmentCode: '15', provinceCode: '1501' },
        { name: 'Santa Anita', code: '150137', departmentCode: '15', provinceCode: '1501' },
        { name: 'Jesús María', code: '150113', departmentCode: '15', provinceCode: '1501' },
        { name: 'San Juan de Lurigancho', code: '150132', departmentCode: '15', provinceCode: '1501' },
        { name: 'Lima', code: '150101', departmentCode: '15', provinceCode: '1501' },
        { name: 'Chorrillos', code: '150108', departmentCode: '15', provinceCode: '1501' },
        { name: 'Santa Rosa', code: '150139', departmentCode: '15', provinceCode: '1501' },
        { name: 'San Luis', code: '150134', departmentCode: '15', provinceCode: '1501' },
        { name: 'Comas', code: '150110', departmentCode: '15', provinceCode: '1501' },
        { name: 'Lurin', code: '150119', departmentCode: '15', provinceCode: '1501' },
        { name: 'Pueblo Libre', code: '150121', departmentCode: '15', provinceCode: '1501' },
        { name: 'Carabayllo', code: '150106', departmentCode: '15', provinceCode: '1501' },
        { name: 'Punta Negra', code: '150127', departmentCode: '15', provinceCode: '1501' },
        { name: 'Magdalena del Mar', code: '150120', departmentCode: '15', provinceCode: '1501' },
        { name: 'La Victoria', code: '150115', departmentCode: '15', provinceCode: '1501' },
        { name: 'Miraflores', code: '150122', departmentCode: '15', provinceCode: '1501' },
        { name: 'Santa María del Mar', code: '150138', departmentCode: '15', provinceCode: '1501' },
        { name: 'San Isidro', code: '150131', departmentCode: '15', provinceCode: '1501' },
        { name: 'San Martín de Porres', code: '150135', departmentCode: '15', provinceCode: '1501' },
        { name: 'Villa El Salvador', code: '150142', departmentCode: '15', provinceCode: '1501' },
        { name: 'Cieneguilla', code: '150109', departmentCode: '15', provinceCode: '1501' },
        { name: 'San Miguel', code: '150136', departmentCode: '15', provinceCode: '1501' },
        { name: 'Pachacamac', code: '150123', departmentCode: '15', provinceCode: '1501' },
        { name: 'San Bartolo', code: '150129', departmentCode: '15', provinceCode: '1501' },
        { name: 'Rímac', code: '150128', departmentCode: '15', provinceCode: '1501' },
        { name: 'Chaclacayo', code: '150107', departmentCode: '15', provinceCode: '1501' },
        { name: 'San Juan de Miraflores', code: '150133', departmentCode: '15', provinceCode: '1501' },
        { name: 'Villa María del Triunfo', code: '150143', departmentCode: '15', provinceCode: '1501' },
        { name: 'Lince', code: '150116', departmentCode: '15', provinceCode: '1501' }
    ]

    originDepartments: any[] = this.departments
    destinyDepartments: any[] = this.departments

    originProvinces: any[] = this.provinces
    destinyProvinces: any[] = this.provinces

    originDistricts: any[] = this.districts
    destinyDistricts: any[] = this.districts

    remissionGuideItems: RemissionGuideItemModel[] = []
    carrier: CarrierModel | null = null
    customer: CustomerModel | null = null
    isLoading: boolean = false
    setting = new SettingModel()
    addresses: string[] = []
    private params: Params = {}
    private saleId: string | null = null

    private handleClickMenu$: Subscription = new Subscription()
    private handleRemissionGuideItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleRemissionGuideItems$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Guardar')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            if (!auth.business.clientId) {
                this.navigationService.showDialogMessage('Es necesario activar las credenciales de API Sunat para poder enviar la guia de remision, contacte al soporte tecnico')
            }
        })

        this.navigationService.setMenu([
            // { id: 'split_payment', label: 'Dividir pago', icon: 'checklist_rtl', show: true },
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
            { id: 'add_carrier', label: 'Agregar transportista', icon: 'local_shipping', show: true },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_carrier': {
                    const dialogRef = this.matDialog.open(DialogCarriersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })

                    dialogRef.afterClosed().subscribe(carrier => {
                        if (carrier) {
                            this.carrier = carrier
                        }
                    })

                    dialogRef.componentInstance.handleAddCarrier().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateCarriersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(carrier => {
                            if (carrier) {
                                this.carrier = carrier
                            }
                        })
                    })
                    break
                }
                case 'add_customer': {
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
                }
                default:
                    break
            }
        })

        this.formGroup.get('invoiceType')?.patchValue(this.setting.defaultInvoice)

        this.handleRemissionGuideItems$ = this.remissionGuidesService.handleRemissionGuideItems().subscribe(remissionGuideItems => {
            this.remissionGuideItems = remissionGuideItems
        })

        const { saleId } = this.activatedRoute.snapshot.queryParams
        if (saleId) {
            this.saleId = saleId
            Object.assign(this.params, { saleId })
            this.salesService.getSaleById(saleId).subscribe(sale => {
                const { saleItems, customer } = sale
                this.customer = customer
                if (customer) {
                    this.addresses = customer.addresses
                }
                this.remissionGuidesService.setRemissionGuideItems(saleItems)
            })
        }
    }

    onChangeOriginDepartment(departmentCode: string) {
        this.remissionGuidesService.getProvincesByDepartmentCode(departmentCode).subscribe(provinces => {
            this.originProvinces = provinces
        })
    }

    async onChangeOriginProvince(provinceCode: string) {
        this.remissionGuidesService.getDistrictsByProvinceCode(provinceCode).subscribe(districts => {
            this.originDistricts = districts
        })
    }

    async onChangeDestinyDepartment(departmentCode: string) {
        this.remissionGuidesService.getProvincesByDepartmentCode(departmentCode).subscribe(provinces => {
            this.destinyProvinces = provinces
        })
    }

    async onChangeDestinyProvince(provinceCode: string) {
        this.remissionGuidesService.getDistrictsByProvinceCode(provinceCode).subscribe(districts => {
            this.destinyDistricts = districts
        })
    }

    onSubmit() {
        try {
            if (!this.formGroup.valid) {
                throw new Error("Complete los campos")
            }

            if (this.customer === null) {
                throw new Error("Agrege un cliente")
            }

            if (this.carrier === null) {
                throw new Error("Agrege un transportista")
            }

            if (!this.remissionGuideItems.length) {
                throw new Error("Agrega un producto")
            }

            this.isLoading = true
            this.navigationService.loadBarStart()
            const formData = this.formGroup.value
            const remissionGuide: CreateRemissionGuideModel = {
                addressIndex: formData.addressIndex,
                remissionGuideTypeCode: formData.remissionGuideTypeCode,
                carriageTypeCode: formData.carriageTypeCode,
                shippingWeight: formData.shippingWeight,
                reasonDescription: formData.reasonDescription,
                transportAt: formData.transportAt,
                originLocationCode: formData.originLocationCode,
                originAddress: formData.originAddress,
                destinyLocationCode: formData.destinyLocationCode,
                destinyAddress: formData.destinyAddress,
                observations: formData.observations,
                carrierId: this.carrier?._id || null,
                customerId: this.customer?._id || null,
                saleId: this.saleId,
            }

            this.remissionGuidesService.create(
                remissionGuide,
                this.remissionGuideItems,
                this.carrier,
                this.params
            ).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.isLoading = false
                    this.remissionGuidesService.setRemissionGuideItems([])
                    this.customer = null
                    this.carrier = null
                    const queryParams: Params = { tabIndex: 2 }
                    this.router.navigate(['/remissionGuides'], { queryParams })
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
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

    onEditCarrier() {
        const dialogRef = this.matDialog.open(DialogEditCarriersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.carrier,
        })

        dialogRef.afterClosed().subscribe(carrier => {
            if (carrier) {
                this.carrier = carrier
            }
        })
    }

}
