import { provideServiceWorker } from '@angular/service-worker';
import { InjectionToken, isDevMode } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TitleCasePipe } from '@angular/common';
import { environment } from './environments/environment';

export const LOGS_PATH = '';
export const STATS_PATH = 'stats';

const routes = [
  {
    path: STATS_PATH,
    loadComponent: () => import('@pages/stats.page.component').then(x => x.StatsPageComponent),
  } as const,
  {
    path: LOGS_PATH,
    pathMatch: 'full',
    loadComponent: () => import('@pages/excercise-logs.page.component').then(x => x.ExcerciseLogsPageComponent),
  } as const,
] satisfies Routes;

export type RoutePath = (typeof routes)[number]['path'];

export const BACKEND_URL = new InjectionToken<string>('BACKEND_URL');
export const NET_API_URL = new InjectionToken<string>('NET_API_URL');

bootstrapApplication(AppComponent, {
  providers: [
    TitleCasePipe,
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode() }),
    { provide: BACKEND_URL, useValue: environment.apiUrl },
    { provide: NET_API_URL, useValue: environment.netApiUrl },

  ],
}).catch(err => console.error(err));
