import { KeyValuePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import * as R from 'remeda';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { getSeriesAmountPerMuscleGroupWeekly, groupByWeek } from '@helpers/excercise-log.helper';
import { ExcerciseRow } from '@models/excercise-row.model';
import { MUSCLE_GROUPS } from '@models/constants';

@Component({
  selector: 'app-series-per-muscle-group-weekly',
  template: `
    <div class="card border-0 shadow-material-1">
      <div class="card-body">
        <div class="card-title mb-3">
          <h5>Series Per Muscle Group - Weekly</h5>
        </div>
        <div class="mb-3">
          <div ngbDropdown class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>{{ selectedWeekDropdownValue() }}</button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem *ngFor="let week of weeksSignal()" (click)="selectedWeekDropdownSignal.set(week)">
                {{ week }}
              </button>
            </div>
          </div>
        </div>
        <table class="table table-sm m-0 mb-3">
          <thead>
            <tr>
              <td scope="col" class="fw-semibold">Muscle Group</td>
              <td class="text-center fw-semibold" *ngFor="let name of seriesPerMuscleGroupWeeklySignal()[selectedWeekSignal()] | keyvalue">
                {{ name.key | titlecase }}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let muscleGroup of muscleGroups">
              <td class="fw-semibold">{{ muscleGroup | titlecase }}</td>
              <td class="text-center" *ngFor="let x of seriesPerMuscleGroupWeeklySignal()[selectedWeekSignal()] | keyvalue">
                {{ x.value[muscleGroup] || 0 }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="fw-semibold">
          {{ daysTrainedMessage() }}
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgIf, TitleCasePipe, KeyValuePipe, NgbDropdownModule],
})
export class SeriesPerMuscleGroupWeeklyComponent {
  @Input({ required: true }) public set rows(value: ExcerciseRow[]) {
    this.rowsSignal.set(value);
  }

  public readonly muscleGroups = MUSCLE_GROUPS;

  public readonly rowsSignal = signal<ExcerciseRow[]>([]);
  public readonly daysGroupByWeekSignal = computed(() => R.mapValues(groupByWeek(this.rowsSignal()), x => x.length));
  public readonly seriesPerMuscleGroupWeeklySignal = computed(() => getSeriesAmountPerMuscleGroupWeekly(this.rowsSignal()));
  public readonly weeksSignal = computed(() => R.keys(this.seriesPerMuscleGroupWeeklySignal()));
  public readonly selectedWeekDropdownSignal = signal<string | null>(null);
  public readonly selectedWeekSignal = computed(() => this.selectedWeekDropdownSignal() ?? this.weeksSignal()[0]);
  public readonly selectedWeekDropdownValue = computed(() => this.selectedWeekSignal() ?? 'Week');

  public readonly daysTrainedMessage = computed(() => {
    const daysTrained = this.daysGroupByWeekSignal()[this.selectedWeekSignal()];
    return `${daysTrained} ${daysTrained === 1 ? 'day' : 'days'} trained this week`;
  });
}
