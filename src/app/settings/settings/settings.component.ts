import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Compressor from 'compressorjs';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { ModuleModel } from '../../navigation/module.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PriceListModel } from '../../products/price-list.model';
import { ProductsService } from '../../products/products.service';
import { DialogEditPriceListsComponent, DialogEditPriceListsData } from '../dialog-edit-price-lists/dialog-edit-price-lists.component';
import { DialogPriceListsComponent } from '../dialog-price-lists/dialog-price-lists.component';
import { SettingsService } from '../settings.service';
import { Params, RouterModule } from '@angular/router';
import { RemissionGuidesService } from '../../remission-guides/remission-guides.service';
import { ToolsService } from '../../tools/tools.service';
import { environment } from '../../../environments/environment';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-settings',
    imports: [MaterialModule, RouterModule, ReactiveFormsModule, CommonModule],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.sass']
})
export class SettingsComponent {

    constructor(
        private readonly authService: AuthService,
        private readonly settingsService: SettingsService,
        private readonly toolsService: ToolsService,
        private readonly productsService: ProductsService,
        private readonly remissionGuidesService: RemissionGuidesService,
        private readonly navigationService: NavigationService,
        private readonly formBuilder: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly ngZone: NgZone,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        activatedModules: this.formBuilder.group(this.authService.getObjectModules()),
        setting: this.formBuilder.group({
            defaultPrice: [null, Validators.required],
            defaultInvoice: 'BOLETA',
            showPrintZone: false,
            closeSession: false,
            password: null,
            isOfficeTurn: false,
            defaultCurrencyCode: 'PEN',
            papelImpresion: 'ticket80mm',
            showChange: false,
            showCost: false,
            printOrder: true,
            showCurrencyCode: false,
            showTotalDiscount: false,
            showTotalDiscountPercent: false,
            showObservationItems: false,
            showSpecialty: false,
            showChargeCommand: false,
            showWorker: false,
            showReferred: false,
            showDeliveryAt: false,
            showEmitionAt: false,
            isBlockChangeBoard: false,
            isBlockPrintCommand: false,
            isBlockEditProducts: false,
            hideIgvTicket: false,
            showQrCode: true,
            showAddressOnTicket: false,
            showQrOnTicket: false,
            showIsRetainer: false,
            showDetraction: false,
            defaultPriceListId: null,
            allowFreePrice: false,
            allowFreeStock: true,
            isOnlyConsuption: false,
            defaultIgvPercent: 18,
            defaultRcPercent: 0,
            allowCredit: false,
            allowCreditLimit: false,
            showSubPrice: false,
            allowBonus: false,
            defaultSearchCustomer: 'RUC',
            marginLeft: 15,
            marginRight: 15,
            descriptionService: '',
            textHeader: '',
            textSale: '',
            textSaleTwo: '',
            isAttentionTicket: false,
            defaultIgvCode: '10',
        }),
        business: this.formBuilder.group({
            usuarioSol: '',
            claveSol: '',
            clientId: '',
            clientSecret: '',
            sunattk: '',
            businessName: ['', Validators.required],
            ruc: ['', Validators.required],
            email: ['', Validators.email],
            businessType: ['', Validators.required]
        }),
        office: this.formBuilder.group({
            name: ['', Validators.required],
            tradeName: ['', Validators.required],
            address: ['', Validators.required],
            mobileNumber: '',
            serialPrefix: ['', Validators.required],
            codigoAnexo: '',
            codigoUbigeo: '',
            departamento: '',
            provincia: '',
            distrito: '',
            urbanizacion: '',
            codigoPais: '',
            isActive: false,
            activityId: null,
        }),
    })
    disableUpdateStock = false
    hide: boolean = true
    certificates: any[] = []
    modules: ModuleModel[] = []
    isLoading: boolean = false
    business: BusinessModel = new BusinessModel()
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()
    localBusiness: BusinessModel | null = null
    priceLists: PriceListModel[] = []
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
        this.modules = this.authService.getModules()

        for (const module of this.modules) {
            this.formGroup.get('activatedModules')?.get(module.name)?.patchValue(module.isActive)
        }

        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.priceLists = priceLists
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.business = auth.business
            this.setting = auth.setting
            this.office = auth.office
            this.formGroup.patchValue({
                setting: auth.setting,
                business: auth.business,
                office: auth.office
            })
            this.fetchData()
        })
    }

    fetchData() {
        this.authService.loadBusiness(this.business._id).subscribe(business => {
            this.localBusiness = business
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
            this.toolsService.updateStock(this.business._id).subscribe(() => {
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
            this.certificates = certificates
        })
    }

    onAddPriceList() {
        this.matDialog.open(DialogPriceListsComponent, { width: '600px', position: { top: '20px' } })
    }

    onDeleteLogo() {
        this.navigationService.loadBarStart()
        this.ngZone.run(() => {
            this.settingsService.updateImage({ logo: '' }).subscribe(() => {
                this.navigationService.showMessage('Logo eliminado correctamente')
                this.navigationService.loadBarFinish()
                this.setting.logo = ""
            })
        })
    }

    onDeleteBanner() {
        this.navigationService.loadBarStart()
        this.ngZone.run(() => {
            this.settingsService.updateImage({ banner: '' }).subscribe(() => {
                this.navigationService.showMessage('Banner eliminado correctamente')
                this.navigationService.loadBarFinish()
                this.setting.banner = ""
            })
        })
    }

    onDeleteTittle() {
        this.navigationService.loadBarStart()
        this.ngZone.run(() => {
            this.settingsService.updateImage({ tittle: '' }).subscribe(() => {
                this.navigationService.showMessage('Titulo eliminado correctamente')
                this.navigationService.loadBarFinish()
                this.setting.header = ""
            })
        })
    }

    onSelectCertificate(certificateId: string) {
        const ok = confirm('Esta seguro de usar este certificado')
        if (ok) {
            this.navigationService.loadBarStart()
            this.settingsService.updateCertificate(certificateId).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Certificado actualizado')
                    this.fetchData()
                    this.onGetCertificates()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onDeleteCertificate(certificateId: string, event: MouseEvent) {
        event.stopPropagation()
        const ok = confirm('Esta seguro de anular?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.settingsService.deleteCertificate(certificateId, this.business._id).subscribe({
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

    async onDownloadCertificate(certificateId: string, event: MouseEvent) {
        event.stopPropagation()
        this.navigationService.loadBarStart()
        const blobCdr = await this.settingsService.getCertificate(certificateId)
        const urlCertificate = window.URL.createObjectURL(blobCdr)
        this.navigationService.loadBarFinish()
        this.downloadFile(urlCertificate, 'certificado.pem')
    }

    onFileSelected(files: FileList | null, input: HTMLInputElement) {
        if (files !== null && files[0] !== null) {
            const file: File = files[0]
            input.value = ''
            new Compressor(file, {
                quality: 0.6,
                success: (result) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(result)
                    reader.onload = () => {
                        this.ngZone.run(() => {
                            this.settingsService.updateImage({ logo: reader.result as string }).subscribe({
                                next: () => {
                                    this.setting.logo = reader.result as string
                                    this.navigationService.showMessage('Logo actualizado')
                                }, error: (error: HttpErrorResponse) => {
                                    this.navigationService.showMessage(error.error.message)
                                }
                            })
                        })
                    }
                    reader.onerror = function (error) {
                        console.log('Error: ', error)
                    }
                }
            })
        }
    }

    onFileBannerSelected(files: FileList | null, input: HTMLInputElement) {
        if (files !== null && files[0] !== null) {
            const file: File = files[0]
            input.value = ''
            new Compressor(file, {
                quality: 0.6,
                success: (result) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(result)
                    reader.onload = () => {
                        this.ngZone.run(() => {
                            this.settingsService.updateImage({ banner: reader.result as string }).subscribe(() => {
                                this.setting.banner = reader.result as string
                                this.navigationService.showMessage('Banner actualizado')
                            }, (error: HttpErrorResponse) => {
                                this.navigationService.showMessage(error.error.message)
                            })
                        })
                    }
                    reader.onerror = function (error) {
                        console.log('Error: ', error)
                    }
                }
            })
        }
    }

    onFileTittleSelected(files: FileList | null, input: HTMLInputElement) {
        if (files !== null && files[0] !== null) {
            const file: File = files[0]
            input.value = ''
            new Compressor(file, {
                quality: 0.6,
                success: (result) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(result)
                    reader.onload = () => {
                        this.ngZone.run(() => {
                            this.settingsService.updateImage({ tittle: reader.result as string }).subscribe({
                                next: () => {
                                    this.setting.header = reader.result as string
                                    this.navigationService.showMessage('Titulo actualizado')
                                }, error: (error: HttpErrorResponse) => {
                                    this.navigationService.showMessage(error.error.message)
                                }
                            })
                        })
                    }
                    reader.onerror = function (error) {
                        console.log('Error: ', error)
                    }
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
                this.settingsService.saveCertificate(formData).subscribe({
                    next: () => {
                        this.navigationService.loadBarFinish()
                        this.onGetCertificates()
                        this.fetchData()
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

    onDeletePriceList(priceListId: string) {
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
            priceListId: priceList._id,
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
            this.isLoading = true
            this.navigationService.loadBarStart()
            const { activatedModules, setting, business, office } = this.formGroup.value
            this.settingsService.save(activatedModules, setting, business, office).subscribe({
                next: () => {
                    this.navigationService.showMessage("Se han guardado los cambios")
                    setTimeout(() => {
                        location.reload()
                    }, 1000)
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                    this.navigationService.loadBarFinish()
                }
            })
        }
    }

}
