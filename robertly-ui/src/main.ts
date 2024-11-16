import { provideServiceWorker } from '@angular/service-worker';
import { InjectionToken, isDevMode, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JsonPipe, TitleCasePipe } from '@angular/common';
import { environment } from './environments/environment';
import { jwtInterceptor } from './app/interceptors/jwt.interceptor';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/es-mx';

export const Paths = {
  HOME: 'home',
  LOGS: 'logs',
  LOGS_EDIT: 'edit',
  LOGS_CREATE: 'create',
  LOGS_ID_PARAM: 'id',
  STATS: 'stats',
  EXERCISES: 'exercises',
  SIGN_IN: 'signin',
  SIGN_UP: 'signup',
  DEVELOPER: 'developer',
  FOODS: 'foods',
} as const;

const routes = [
  {
    path: Paths.EXERCISES,
    loadComponent: () => import('@pages/exercises.page.component').then(x => x.ExercisesPageComponent),
  } as const,
  {
    path: Paths.STATS,
    loadComponent: () => import('@pages/stats.page.component').then(x => x.StatsPageComponent),
  } as const,
  {
    path: Paths.SIGN_IN,
    loadComponent: () => import('@pages/signin.page.component').then(x => x.SignInComponent),
  } as const,
  {
    path: Paths.HOME,
    pathMatch: 'full',
    loadComponent: () => import('@pages/home.page.component').then(x => x.HomePageComponent),
  } as const,
  {
    path: Paths.LOGS,
    pathMatch: 'full',
    loadComponent: () => import('@pages/exercise-logs.page.component').then(x => x.ExerciseLogsPageComponent),
  } as const,
  {
    path: `${Paths.LOGS}/${Paths.LOGS_EDIT}/:${Paths.LOGS_ID_PARAM}`,
    pathMatch: 'full',
    loadComponent: () => import('@pages/edit-exercise-log.page.component').then(x => x.EditExerciseLogPageComponent),
  } as const,
  {
    path: `${Paths.LOGS}/${Paths.LOGS_CREATE}`,
    pathMatch: 'full',
    loadComponent: () => import('@pages/edit-exercise-log.page.component').then(x => x.EditExerciseLogPageComponent),
  } as const,
  {
    path: Paths.DEVELOPER,
    pathMatch: 'full',
    loadComponent: () => import('@pages/developer.page.component').then(x => x.DeveloperPageComponent),
  } as const,
  {
    path: Paths.FOODS,
    pathMatch: 'full',
    loadComponent: () => import('@pages/foods.page.component').then(x => x.FoodsPageComponent),
  } as const,
  {
    path: '',
    pathMatch: 'full',
    redirectTo: Paths.HOME,
  } as const,
] satisfies Routes;

export type RoutePath = (typeof routes)[number]['path'];

export const API_URL = new InjectionToken<string>('API_URL');

export const DAY_JS = new InjectionToken<dayjs.Dayjs>('DAY_JS');

bootstrapApplication(AppComponent, {
  providers: [
    TitleCasePipe,
    JsonPipe,
    provideExperimentalZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode() }),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'gymtracker-b0b72',
        appId: '1:1063566206093:web:a3154a1ae143b91f05eec4',
        storageBucket: 'gymtracker-b0b72.appspot.com',
        apiKey: 'AIzaSyCA0ExS-7mRUULdk7CYFORL5zwYXd4lJ-E',
        authDomain: 'auth.robertly.ar',
        messagingSenderId: '1063566206093',
      })
    ),
    provideAuth(() => getAuth()),
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: DAY_JS, useFactory: () => {
      const dayjsInstance = dayjs;
      dayjsInstance.extend(customParseFormat);
      dayjsInstance.extend(weekOfYear);
      dayjsInstance.extend(isoWeek);
      dayjsInstance.locale('es-mx');

      return dayjsInstance;
    }}
  ],
}).catch((err: unknown) => console.error(err));
