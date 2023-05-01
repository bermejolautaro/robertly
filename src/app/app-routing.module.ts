import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes = [
  {
    path: 'stats',
    loadComponent: () => import('./pages/stats.page.component').then(x => x.StatsPageComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/excercise-logs.page.component').then(x => x.ExcerciseLogsPageComponent),
  },
] as const satisfies Readonly<Routes>;

type RoutePath = (typeof routes)[number]['path'];

@NgModule({
  imports: [RouterModule.forRoot(routes as unknown as Routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
