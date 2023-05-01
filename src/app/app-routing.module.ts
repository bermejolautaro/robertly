import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** RouterModule, Routes ***REMOVED*** from '@angular/router';

const routes = [
  ***REMOVED***
    path: 'stats',
    loadComponent: () => import('./pages/stats.page.component').then(x => x.StatsPageComponent),
***REMOVED***
  ***REMOVED***
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/excercise-logs.page.component').then(x => x.ExcerciseLogsPageComponent),
***REMOVED***
] as const satisfies Readonly<Routes>;

type RoutePath = (typeof routes)[number]['path'];

@NgModule(***REMOVED***
  imports: [RouterModule.forRoot(routes as unknown as Routes)],
  exports: [RouterModule],
***REMOVED***)
export class AppRoutingModule ***REMOVED******REMOVED***
