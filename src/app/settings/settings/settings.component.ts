import { Component, NgZone, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import Compressor from 'compressorjs'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { BusinessModel } from '../../businesses/business.model'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { ModuleModel } from '../../navigation/module.model'
import { NavigationService } from '../../navigation/navigation.service'
import { PriceListModel } from '../../products/price-list.model'
import { ProductsService } from '../../products/products.service'
import { DialogEditPriceListsComponent, DialogEditPriceListsData } from '../dialog-edit-price-lists/dialog-edit-price-lists.component'
import { DialogPriceListsComponent } from '../dialog-price-lists/dialog-price-lists.component'
import { SettingsService } from '../settings.service'
import { Params, RouterModule } from '@angular/router'
import { RemissionGuidesService } from '../../remission-guides/remission-guides.service'
import { ToolsService } from '../../tools/tools.service'
import { environment } from '../../../environments/environment'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-settings',
    imports: [MaterialModule, RouterModule, ReactiveFormsModule, CommonModule],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.sass']
})
export class SettingsComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly matDialog = inject(MatDialog)
    private readonly ngZone = inject(NgZone)
    private readonly authService = inject(AuthService)
    private readonly settingsService = inject(SettingsService)
    private readonly toolsService = inject(ToolsService)
    private readonly productsService = inject(ProductsService)
    private readonly remissionGuidesService = inject(RemissionGuidesService)
    private readonly navigationService = inject(NavigationService)

    formGroup: FormGroup = this.formBuilder.group({
        activeModule: this.formBuilder.group({
            openBox: false,
            turns: false,
            expenses: false,
            posStandard: false,
            posFood: false,
            deliveries: false,
            proformas: false,
            proformar: false,
            boards: false,
            boardsWaiter: false,
            deletedBoards: false,
            credits: false,
            customers: false,
            products: false,
            inventories: false,
            incidents: false,
            reports: false,
            sales: false,
            carriers: false,
            users: false,
            purchases: false,
            purchaseOrders: false,
            providers: false,
            creditNotes: false,
            remissionGuides: false,
            banks: false,
            paymentOrders: false,
            biller: false,
        }),
        setting: this.formBuilder.group({
            defaultInvoice: '03',
            defaultCurrency: 'PEN',
            defaultIgvCode: '10',
            defaultTicket: '80MM',
            defaultSearchCustomer: 'RUC',
            defaultPrice: 'GLOBAL',
            defaultIgvPercent: 18,
            defaultRcPercent: 0,
            defaultPriceListId: null,
            password: '',
            isShowChange: false,
            isShowCost: false,
            isShowPrintZone: false,
            isShowCurrency: false,
            isShowChargeInCommand: false,
            isShowTotalDiscount: false,
            isShowTotalDiscountPercent: false,
            isShowEmitionAt: false,
            isShowRetainer: false,
            isShowDetraction: false,
            isShowCredit: false,
            isShowDeliveryAt: false,
            isShowEditPrice: false,
            isAvailableStock: false,
            isOfficeTurn: false,
            isShowSubPrice: false,
            isShowBonus: false,
            marginLeft: 0,
            marginRight: 0,
            textService: '',
            textHeader: '',
            textBottom: '',
        }),
        business: this.formBuilder.group({
            usuarioSol: '',
            claveSol: '',
            clientId: '',
            clientSecret: '',
            sunattk: '',
            name: ['', Validators.required],
            ruc: ['', Validators.required],
            businessType: ['', Validators.required]
        }),
        office: this.formBuilder.group({
            name: ['', Validators.required],
            tradeName: ['', Validators.required],
            address: ['', Validators.required],
            serialPrefix: ['', Validators.required],
            codigoAnexo: '',
            codigoUbigeo: '',
            departamento: '',
            provincia: '',
            distrito: '',
            urbanizacion: '',
            activityId: null,
        }),
    })
    hide: boolean = true
    disableUpdateStock = false
    $isLoading = signal(false)
    $certificates = signal<any[]>([])
    $modules = signal<ModuleModel[]>([])
    $business = signal<BusinessModel>(new BusinessModel())
    $setting = signal<SettingModel>(new SettingModel())
    $office = signal<OfficeModel>(new OfficeModel())
    $priceLists = signal<PriceListModel[]>([])
    $urlLogo = signal<string>('')
    searchTypes = [
        { code: 'RUC', label: 'RUC' },
        { code: 'DNI', label: 'DNI' },
        { code: 'MOBILE', label: 'CELULAR' },
        { code: 'NAME', label: 'NOMBRES' },
    ]
    baseUrl = environment.baseUrl

    private handlePriceLists$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePriceLists$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Ajustes')

        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.$priceLists.set(priceLists)
        })

        this.$modules.set(this.authService.getModules())

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$business.set(auth.business)
            this.$setting.set(auth.setting)
            this.$office.set(auth.office)
            this.formGroup.patchValue({
                setting: auth.setting,
                business: auth.business,
                office: auth.office,
                activeModule: auth.activeModule,
            })

            this.settingsService.getLogo(auth.setting.uuid).then(blobLogo => {
                this.$urlLogo.set(URL.createObjectURL(blobLogo))
            })
        })
    }

    onExonerateProducts() {
        const ok = confirm('Estas seguro de exonerar todos los productos?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.toolsService.exonerateProducts().subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Se han guardado los cambios')
            })
        }
    }

    onUpdateStock() {
        const ok = confirm('Esta seguro de actualizar el stock?...')
        if (ok) {
            this.disableUpdateStock = true
            this.navigationService.showMessage('El stock se esta actualizando espere porfavor')
            this.navigationService.loadBarStart()
            this.toolsService.updateStock(this.$business().id).subscribe(() => {
                this.navigationService.loadBarFinish()
            })
        }
    }

    onGetTokenSunat() {
        const { business } = this.formGroup.value
        if (business.clientId && business.clientSecret) {
            this.navigationService.loadBarStart()
            const params: Params = {
                clientId: business.clientId,
                clientSecret: business.clientSecret
            }
            this.remissionGuidesService.getSunatToken(params).subscribe({
                next: res => {
                    this.navigationService.loadBarFinish()
                    this.formGroup.patchValue({ business: { sunattk: res.sunattk } })
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        } else {
            this.navigationService.showMessage('Introdusca el ID y clave de la api sunat')
        }
    }

    onGetCertificates() {
        this.settingsService.getCertificates().subscribe(certificates => {
            this.$certificates.set(certificates)
        })
    }

    onAddPriceList() {
        this.matDialog.open(DialogPriceListsComponent, { width: '600px', position: { top: '20px' } })
    }

    onSelectCertificate(certificateId: any) {
        const ok = confirm('Esta seguro de usar este certificado')
        if (ok) {
            this.navigationService.loadBarStart()
            this.settingsService.updateCertificate(certificateId).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Certificado actualizado')
                    setTimeout(() => {
                        location.reload()
                    }, 1000)
                    this.onGetCertificates()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onDeleteCertificate(certificateUuid: any, event: MouseEvent) {
        event.stopPropagation()
        const ok = confirm('Esta seguro de anular?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.settingsService.deleteCertificate(certificateUuid, this.$business().id).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Certificado eliminado')
                    this.onGetCertificates()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    downloadFile(url: string, fileName: string) {
        const link = document.createElement("a")
        link.download = fileName
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    async onDownloadCertificate(certificateUuid: any, event: MouseEvent) {
        event.stopPropagation()
        this.navigationService.loadBarStart()
        const blobCdr = await this.settingsService.getCertificate(certificateUuid)
        const urlCertificate = URL.createObjectURL(blobCdr)
        this.navigationService.loadBarFinish()
        this.downloadFile(urlCertificate, 'certificado.pem')
    }

    onDeleteLogo() {
        this.navigationService.loadBarStart()
        this.ngZone.run(() => {
            this.settingsService.deleteLogo(this.$setting().uuid).subscribe(() => {
                this.navigationService.showMessage('Logo eliminado correctamente')
                this.navigationService.loadBarFinish()
                setTimeout(() => {
                    location.reload()
                }, 1000)
            })
        })
    }

    onFileLogoSelected(files: FileList | null, input: HTMLInputElement) {
        if (files !== null && files[0] !== null) {
            const file: File = files[0]
            input.value = ''
            new Compressor(file, {
                quality: 0.8,
                success: (result) => {
                    const reader = new FileReader()
                    const formData = new FormData()
                    formData.append('file', result, 'file')
                    this.navigationService.loadBarStart()
                    this.settingsService.uploadLogo(formData, this.$setting().uuid).subscribe({
                        next: () => {
                            this.navigationService.loadBarFinish()
                            this.settingsService.getLogo(this.$setting().uuid).then(blobLogo => {
                                this.$urlLogo.set(URL.createObjectURL(blobLogo))
                            })
                        }, error: (error: HttpErrorResponse) => {
                            console.log(error)
                            this.navigationService.showMessage(error.error.message)
                        }
                    })
                }
            })
        }
    }

    onFileCertificateSelected(files: FileList | null, input: HTMLInputElement) {
        if (files !== null && files[0] !== null) {
            const file: File = files[0]
            input.value = ''
            if (file) {
                const formData = new FormData()
                formData.append('file', file, file.name)
                this.navigationService.loadBarStart()
                this.settingsService.uploadCertificate(formData).subscribe({
                    next: () => {
                        this.navigationService.loadBarFinish()
                        this.onGetCertificates()
                        setTimeout(() => {
                            location.reload()
                        }, 1000)
                    }, error: (error: HttpErrorResponse) => {
                        console.log(error)
                        this.navigationService.showMessage(error.error.message)
                    }
                })
            } else {
                this.navigationService.showMessage('No es un certificado .pem')
            }
        }
    }

    onDeletePriceList(priceListId: any) {
        const ok = confirm('Estas seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.settingsService.deletePriceList(priceListId).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se ha eliminado correctamente')
                    this.productsService.loadPriceLists()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onUpdatePriceList(priceList: PriceListModel) {
        const data: DialogEditPriceListsData = {
            priceListId: priceList.id,
            name: priceList.name,
        }

        this.matDialog.open(DialogEditPriceListsComponent, {
            width: '600px',
            position: { top: '20px' },
            data
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.navigationService.loadBarStart()
            const { activeModule, setting, business, office } = this.formGroup.value
            delete business.sunattk
            this.settingsService.save(activeModule, setting, business, office).subscribe({
                next: () => {
                    this.navigationService.showMessage("Se han guardado los cambios")
                    setTimeout(() => {
                        location.reload()
                    }, 1000)
                }, error: (error: HttpErrorResponse) => {
                    this.$isLoading.set(false)
                    this.navigationService.showMessage(error.error.message)
                    this.navigationService.loadBarFinish()
                }
            })
        }
    }

}
