import { KeyValuePipe, NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';

import * as R from 'remeda';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { getSeriesAmountPerMuscleGroupPerWeek, groupByWeek } from '@helpers/excercise-log.helper';
import { ExerciseRow } from '@models/excercise-row.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { ExerciseLogService } from '@services/exercise-log.service';

type State = {
  rows: ExerciseRow[];
  selectedWeek: string;
};

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
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>
              Week from Monday: {{ selectedWeekLabel() }}
            </button>
            <div ngbDropdownMenu class="w-100" style="overflow-x: hidden; overflow-y: scroll; max-height: 400px">
              @for (week of weeks(); track week) {
                <button ngbDropdownItem [ngClass]="{ active: week === selectedWeek()}" (click)="selectedWeek$.next(week)">
                  {{ week }}
                </button>
              }
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-sm m-0 mb-3">
            <thead>
              <tr>
                <td scope="col" class="fw-semibold">Muscle Group</td>
                @if (selectedWeek(); as selectedWeek) {
                  @for (seriesPerMuscleGroupPerUser of seriesPerMuscleGroupPerUserPerWeek()[selectedWeek] | keyvalue; track $index) {
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
                  @if (selectedWeek(); as selectedWeek) {
                    @for (seriesPerMuscleGroupPerUser of seriesPerMuscleGroupPerUserPerWeek()[selectedWeek] | keyvalue; track $index) {
                      <td class="text-center">
                        {{ seriesPerMuscleGroupPerUser.value[muscleGroup] || 0 }}
                      </td>
                    }
                  }
                  <td class="text-center">10</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
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
  imports: [NgClass, TitleCasePipe, KeyValuePipe, NgbDropdownModule],
})
export class SeriesPerMuscleGroupWeeklyComponent {
  @Input({ required: true }) public set rows(value: ExerciseRow[]) {
    this.state.update(state => ({ ...state, rows: value }));
    this.state.update(state => ({ ...state, selectedWeek: this.weeks().at(0) ?? 'Week' }));
  }

  public readonly exerciseLogService = inject(ExerciseLogService);

  private readonly state = signal<State>({
    rows: [],
    selectedWeek: 'Week',
  });

  public readonly selectedWeek$: Subject<string> = new Subject();

  public readonly selectedWeek = computed(() => this.state().selectedWeek);

  public readonly seriesPerMuscleGroupPerUserPerWeek = computed(() => getSeriesAmountPerMuscleGroupPerWeek(this.state().rows));

  public readonly daysByWeek = computed(() => R.mapValues(groupByWeek(this.exerciseLogService.logs()), x => x.length));
  public readonly weeks = computed(() => R.keys(this.seriesPerMuscleGroupPerUserPerWeek()));

  public readonly selectedWeekLabel = computed(() => this.state().selectedWeek ?? 'Week');
  public readonly daysTrainedMessage = computed(() => {
    const selectedWeek = this.selectedWeek();
    const daysTrained = selectedWeek ? this.daysByWeek()[selectedWeek] : 0;
    return `${daysTrained} ${daysTrained === 1 ? 'day' : 'days'} trained this week`;
  });

  public constructor() {
    this.selectedWeek$.pipe(takeUntilDestroyed()).subscribe(selectedWeek => {
      this.state.update(state => ({
        ...state,
        selectedWeek,
      }));
    });
  }
}
