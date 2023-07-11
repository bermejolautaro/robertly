import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Observable, map, shareReplay } from 'rxjs';

import { mapGroupedToExcerciseRows, amountDaysTrained } from '@helpers/excercise-log.helper';
import { groupExcerciseLogs } from '@helpers/excercise-log.helper';
import { ExcerciseLogApiService } from '@services/excercise-log-api.service';

import { SeriesPerMuscleGroupWeeklyComponent } from '@components/series-per-muscle-group-weekly.component';
import { ExcerciseRow } from '@models/excercise-row.model';
import { SeriesPerMuscleGroupMonthlyComponent } from '@components/series-per-muscle-group-monthly.component';
import { ExcerciseLog } from '@models/excercise-log.model';

@Component({
  selector: 'app-stats-page',
  template: `
    <div class="container my-4" *ngIf="rows$ | async as rows; else loadingSpinner">
      <app-series-per-muscle-group-weekly class="mb-4" [rows]="rows"></app-series-per-muscle-group-weekly>
      <app-series-per-muscle-group-monthly class="mb-4" [rows]="rows"></app-series-per-muscle-group-monthly>
      <div class="card border-0 shadow-material-1">
        <div class="card-body">
          <div class="card-title mb-3">
            <h5>Miscellaneous</h5>
            <table class="table table-sm m-0 mb-3">
              <tbody>
                <tr>
                  <td>Days trained</td>
                  <td *ngIf="logs$ | async as logs">{{ amountDaysTrained(logs) }} days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingSpinner>
      <div class="position-absolute top-50 start-50 translate-middle">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </ng-template>
  `,
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, AsyncPipe, SeriesPerMuscleGroupWeeklyComponent, SeriesPerMuscleGroupMonthlyComponent],
})
export class StatsPageComponent {
  private readonly excerciseLogApiService = inject(ExcerciseLogApiService);

  public amountDaysTrained = amountDaysTrained;

  public logs$: Observable<ExcerciseLog[]> = this.excerciseLogApiService.getExcerciseLogs().pipe(shareReplay(1));

  public rows$: Observable<ExcerciseRow[]> = this.logs$.pipe(map(x => mapGroupedToExcerciseRows(groupExcerciseLogs(x))));
}
