import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component'
import { ProviderModel } from '../../providers/provider.model'
import { CreateIncidentItemModel } from '../create-incident-item.model'
import { CreateIncidentModel } from '../create-incident.model'
import { IncidentItemsComponent } from '../incident-items/incident-items.component'
import { IncidentsService } from '../incidents.service'

@Component({
    selector: 'app-charge-out-incidents',
    imports: [MaterialModule, ReactiveFormsModule, IncidentItemsComponent],
    templateUrl: './charge-out-incidents.component.html',
    styleUrl: './charge-out-incidents.component.sass'
})
export class ChargeOutIncidentsComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly navigationService = inject(NavigationService)
    private readonly incidentsService = inject(IncidentsService)
    private readonly router = inject(Router)

    formGroup: FormGroup = this.formBuilder.group({
        observation: '',
    })
    incidentItems: CreateIncidentItemModel[] = []
    $isLoading = signal<boolean>(false)

    private handleIncidentItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleIncidentItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Reducir stock')

        this.handleIncidentItems$ = this.incidentsService.handleIncidentItems().subscribe(incidentItems => {
            this.incidentItems = incidentItems
        })
    }

    onSubmit() {
        try {
            this.$isLoading.set(true)
            this.navigationService.loadBarStart()
            const formData = this.formGroup.value

            const incident: CreateIncidentModel = {
                observation: formData.observation || '',
            }

            if (this.incidentItems.length === 0) {
                throw new Error('Agrega un producto')
            }

            this.incidentsService.createOut(incident, this.incidentItems).subscribe({
                next: () => {
                    this.incidentsService.setIncidentItems([])
                    this.router.navigate(['/incidents'])
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                }
            })
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
            this.$isLoading.set(false)
            this.navigationService.loadBarFinish()
        }
    }

}
