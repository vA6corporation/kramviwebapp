import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component';
import { ProviderModel } from '../../providers/provider.model';
import { CreateIncidentItemModel } from '../create-incident-item.model';
import { CreateIncidentModel } from '../create-incident.model';
import { IncidentsService } from '../incidents.service';
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component';

interface FormData {
    incidentType: any,
    observations: string,
}

@Component({
    selector: 'app-charge-incidents',
    templateUrl: './charge-incidents.component.html',
    styleUrls: ['./charge-incidents.component.sass']
})
export class ChargeIncidentsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly incidentsService: IncidentsService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        incidentType: ['', Validators.required],
        observations: '',
    } as FormData)
    incidentItems: CreateIncidentItemModel[] = []
    charge: number = 0
    provider: ProviderModel | null = null
    isLoading: boolean = false
    incidentTypes = [
        'DIVISION',
        'VENCIMIENTO',
        'DESTRUCCION',
        'EXTRAVIO',
        'DEVOLUCION',
        'CONSUMO',
        'OTROS',
    ]

    private handleClickMenu$: Subscription = new Subscription()
    private handlePurchaseItems$: Subscription = new Subscription()
    private handleProvider$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handlePurchaseItems$.unsubscribe()
        this.handleProvider$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Retirar')

        this.navigationService.setMenu([
            { id: 'add_provider', label: 'Agregar proveedor', icon: 'person_add', show: true },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_provider':
                    this.matDialog.open(DialogSearchProvidersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })
                    break
                default:
                    break
            }
        })

        this.handlePurchaseItems$ = this.incidentsService.handleIncidentItems().subscribe(incidentItems => {
            this.incidentItems = incidentItems
            this.charge = 0
            for (const purchaseItem of this.incidentItems) {
                if (purchaseItem.igvCode !== '11') {
                    this.charge += purchaseItem.cost * purchaseItem.quantity
                }
            }
        })
    }

    onSubmit() {
        try {
            if (this.formGroup.valid === false) {
                throw new Error("Complete los campos")
            }
            this.isLoading = true
            this.navigationService.loadBarStart()
            const formData: FormData = this.formGroup.value
            const incident: CreateIncidentModel = {
                incidentType: formData.incidentType,
                observations: formData.observations || '',
            }

            if (this.incidentItems.length === 0) {
                throw new Error('Agrega un producto')
            }

            this.incidentsService.create(incident, this.incidentItems).subscribe({
                next: () => {
                    this.incidentsService.setIncidentItems([])
                    this.router.navigate(['/incidents'])
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

    onEditProvider() {
        this.matDialog.open(DialogEditProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.provider,
        })
    }

}
