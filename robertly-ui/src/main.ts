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
export const EXERCISES_PATH = 'exercises';

const routes = [
  {
    path: EXERCISES_PATH,
    pathMatch: 'full',
    loadComponent: () => import('@pages/exercises.page.component').then(x => x.ExercisesPageComponent),
  } as const,
  {
    path: STATS_PATH,
    loadComponent: () => import('@pages/stats.page.component').then(x => x.StatsPageComponent),
  } as const,
  {
    path: LOGS_PATH,
    pathMatch: 'full',
    loadComponent: () => import('@pages/exercise-logs.page.component').then(x => x.ExerciseLogsPageComponent),
  } as const,
] satisfies Routes;

export type RoutePath = (typeof routes)[number]['path'];

export const API_URL = new InjectionToken<string>('API_URL');

bootstrapApplication(AppComponent, {
  providers: [
    TitleCasePipe,
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode() }),
    { provide: API_URL, useValue: environment.apiUrl },

  ],
}).catch(err => console.error(err));
