import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { UserModel } from '../../users/user.model';
import { CdrRgModel } from '../cdr-rg.model';
import { RemissionGuideItemModel } from '../remission-guide-item.model';
import { RemissionGuideModel } from '../remission-guide.model';
import { RemissionGuidesService } from '../remission-guides.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { CarrierModel } from '../../carriers/carrier.model';

@Component({
    selector: 'app-dialog-detail-remission-guides',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-detail-remission-guides.component.html',
    styleUrls: ['./dialog-detail-remission-guides.component.sass'],
})
export class DialogDetailRemissionGuidesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly remissionGuideId: string,
        private readonly remissionGuidesService: RemissionGuidesService,
        private readonly authService: AuthService,
        private readonly sanitizer: DomSanitizer,
    ) { }

    remissionGuide: RemissionGuideModel | null = null
    remissionGuideItems: RemissionGuideItemModel[] = []
    user: UserModel = new UserModel()
    office: OfficeModel = new OfficeModel()
    business: BusinessModel = new BusinessModel()
    cdr: CdrRgModel | null = null
    carrier: CarrierModel | null = null

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.business = auth.business
            this.office = auth.office
        })

        this.remissionGuidesService.getRemissionGuideById(this.remissionGuideId).subscribe(remissionGuide => {
            const { remissionGuideItems, user, cdr, carrier } = remissionGuide
            this.remissionGuide = remissionGuide
            this.remissionGuideItems = remissionGuideItems
            this.user = user
            this.cdr = cdr
            this.carrier = carrier
        })
    }

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url)
    }
}
