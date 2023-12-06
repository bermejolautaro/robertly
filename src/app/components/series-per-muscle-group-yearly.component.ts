import { KeyValuePipe, NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';

import * as R from 'remeda';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { getSeriesAmountPerUserPerMuscleGroupPerYear, groupByWeek, groupByYear } from '@helpers/excercise-log.helper';
import { ExerciseRow } from '@models/excercise-row.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { ExerciseLogService } from '@services/excercise-log.service';
import { ParseToYearPipe } from '@pipes/parse-to-year.pipe';

type State = {
  rows: ExerciseRow[];
  selectedYear: string;
};

@Component({
  selector: 'app-series-per-muscle-group-yearly',
  template: `
    <div class="card border-0 shadow-material-1">
      <div class="card-body">
        <div class="card-title mb-3">
          <h5>Series Per Muscle Group - Yearly</h5>
        </div>
        <div class="mb-3">
          <div ngbDropdown class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>
              {{ selectedYearLabel() | parseToYear }}
            </button>
            <div ngbDropdownMenu class="w-100" style="overflow-x: hidden; overflow-y: scroll; max-height: 400px">
              @for (year of years(); track year) {
                <button ngbDropdownItem [ngClass]="{ active: year === selectedYear() }" (click)="selectedYear$.next(year)">
                  {{ year | parseToYear }}
                </button>
              }
            </div>
          </div>
        </div>
        <table class="table table-sm m-0 mb-3">
          <thead>
            <tr>
              <td scope="col" class="fw-semibold">Muscle Group</td>
              @if (selectedYear(); as selectedYear) {
                @for (seriesPerMuscleGroupPerUser of seriesPerMuscleGroupPerUserPerYear()[selectedYear] | keyvalue; track $index) {
                  <td class="text-center fw-semibold">
                    {{ seriesPerMuscleGroupPerUser.key | titlecase }}
                  </td>
                }
              }
              <td class="text-center fw-semibold">Target</td>
            </tr>
          </thead>
          <tbody>
            @for (muscleGroup of exerciseLogService.muscleGroups(); track $index) {
              <tr>
                <td class="fw-semibold">{{ muscleGroup | titlecase }}</td>
                @if (selectedYear(); as selectedYear) {
                  @for (seriesPerMuscleGroupPerUser of seriesPerMuscleGroupPerUserPerYear()[selectedYear] | keyvalue; track $index) {
                    <td class="text-center">
                      {{ seriesPerMuscleGroupPerUser.value[muscleGroup] || 0 }}
                    </td>
                  }
                }
                <td class="text-center">{{ 40 * 12}}</td>
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
  imports: [NgClass, ParseToYearPipe, TitleCasePipe, KeyValuePipe, NgbDropdownModule],
})
export class SeriesPerMuscleGroupYearlyComponent {
  @Input({ required: true }) public set rows(value: ExerciseRow[]) {
    this.state.update(state => ({ ...state, rows: value }));
    this.state.update(state => ({ ...state, selectedYear: this.years().at(0) ?? 'Year' }));
  }

  public readonly exerciseLogService = inject(ExerciseLogService);

  private readonly state = signal<State>({
    rows: [],
    selectedYear: 'Year',
  });

  public readonly selectedYear$: Subject<string> = new Subject();

  public readonly selectedYear = computed(() => this.state().selectedYear);

  public readonly seriesPerMuscleGroupPerUserPerYear = computed(() => getSeriesAmountPerUserPerMuscleGroupPerYear(this.state().rows));

  public readonly daysByYear = computed(() => R.mapValues(groupByYear(this.exerciseLogService.logs()), x => x.length));
  public readonly years = computed(() => R.keys(this.seriesPerMuscleGroupPerUserPerYear()));

  public readonly selectedYearLabel = computed(() => this.state().selectedYear ?? 'Year');
  public readonly daysTrainedMessage = computed(() => {
    const selectedYear = this.selectedYear();
    const daysTrained = selectedYear ? this.daysByYear()[selectedYear] : 0;
    return `${daysTrained} ${daysTrained === 1 ? 'day' : 'days'} trained this year`;
  });

  public constructor() {
    this.selectedYear$.pipe(takeUntilDestroyed()).subscribe(selectedYear => {
      this.state.update(state => ({
        ...state,
        selectedYear,
      }));
    });
  }
}
