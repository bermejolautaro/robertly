import { provideServiceWorker } from '@angular/service-worker';
import { InjectionToken, isDevMode } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TitleCasePipe } from '@angular/common';

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

bootstrapApplication(AppComponent, {
  providers: [
    TitleCasePipe,
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode() }),
    { provide: BACKEND_URL, useValue: 'https://gym-nodejs-excel-bermejolautaro.vercel.app/api' },
    // { provide: BACKEND_URL, useValue: 'http://localhost:3000/api' },
  ],
}).catch(err => console.error(err));
