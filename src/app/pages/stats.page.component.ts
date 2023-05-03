import ***REMOVED*** AsyncPipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, inject ***REMOVED*** from '@angular/core';

import ***REMOVED*** Observable, map ***REMOVED*** from 'rxjs';

import ***REMOVED*** mapGroupedToExcerciseRows ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** groupExcerciseLogs ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** ExcerciseLogApiService ***REMOVED*** from '@services/excercise-log-api.service';

import ***REMOVED*** SeriesPerMuscleGroupWeeklyComponent ***REMOVED*** from '@components/series-per-muscle-group-weekly.component';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** IfNullEmptyArrayPipe ***REMOVED*** from '@pipes/if-null-empty-array.pipe';
import ***REMOVED*** SeriesPerMuscleGroupMonthlyComponent ***REMOVED*** from '@components/series-per-muscle-group-monthly.component';

@Component(***REMOVED***
  selector: 'app-stats-page',
  template: `
    <div class="container my-4">
      <app-series-per-muscle-group-weekly class="mb-4" [rows]="rows$ | async | ifNullEmptyArray"></app-series-per-muscle-group-weekly>
      <app-series-per-muscle-group-monthly class="mb-4" [rows]="rows$ | async | ifNullEmptyArray"></app-series-per-muscle-group-monthly>
    </div>
  `,
  styles: [``],
  standalone: true,
  imports: [AsyncPipe, IfNullEmptyArrayPipe, SeriesPerMuscleGroupWeeklyComponent, SeriesPerMuscleGroupMonthlyComponent],
***REMOVED***)
export class StatsPageComponent ***REMOVED***
  private readonly excerciseLogApiService = inject(ExcerciseLogApiService);

  public rows$: Observable<ExcerciseRow[]> = this.excerciseLogApiService
    .getExcerciseLogs()
    .pipe(map(x => mapGroupedToExcerciseRows(groupExcerciseLogs(x))));
***REMOVED***
