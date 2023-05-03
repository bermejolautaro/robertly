import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Observable, map } from 'rxjs';

import { mapGroupedToExcerciseRows } from '@helpers/excercise-log.helper';
import { groupExcerciseLogs } from '@helpers/excercise-log.helper';
import { ExcerciseLogApiService } from '@services/excercise-log-api.service';

import { SeriesPerMuscleGroupWeeklyComponent } from '@components/series-per-muscle-group-weekly.component';
import { ExcerciseRow } from '@models/excercise-row.model';
import { IfNullEmptyArrayPipe } from '@pipes/if-null-empty-array.pipe';
import { SeriesPerMuscleGroupMonthlyComponent } from '@components/series-per-muscle-group-monthly.component';

@Component({
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
})
export class StatsPageComponent {
  private readonly excerciseLogApiService = inject(ExcerciseLogApiService);

  public rows$: Observable<ExcerciseRow[]> = this.excerciseLogApiService
    .getExcerciseLogs()
    .pipe(map(x => mapGroupedToExcerciseRows(groupExcerciseLogs(x))));
}
