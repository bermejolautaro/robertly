import { KeyValuePipe, NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';

import * as R from 'remeda';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { getSeriesAmountPerUserPerMuscleGroupPerMonth, groupByMonth } from '@helpers/excercise-log.helper';
import { ExerciseRow } from '@models/excercise-row.model';
import { ParseToMonthPipe } from '@pipes/parse-to-month.pipe';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExerciseLogService } from '@services/excercise-log.service';

type State = {
  rows: ExerciseRow[];
  selectedMonth: string;
};

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
              {{ selectedMonthLabel() | parseToMonth }}
            </button>
            <div ngbDropdownMenu class="w-100">
              @for (month of months(); track $index) {
                <button ngbDropdownItem [ngClass]="{ active: month === selectedMonth()}" (click)="selectedMonth$.next(month)">
                  {{ month | parseToMonth }}
                </button>
              }
            </div>
          </div>
        </div>
        <table class="table table-sm m-0 mb-3">
          <thead>
            <tr>
              <td scope="col" class="fw-semibold">Muscle Group</td>
              @if (selectedMonth(); as selectedMonth) {
                @for (seriesPerMuscleGroup of seriesPerMuscleGroupPerUserPerMonth()[selectedMonth] | keyvalue; track $index) {
                  <td class="text-center fw-semibold">{{ seriesPerMuscleGroup.key | titlecase }}</td>
                }
              }
              <td class="text-center fw-semibold">Target</td>
            </tr>
          </thead>
          <tbody>
            @for (muscleGroup of exerciseLogService.muscleGroups(); track $index) {
              <tr>
                <td class="fw-semibold">{{ muscleGroup | titlecase }}</td>
                @if (selectedMonth(); as selectedMonth) {
                  @for (seriesPerMuscleGroupPerUser of seriesPerMuscleGroupPerUserPerMonth()[selectedMonth] | keyvalue; track $index) {
                    <td class="text-center">
                      {{ seriesPerMuscleGroupPerUser.value[muscleGroup] || 0 }}
                    </td>
                  }
                }
                <td class="text-center">40</td>
              </tr>
            }
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
  imports: [NgClass, TitleCasePipe, KeyValuePipe, ParseToMonthPipe, NgbDropdownModule],
})
export class SeriesPerMuscleGroupMonthlyComponent {
  @Input({ required: true }) public set rows(value: ExerciseRow[]) {
    this.state.update(state => ({ ...state, rows: value }));
    this.state.update(state => ({ ...state, selectedMonth: this.months().at(0) ?? 'Month' }));
  }

  public readonly exerciseLogService = inject(ExerciseLogService);

  private readonly state = signal<State>({
    rows: [],
    selectedMonth: 'Month',
  });

  public readonly selectedMonth$: Subject<string> = new Subject();

  public readonly selectedMonth = computed(() => this.state().selectedMonth);

  public readonly seriesPerMuscleGroupPerUserPerMonth = computed(() => getSeriesAmountPerUserPerMuscleGroupPerMonth(this.state().rows));

  public readonly daysByMonth = computed(() => R.mapValues(groupByMonth(this.exerciseLogService.logs()), x => x.length));
  public readonly months = computed(() => R.keys(this.seriesPerMuscleGroupPerUserPerMonth()));

  public readonly selectedMonthLabel = computed(() => this.state().selectedMonth ?? 'Month');
  public readonly daysTrainedMessage = computed(() => {
    const selectedMonth = this.selectedMonth();
    const daysTrained = selectedMonth ? this.daysByMonth()[selectedMonth] : 0;
    return `${daysTrained} ${daysTrained === 1 ? 'day' : 'days'} trained this month`;
  });

  public constructor() {
    this.selectedMonth$.pipe(takeUntilDestroyed()).subscribe(selectedMonth => {
      this.state.update(state => ({
        ...state,
        selectedMonth,
      }));
    });
  }
}
