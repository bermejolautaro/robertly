import { provideServiceWorker } from '@angular/service-worker';
import { InjectionToken, isDevMode, importProvidersFrom } from '@angular/core';
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

export const Paths = {
  LOGS: '',
  STATS: 'stats',
  EXERCISES: 'exercises',
  SIGN_IN: 'signin',
  SIGN_UP: 'signup',
  DEVELOPER: 'developer',
  FOODS: 'foods'
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
    path: Paths.LOGS,
    pathMatch: 'full',
    loadComponent: () => import('@pages/exercise-logs.page.component').then(x => x.ExerciseLogsPageComponent),
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
] satisfies Routes;

export type RoutePath = (typeof routes)[number]['path'];

export const API_URL = new InjectionToken<string>('API_URL');

bootstrapApplication(AppComponent, {
  providers: [
    TitleCasePipe,
    JsonPipe,
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode() }),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'gymtracker-b0b72',
          appId: '1:1063566206093:web:a3154a1ae143b91f05eec4',
          storageBucket: 'gymtracker-b0b72.appspot.com',
          apiKey: 'AIzaSyCA0ExS-7mRUULdk7CYFORL5zwYXd4lJ-E',
          authDomain: 'auth.robertly.ar',
          messagingSenderId: '1063566206093',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    { provide: API_URL, useValue: environment.apiUrl },
  ],
}).catch(err => console.error(err));
