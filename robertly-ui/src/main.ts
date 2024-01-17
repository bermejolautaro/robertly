import ***REMOVED*** provideServiceWorker ***REMOVED*** from '@angular/service-worker';
import ***REMOVED*** InjectionToken, isDevMode ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, provideRouter ***REMOVED*** from '@angular/router';
import ***REMOVED*** provideHttpClient ***REMOVED*** from '@angular/common/http';
import ***REMOVED*** bootstrapApplication ***REMOVED*** from '@angular/platform-browser';
import ***REMOVED*** AppComponent ***REMOVED*** from 'src/app/app.component';
import ***REMOVED*** provideAnimationsAsync ***REMOVED*** from '@angular/platform-browser/animations/async';
import ***REMOVED*** TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** environment ***REMOVED*** from './environments/environment';

export const LOGS_PATH = '';
export const STATS_PATH = 'stats';

const routes = [
  ***REMOVED***
    path: STATS_PATH,
    loadComponent: () => import('@pages/stats.page.component').then(x => x.StatsPageComponent),
***REMOVED*** as const,
  ***REMOVED***
    path: LOGS_PATH,
    pathMatch: 'full',
    loadComponent: () => import('@pages/excercise-logs.page.component').then(x => x.ExcerciseLogsPageComponent),
***REMOVED*** as const,
] satisfies Routes;

export type RoutePath = (typeof routes)[number]['path'];

export const BACKEND_URL = new InjectionToken<string>('BACKEND_URL');

bootstrapApplication(AppComponent, ***REMOVED***
  providers: [
    TitleCasePipe,
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', ***REMOVED*** enabled: !isDevMode() ***REMOVED***),
    ***REMOVED*** provide: BACKEND_URL, useValue: environment.apiUrl ***REMOVED***,
  ],
***REMOVED***).catch(err => console.error(err));