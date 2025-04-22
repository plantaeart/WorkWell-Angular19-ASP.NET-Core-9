import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { WwThemeColor } from './ww-themeColor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    providePrimeNG({ theme: { preset: WwThemeColor } }),
  ],
};
