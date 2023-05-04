import { provideServiceWorker } from '@angular/service-worker';
import { InjectionToken, isDevMode } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';

import { AppComponent } from 'src/app/app.component';

dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export const LOGS_PATH = '';
export const STATS_PATH = 'stats';

const routes = [
  {
    path: STATS_PATH,
    loadComponent: () => import('@pages/stats.page.component').then(x => x.StatsPageComponent),
  },
  {
    path: LOGS_PATH,
    pathMatch: 'full',
    loadComponent: () => import('@pages/excercise-logs.page.component').then(x => x.ExcerciseLogsPageComponent),
  },
] as const satisfies Readonly<Routes>;

type RoutePath = (typeof routes)[number]['path'];

export const BACKEND_URL = new InjectionToken<string>('BACKEND_URL');

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes as unknown as Routes),
    provideServiceWorker('ngsw-worker.js'),
    { provide: BACKEND_URL, useValue: 'https://gym-nodejs-excel-bermejolautaro.vercel.app/api' },
  ],
}).catch(console.error);
