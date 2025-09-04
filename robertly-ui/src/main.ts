import { provideServiceWorker } from '@angular/service-worker';
import {
  ErrorHandler,
  InjectionToken,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { Routes, provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { JsonPipe, TitleCasePipe } from '@angular/common';
import { environment } from './environments/environment';
import { httpErrorResponseInterceptor } from './app/interceptors/httpErrorResponse.interceptor';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/es-mx';
import { LogLevel, setLogLevel } from '@angular/fire';

export const Paths = {
  EDIT: 'edit',
  CREATE: 'create',
  ID: 'id',
  HOME: 'home',
  EXERCISE_LOGS: 'exercise-logs',
  FOOD_LOGS: 'food-logs',
  STATS: 'stats',
  EXERCISES: 'exercises',
  SIGN_IN: 'signin',
  SIGN_UP: 'signup',
  FOODS: 'foods',
  SERIES_PER_MUSCLE: 'series-per-muscle',
  MACROS: 'macros',
  DAYS_TRAINED: 'days-trained',
  CONFIGURATION: 'configuration',
} as const;

const routes = [
  {
    path: Paths.EXERCISES,
    loadComponent: () => import('@pages/exercises.page.component').then(x => x.ExercisesPageComponent),
  } as const,
  {
    path: `${Paths.EXERCISES}/${Paths.EDIT}/:${Paths.ID}`,
    loadComponent: () => import('@pages/edit-exercise.page.component').then(x => x.EditExercisePageComponent),
  } as const,
  {
    path: `${Paths.EXERCISES}/${Paths.CREATE}`,
    loadComponent: () => import('@pages/edit-exercise.page.component').then(x => x.EditExercisePageComponent),
  } as const,
  {
    path: Paths.EXERCISES,
    loadComponent: () => import('@pages/exercises.page.component').then(x => x.ExercisesPageComponent),
  } as const,
  {
    path: Paths.STATS,
    loadComponent: () => import('@pages/stats.page.component').then(x => x.StatsPageComponent),
    loadChildren: () => {
      return [
        {
          path: `${Paths.SERIES_PER_MUSCLE}`,
          loadComponent: () =>
            import('@pages/series-per-muscle.page.component').then(x => x.SeriesPerMusclePageComponent),
        },
        {
          path: `${Paths.MACROS}`,
          loadComponent: () => import('@pages/macros-daily.page.component').then(x => x.SeriesPerMusclePageComponent),
        },
        {
          path: `${Paths.DAYS_TRAINED}`,
          loadComponent: () => import('@pages/days-trained.page.component').then(x => x.DaysTrainedPageComponent),
        },
      ];
    },
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
    path: Paths.EXERCISE_LOGS,
    pathMatch: 'full',
    loadComponent: () => import('@pages/exercise-logs.page.component').then(x => x.ExerciseLogsPageComponent),
  } as const,
  {
    path: `${Paths.EXERCISE_LOGS}/${Paths.EDIT}/:${Paths.ID}`,
    pathMatch: 'full',
    loadComponent: () => import('@pages/edit-exercise-log.page.component').then(x => x.EditExerciseLogPageComponent),
  } as const,
  {
    path: `${Paths.EXERCISE_LOGS}/${Paths.CREATE}`,
    pathMatch: 'full',
    loadComponent: () => import('@pages/edit-exercise-log.page.component').then(x => x.EditExerciseLogPageComponent),
  } as const,
  {
    path: Paths.FOOD_LOGS,
    pathMatch: 'full',
    loadComponent: () => import('@pages/food-logs.page.component').then(x => x.FoodsPageComponent),
  } as const,
  {
    path: `${Paths.FOOD_LOGS}/${Paths.EDIT}/:${Paths.ID}`,
    pathMatch: 'full',
    loadComponent: () => import('@pages/edit-food-log.page.component').then(x => x.EditFoodLogPageComponent),
  } as const,
  {
    path: `${Paths.FOOD_LOGS}/${Paths.CREATE}`,
    pathMatch: 'full',
    loadComponent: () => import('@pages/edit-food-log.page.component').then(x => x.EditFoodLogPageComponent),
  } as const,
  {
    path: Paths.FOODS,
    pathMatch: 'full',
    loadComponent: () => import('@pages/foods.page.component').then(x => x.FoodsPageComponent),
  } as const,
  {
    path: `${Paths.FOODS}/${Paths.EDIT}/:${Paths.ID}`,
    pathMatch: 'full',
    loadComponent: () => import('@pages/edit-food.page.component').then(x => x.EditFoodPageComponent),
  } as const,
  {
    path: `${Paths.FOODS}/${Paths.CREATE}`,
    pathMatch: 'full',
    loadComponent: () => import('@pages/edit-food.page.component').then(x => x.EditFoodPageComponent),
  } as const,
  {
    path: `${Paths.CONFIGURATION}`,
    pathMatch: 'full',
    loadComponent: () => import('@pages/configuration.page.component').then(x => x.ConfigurationPageComponent),
  } as const,
  {
    path: '',
    pathMatch: 'full',
    redirectTo: Paths.HOME,
  } as const,
  {
    path: '**',
    redirectTo: 'home',
  },
] satisfies Routes;

export type RoutePath = (typeof routes)[number]['path'];

export const API_URL = new InjectionToken<string>('API_URL');
export const DAY_JS = new InjectionToken<typeof dayjs>('DAY_JS');
export const AUTH_CHECKS_ENABLED = new InjectionToken<boolean>('AUTH_CHECKS_ENABLED');

export class CustomErrorHandler extends ErrorHandler {
  public override handleError(error: unknown): void {
    super.handleError(error);
    alert(error);
  }
}

if (isDevMode()) {
  setLogLevel(LogLevel.VERBOSE);
}

bootstrapApplication(AppComponent, {
  providers: [
    TitleCasePipe,
    JsonPipe,
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([httpErrorResponseInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode() }),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'gymtracker-b0b72',
        appId: '1:1063566206093:web:a3154a1ae143b91f05eec4',
        storageBucket: 'gymtracker-b0b72.appspot.com',
        apiKey: 'AIzaSyCA0ExS-7mRUULdk7CYFORL5zwYXd4lJ-E',
        authDomain: 'gymtracker-b0b72.firebaseapp.com',
        messagingSenderId: '1063566206093',
      })
    ),
    provideAuth(() => getAuth()),
    { provide: API_URL, useValue: environment.apiUrl },
    { provide: AUTH_CHECKS_ENABLED, useValue: environment.authChecksEnabled },
    {
      provide: DAY_JS,
      useFactory: () => {
        const dayjsInstance = dayjs;
        dayjsInstance.extend(customParseFormat);
        dayjsInstance.extend(weekOfYear);
        dayjsInstance.extend(isoWeek);
        dayjsInstance.locale('es-mx');

        return dayjsInstance;
      },
    },
    { provide: ErrorHandler, useClass: CustomErrorHandler },
  ],
}).catch((err: unknown) => console.error(err));
