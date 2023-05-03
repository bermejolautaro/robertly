import ***REMOVED*** AsyncPipe, NgIf ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, inject ***REMOVED*** from '@angular/core';

import ***REMOVED*** Observable, map ***REMOVED*** from 'rxjs';

import ***REMOVED*** mapGroupedToExcerciseRows ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** groupExcerciseLogs ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** ExcerciseLogApiService ***REMOVED*** from '@services/excercise-log-api.service';

import ***REMOVED*** SeriesPerMuscleGroupWeeklyComponent ***REMOVED*** from '@components/series-per-muscle-group-weekly.component';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** SeriesPerMuscleGroupMonthlyComponent ***REMOVED*** from '@components/series-per-muscle-group-monthly.component';

@Component(***REMOVED***
  selector: 'app-stats-page',
  template: `
    <div class="min-vh-100 d-flex flex-column justify-content-center">
      <div class="container my-4" *ngIf="rows$ | async as rows; else loadingSpinner">
        <app-series-per-muscle-group-weekly class="mb-4" [rows]="rows"></app-series-per-muscle-group-weekly>
        <app-series-per-muscle-group-monthly class="mb-4" [rows]="rows"></app-series-per-muscle-group-monthly>
      </div>

      <ng-template #loadingSpinner>
        <div class="d-flex justify-content-center align-items-center p-3 align-self-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [``],
  standalone: true,
  imports: [NgIf, AsyncPipe, SeriesPerMuscleGroupWeeklyComponent, SeriesPerMuscleGroupMonthlyComponent],
***REMOVED***)
export class StatsPageComponent ***REMOVED***
  private readonly excerciseLogApiService = inject(ExcerciseLogApiService);

  public rows$: Observable<ExcerciseRow[]> = this.excerciseLogApiService
    .getExcerciseLogs()
    .pipe(map(x => mapGroupedToExcerciseRows(groupExcerciseLogs(x))));
***REMOVED***
