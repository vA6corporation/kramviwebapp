import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { BusinessModel } from '../../businesses/business.model'
import { OfficeModel } from '../../offices/office.model'
import { UserModel } from '../../users/user.model'
import { CdrRgModel } from '../cdr-rg.model'
import { RemissionGuideItemModel } from '../remission-guide-item.model'
import { RemissionGuideModel } from '../remission-guide.model'
import { RemissionGuidesService } from '../remission-guides.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { CarrierModel } from '../../carriers/carrier.model'

@Component({
    selector: 'app-dialog-detail-remission-guides',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-detail-remission-guides.component.html',
    styleUrls: ['./dialog-detail-remission-guides.component.sass'],
})
export class DialogDetailRemissionGuidesComponent {

    private readonly remissionGuideId: any = inject(MAT_DIALOG_DATA)
    private readonly remissionGuidesService = inject(RemissionGuidesService)
    private readonly authService = inject(AuthService)
    private readonly sanitizer = inject(DomSanitizer)

    $remissionGuide = signal<RemissionGuideModel | null>(null)
    $remissionGuideItems = signal<RemissionGuideItemModel[]>([])
    $user = signal<UserModel>(new UserModel())
    $office = signal<OfficeModel>(new OfficeModel())
    $carrier = signal<CarrierModel | null>(null)
    $cdr = signal<CdrRgModel | null>(null)

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$office.set(auth.office)
        })

        this.remissionGuidesService.getRemissionGuideById(this.remissionGuideId).subscribe(remissionGuide => {
            const { remissionGuideItems, user, cdr, carrier } = remissionGuide
            this.$remissionGuide.set(remissionGuide)
            this.$remissionGuideItems.set(remissionGuideItems)
            this.$user.set(user)
            this.$cdr.set(cdr)
            this.$carrier.set(carrier)
        })
    }

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url)
    }
}
