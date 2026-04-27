import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID, provideZonelessChangeDetection } from '@angular/core'
import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { registerLocaleData } from '@angular/common'
import localePe from '@angular/common/locales/es-PE'
import { CanActivateTeam } from './auth/can-activate-team'
registerLocaleData(localePe, 'es-PE')

export const appConfig: ApplicationConfig = {
    providers: [
        CanActivateTeam,
        { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
        { provide: LOCALE_ID, useValue: 'es-PE' },
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideHttpClient(),
    ]
}
