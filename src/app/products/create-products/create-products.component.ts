import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import Compressor from 'compressorjs';
import { Subscription } from 'rxjs';
import { DialogAnnotationsComponent } from '../dialog-annotations/dialog-annotations.component';
import { DialogCreateCategoriesComponent } from '../dialog-create-categories/dialog-create-categories.component';
import { DialogSearchProductsComponent } from '../dialog-search-products/dialog-search-products.component';
import { PriceType } from '../price-type.enum';
import { ProductModel } from '../product.model';
import { IgvCodeModel, ProductsService, UnitCodeModel } from '../products.service';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { OfficesService } from '../../offices/offices.service';
import { CategoriesService } from '../categories.service';
import { AuthService } from '../../auth/auth.service';
import { CategoryModel } from '../category.model';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { PriceListModel } from '../price-list.model';
import { LotModel } from '../../lots/lot.model';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { DialogCreateLotsComponent } from '../../lots/dialog-create-lots/dialog-create-lots.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-create-products',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './create-products.component.html',
    styleUrls: ['./create-products.component.sass']
})
export class CreateProductsComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly productsService: ProductsService,
        private readonly navigationService: NavigationService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly officesService: OfficesService,
        private readonly categoriesService: CategoriesService,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly matDialog: MatDialog,
        private readonly ngZone: NgZone
    ) { }

    formArray: FormArray = this.formBuilder.array([])
    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        feature: '',
        brand: '',
        location: '',
        description: '',
        categoryId: [null, Validators.required],
        unitCode: 'NIU',
        igvCode: '10',
        sku: '',
        upc: '',
        price: [null, Validators.required],
        cost: null,
        isTrackStock: false,
        printZone: 'COCINA',
        prices: this.formArray,
        stock: null
    })

    isLoading: boolean = false
    categories: CategoryModel[] = []
    unitCodes: UnitCodeModel[] = []
    igvCodes: IgvCodeModel[] = []
    offices: OfficeModel[] = []
    priceLists: PriceListModel[] = []
    annotations: string[] = []
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()
    isTrackStock = false
    imgUri: string = ''
    linkProducts: ProductModel[] = []
    lots: LotModel[] = []
    private file: File | null = null
    private paymentMethodId: string = ''
    private paymentMethods: PaymentMethodModel[] = []

    private handleCategories$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handleOfficesByActivity$: Subscription = new Subscription()
    private handleSaveCategory$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleCategories$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handleOfficesByActivity$.unsubscribe()
        this.handleSaveCategory$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
    }

    async ngOnInit(): Promise<void> {
        this.navigationService.setTitle('Nuevo Producto')

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.paymentMethodId = (this.paymentMethods[0] || { _id: '' })._id
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
            this.formGroup.patchValue({ igvCode: this.setting.defaultIgvCode })
            switch (this.setting.defaultPrice) {
                case PriceType.OFICINA:
                    this.formGroup.get('price')?.setValidators([])
                    this.formGroup.get('price')?.updateValueAndValidity()
                    this.formGroup.patchValue({ price: 0 })
                    this.handleOfficesByActivity$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
                        this.offices = offices
                        for (const office of this.offices) {
                            const formGroup = this.formBuilder.group({
                                name: `Precio ${office.name}`,
                                price: [null, Validators.required],
                                priceListId: null,
                                officeId: office._id,
                            })
                            this.formArray.push(formGroup)
                        }
                    })
                    break
                case PriceType.LISTA:
                case PriceType.LISTAOFICINA:
                    this.formGroup.get('price')?.setValidators([])
                    this.formGroup.get('price')?.updateValueAndValidity()
                    this.formGroup.patchValue({ price: 0 })
                    this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                        this.priceLists = priceLists
                        for (const priceList of this.priceLists) {
                            const formGroup = this.formBuilder.group({
                                name: `Precio ${priceList.name}`,
                                price: [null, Validators.required],
                                priceListId: priceList._id,
                                officeId: this.office._id,
                            })
                            this.formArray.push(formGroup)
                        }
                    })
                    break
            }
        })

        this.igvCodes = this.productsService.getIgvCodes()
        this.unitCodes = this.productsService.getUnitCodes()

    }

    onIsTrackStockChange() {
        this.isTrackStock = this.formGroup.get('isTrackStock')?.value
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
        this.formGroup.patchValue({ upc: `7${result}` })
        this.formGroup.patchValue({ sku: result2 })
    }

    onOpenDialogAnnotations() {
        const dialogRef = this.matDialog.open(DialogAnnotationsComponent, {
            width: '600px',
            position: { top: '20px' },
            // data: index,
        })

        dialogRef.afterClosed().subscribe(annotation => {
            if (annotation) {
                this.annotations.push(annotation)
            }
        })
    }

    onCreateCategory() {
        const dialogRef = this.matDialog.open(DialogCreateCategoriesComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        this.handleSaveCategory$ = dialogRef.componentInstance.handleSaveCategory().subscribe(name => {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.categoriesService.create(name).subscribe(category => {
                this.isLoading = false
                this.navigationService.showMessage('Registrado correctamente')
                this.navigationService.loadBarFinish()
                this.categoriesService.loadCategories()
                this.formGroup.patchValue({ categoryId: category._id })
            }, (error: HttpErrorResponse) => {
                this.isLoading = false
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            })
        })
    }

    onRemoveAnnotation(index: number) {
        this.annotations.splice(index, 1)
    }

    getBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = function () {
                resolve(String(reader.result))
            }
            reader.onerror = function (error) {
                console.log('Error: ', error)
                reject(error)
            }
        })
    }

    async onFileImageSelected(files: FileList | null, input: HTMLInputElement) {
        if (files && files[0]) {
            this.imgUri = await this.getBase64(files[0])
            this.file = files[0]
            input.value = ''
        }
    }

    onOpenDialogSearchProducts() {
        const dialogRef = this.matDialog.open(DialogSearchProductsComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(product => {
            if (product) {
                this.linkProducts.push(product)
            }
        })
    }

    onOpenDialogCreateLot() {
        const dialogRef = this.matDialog.open(DialogCreateLotsComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(lot => {
            if (lot) {
                this.lots.push(lot)
            }
        })
    }

    onRemoveProduct(index: number) {
        this.linkProducts.splice(index, 1)
    }

    onRemoveLot(index: number) {
        const ok = confirm('Estas seguro de anular?...')
        if (ok) {
            this.lots.splice(index, 1)
        }
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            const product = this.formGroup.value
            const linkProductIds = this.linkProducts.map(e => e._id)
            product.annotations = this.annotations
            product.linkProductIds = linkProductIds
            this.navigationService.loadBarStart()
            this.productsService.create(product, this.formArray.value, this.lots, this.paymentMethodId).subscribe({
                next: product => {
                    this.categoriesService.loadCategories()
                    if (this.file) {
                        new Compressor(this.file, {
                            quality: 0.5,
                            success: (result: any) => {
                                const formData = new FormData()
                                formData.append('file', result, result.name)
                                this.ngZone.run(() => {
                                    this.productsService.uploadImage(formData, product._id).subscribe(imageId => {
                                        this.isLoading = false
                                        this.navigationService.loadBarFinish()
                                        this.router.navigate(['/products'])
                                        this.navigationService.showMessage('Registrado correctamente')
                                    })
                                })
                            }
                        })
                    } else {
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        this.router.navigate(['/products'])
                        this.navigationService.showMessage('Registrado correctamente')
                    }
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
