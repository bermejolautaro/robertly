import ***REMOVED*** provideServiceWorker ***REMOVED*** from '@angular/service-worker';
import ***REMOVED*** InjectionToken, isDevMode ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, provideRouter ***REMOVED*** from '@angular/router';
import ***REMOVED*** provideHttpClient ***REMOVED*** from '@angular/common/http';
import ***REMOVED*** bootstrapApplication ***REMOVED*** from '@angular/platform-browser';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';

import ***REMOVED*** AppComponent ***REMOVED*** from 'src/app/app.component';

dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

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
] satisfies Routes

export type RoutePath = (typeof routes)[number]['path'];

export const BACKEND_URL = new InjectionToken<string>('BACKEND_URL');

bootstrapApplication(AppComponent, ***REMOVED***
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js'),
    ***REMOVED*** provide: BACKEND_URL, useValue: 'https://gym-nodejs-excel-bermejolautaro.vercel.app/api' ***REMOVED***,
  ],
***REMOVED***).catch(console.error);
