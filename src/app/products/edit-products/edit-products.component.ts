import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Compressor from 'compressorjs';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { LotModel } from '../../lots/lot.model';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../../offices/offices.service';
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component';
import { ProviderModel } from '../../providers/provider.model';
import { CategoriesService } from '../categories.service';
import { CategoryModel } from '../category.model';
import { DialogCreateCategoriesComponent } from '../dialog-create-categories/dialog-create-categories.component';
import { DialogSearchProductsComponent } from '../dialog-search-products/dialog-search-products.component';
import { PriceListModel } from '../price-list.model';
import { PriceType } from '../price-type.enum';
import { ProductModel } from '../product.model';
import { IgvCodeModel, ProductsService, UnitCodeModel } from '../products.service';
import Ean from 'ean-generator';
import { DialogCreateAnnotationsComponent } from '../dialog-create-annotations/dialog-create-annotations.component';

@Component({
    selector: 'app-edit-products',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './edit-products.component.html',
    styleUrls: ['./edit-products.component.sass']
})
export class EditProductsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly categoriesService: CategoriesService,
        private readonly authService: AuthService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly officesService: OfficesService,
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
        prices: this.formArray
    })

    isLoading: boolean = false
    categories: CategoryModel[] = []
    unitCodes: UnitCodeModel[] = []
    igvCodes: IgvCodeModel[] = []
    productId: string = ""
    offices: OfficeModel[] = []
    priceLists: PriceListModel[] = []
    annotations: string[] = []
    excluded: string[] = []
    isExcluded: boolean = false
    imageId: string = ''
    urlImage: string = ''
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()
    products: ProductModel[] = []
    lots: LotModel[] = []
    providers: ProviderModel[] = []
    isTrackStock = false

    private handleCategories$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleOfficesByActivity$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleCategories$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleOfficesByActivity$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Editar Producto')

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office

            this.productId = this.activatedRoute.snapshot.params['productId']
            this.navigationService.loadBarStart()
            this.productsService.getProductById(this.productId).subscribe(product => {
                this.formGroup.patchValue(product)
                this.lots = product.lots
                this.products = product.products
                this.providers = product.providers
                this.isTrackStock = product.isTrackStock                // this.providers = product.providers
                this.navigationService.loadBarFinish()
                if (product.urlImage) {
                    this.urlImage = product.urlImage + `?ignoreCache=${Math.random()}`
                }
                this.annotations = product.annotations
                this.excluded = product.excluded

                if (product.excluded.find(e => e === this.office._id)) {
                    this.isExcluded = true
                }

                switch (this.setting.defaultPrice) {
                    case PriceType.OFICINA:
                        this.formGroup.get('price')?.setValidators([])
                        this.formGroup.get('price')?.updateValueAndValidity()
                        this.handleOfficesByActivity$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
                            this.offices = offices
                            for (const office of this.offices) {
                                const price = product.prices.find(e => e.officeId === office._id)
                                const formGroup = this.formBuilder.group({
                                    name: `Precio ${office.name}`,
                                    price: [price?.price || product.price, Validators.required],
                                    priceListId: null,
                                    officeId: office._id,
                                })
                                this.formArray.push(formGroup)
                            }
                        })
                        break
                    case PriceType.LISTA:
                        this.formGroup.get('price')?.setValidators([])
                        this.formGroup.get('price')?.updateValueAndValidity()
                        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                            this.priceLists = priceLists
                            for (const priceList of this.priceLists) {
                                const price = product.prices.find(e => e.priceListId === priceList._id)
                                const formGroup = this.formBuilder.group({
                                    name: `Precio ${priceList.name}`,
                                    price: [price?.price || product.price, Validators.required],
                                    priceListId: priceList._id,
                                    officeId: this.office._id,
                                })
                                this.formArray.push(formGroup)
                            }
                        })
                        break
                    case PriceType.LISTAOFICINA:
                        this.formGroup.get('price')?.setValidators([])
                        this.formGroup.get('price')?.updateValueAndValidity()
                        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                            this.priceLists = priceLists
                            for (const priceList of this.priceLists) {
                                const price = product.prices.find(e => e.priceListId === priceList._id && e.officeId === this.office._id)
                                const formGroup = this.formBuilder.group({
                                    name: `Precio ${priceList.name}`,
                                    price: [price?.price || product.price, Validators.required],
                                    priceListId: priceList._id,
                                    officeId: this.office._id,
                                })
                                this.formArray.push(formGroup)
                            }
                        })
                        break
                }
            })
        })

        this.igvCodes = this.productsService.getIgvCodes()
        this.unitCodes = this.productsService.getUnitCodes()
    }

    onGenerateEan13() {
        let ean = new Ean(['030', '031', '039'])
        const code = ean.create()
        let result = ''
        const characters = '0123456789'
        const charactersLength = characters.length
        for (let i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        this.formGroup.patchValue({ upc: code })
        this.formGroup.patchValue({ sku: result })
    }

    onIsTrackStockChange() {
        this.isTrackStock = this.formGroup.get('isTrackStock')?.value
    }

    onFileImageSelected(files: FileList | null, input: HTMLInputElement) {
        this.navigationService.loadBarStart()
        if (files && files[0]) {
            new Compressor(files[0], {
                quality: 0.6,
                success: async (result: any) => {
                    input.value = ''
                    const formData = new FormData()
                    formData.append('file', result, result.name)
                    this.ngZone.run(() => {
                        this.productsService.uploadImage(formData, this.productId).subscribe(res => {
                            const { urlImage } = res
                            this.navigationService.showMessage('Imagen actualizada')
                            this.navigationService.loadBarFinish()
                            this.urlImage = urlImage + `?ignoreCache=${Math.random()}`
                        })
                    })
                }
            })
        }
    }

    onExcludedChange() {
        const excluded = this.excluded.indexOf(this.office._id);
        if (excluded >= 0) {
            this.excluded.splice(excluded, 1);
        } else {
            this.excluded.push(this.office._id);
        }
    }

    onCreateCategory() {
        const dialogRef = this.matDialog.open(DialogCreateCategoriesComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(category => {
            if (category) {
                this.isLoading = true
                this.navigationService.loadBarStart()
                this.categoriesService.create(category).subscribe({
                    next: category => {
                        this.isLoading = false
                        this.navigationService.showMessage('Registrado correctamente')
                        this.navigationService.loadBarFinish()
                        this.categoriesService.loadCategories()
                        this.formGroup.patchValue({ categoryId: category._id })
                    }, error: (error: HttpErrorResponse) => {
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage(error.error.message)
                    }
                })
            }
        })
    }

    onDialogCreateAnnotations() {
        const dialogRef = this.matDialog.open(DialogCreateAnnotationsComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(annotation => {
            if (annotation) {
                this.annotations.push(annotation)
            }
        })
    }

    onDialogProducts() {
        const dialogRef = this.matDialog.open(DialogSearchProductsComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(product => {
            if (product) {
                this.products.push(product)
            }
        })
    }

    onRemoveProduct(index: number) {
        this.products.splice(index, 1)
    }

    onRemoveAnnotation(index: number) {
        this.annotations.splice(index, 1)
    }

    onDialogProviders() {
        const dialogRef = this.matDialog.open(DialogSearchProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(provider => {
            if (provider) {
                this.providers.push(provider)
            }
        })
    }

    onRemoveProvider(index: number) {
        this.providers.splice(index, 1)
    }

    onOpenDialogSearchProducts() {
        const dialogRef = this.matDialog.open(DialogSearchProductsComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(product => {
            if (product) {
                this.products.push(product)
            }
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            const product = this.formGroup.value
            const productIds = this.products.map(e => e._id)
            const providerIds = this.providers.map(e => e._id)
            product.annotations = this.annotations
            product.excluded = this.excluded
            product.productIds = productIds
            product.providerIds = [...new Set(providerIds)]
            this.navigationService.loadBarStart()
            this.productsService.updateWithPrices(product, this.formArray.value, this.productId, this.setting.defaultPrice).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.categoriesService.loadCategories()
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
