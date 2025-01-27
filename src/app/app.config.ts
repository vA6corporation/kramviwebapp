import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localePe from '@angular/common/locales/es-PE';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { CanActivateTeam } from './auth/can-activate-team';
import { AppInterceptor } from './app.interceptor';
registerLocaleData(localePe, 'es-PE');

export const appConfig: ApplicationConfig = {
    providers: [
        CanActivateTeam,
        { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
        { provide: LOCALE_ID, useValue: 'es-PE' },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(),
        provideHttpClient(
            withInterceptorsFromDi()
        ),
        { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    ]
};
