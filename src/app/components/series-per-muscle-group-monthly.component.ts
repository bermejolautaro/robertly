import { AsyncPipe, KeyValuePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import * as R from 'remeda';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { getSeriesAmountPerMuscleGroupMonthly, groupByMonth } from '@helpers/excercise-log.helper';
import { ExerciseRow } from '@models/excercise-row.model';
import { MUSCLE_GROUPS } from '@models/constants';
import { ParseToMonthPipe } from '@pipes/date.pipe';

@Component({
  selector: 'app-series-per-muscle-group-monthly',
  template: `
    <div class="card border-0 shadow-material-1">
      <div class="card-body">
        <div class="card-title mb-3">
          <h5>Series Per Muscle Group - Monthly</h5>
        </div>
        <div class="mb-3">
          <div ngbDropdown class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>
              {{ selectedWeekDropdownValue() | parseToMonth }}
            </button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem *ngFor="let month of monthsSignal()" (click)="selectedMonthDropdownSignal.set(month)">
                {{ month | parseToMonth }}
              </button>
            </div>
          </div>
        </div>
        <table class="table table-sm m-0 mb-3">
          <thead>
            <tr>
              <td scope="col" class="fw-semibold">Muscle Group</td>
              <td
                class="text-center fw-semibold"
                *ngFor="let name of seriesPerMuscleGroupMonthlySignal()[selectedMonthSignal()!] | keyvalue"
              >
                {{ name.key | titlecase }}
              </td>
              <td class="text-center fw-semibold">Target</td>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let muscleGroup of muscleGroups">
              <td class="fw-semibold">{{ muscleGroup | titlecase }}</td>
              <td class="text-center" *ngFor="let x of seriesPerMuscleGroupMonthlySignal()[selectedMonthSignal()!] | keyvalue">
                {{ x.value[muscleGroup] || 0 }}
              </td>
              <td class="text-center">40</td>
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
  imports: [NgFor, NgIf, TitleCasePipe, KeyValuePipe, AsyncPipe, ParseToMonthPipe, NgbDropdownModule],
})
export class SeriesPerMuscleGroupMonthlyComponent {
  @Input({ required: true }) public set rows(value: ExerciseRow[]) {
    this.rowsSignal.set(value);
  }

  public readonly muscleGroups = MUSCLE_GROUPS;

  public readonly rowsSignal = signal<ExerciseRow[]>([]);
  public readonly daysGroupByMonthSignal = computed(() => R.mapValues(groupByMonth(this.rowsSignal()), x => x.length));
  public readonly seriesPerMuscleGroupMonthlySignal = computed(() => getSeriesAmountPerMuscleGroupMonthly(this.rowsSignal()));
  public readonly monthsSignal = computed(() => R.keys(this.seriesPerMuscleGroupMonthlySignal()));

  public readonly selectedMonthDropdownSignal = signal<string | null>(null);
  public readonly selectedMonthSignal = computed(() => this.selectedMonthDropdownSignal() ?? this.monthsSignal()[0]);
  public readonly selectedWeekDropdownValue = computed(() => this.selectedMonthSignal() ?? 'Month');
  public readonly daysTrainedMessage = computed(() => {
    const daysTrained = this.daysGroupByMonthSignal()[this.selectedMonthSignal()!];
    return `${daysTrained} ${daysTrained === 1 ? 'day' : 'days'} trained this month`;
  });
}
