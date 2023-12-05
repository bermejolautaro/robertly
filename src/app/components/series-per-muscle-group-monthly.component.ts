import ***REMOVED*** KeyValuePipe, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, Input, computed, signal ***REMOVED*** from '@angular/core';

import * as R from 'remeda';

import ***REMOVED*** NgbDropdownModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** getSeriesAmountPerUserPerMuscleGroupPerMonth, groupByMonth ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** ExerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** MUSCLE_GROUPS ***REMOVED*** from '@models/constants';
import ***REMOVED*** ParseToMonthPipe ***REMOVED*** from '@pipes/date.pipe';
import ***REMOVED*** Subject ***REMOVED*** from 'rxjs';
import ***REMOVED*** takeUntilDestroyed ***REMOVED*** from '@angular/core/rxjs-interop';

type State = ***REMOVED***
  rows: ExerciseRow[];
  selectedMonth: string;
***REMOVED***;

@Component(***REMOVED***
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
              ***REMOVED******REMOVED*** selectedMonthLabel() | parseToMonth ***REMOVED******REMOVED***
            </button>
            <div ngbDropdownMenu class="w-100">
              @for (month of months(); track $index) ***REMOVED***
                <button ngbDropdownItem (click)="selectedMonth$.next(month)">
                  ***REMOVED******REMOVED*** month | parseToMonth ***REMOVED******REMOVED***
                </button>
          ***REMOVED***
            </div>
          </div>
        </div>
        <table class="table table-sm m-0 mb-3">
          <thead>
            <tr>
              <td scope="col" class="fw-semibold">Muscle Group</td>
              @if (selectedMonth(); as selectedMonth) ***REMOVED***
                @for (seriesPerMuscleGroup of seriesPerMuscleGroupPerUserPerMonth()[selectedMonth] | keyvalue; track $index) ***REMOVED***
                  <td class="text-center fw-semibold">***REMOVED******REMOVED*** seriesPerMuscleGroup.key | titlecase ***REMOVED******REMOVED***</td>
            ***REMOVED***
          ***REMOVED***
              <td class="text-center fw-semibold">Target</td>
            </tr>
          </thead>
          <tbody>
            @for (muscleGroup of MUSCLE_GROUPS; track $index) ***REMOVED***
              <tr>
                <td class="fw-semibold">***REMOVED******REMOVED*** muscleGroup | titlecase ***REMOVED******REMOVED***</td>
                @if (selectedMonth(); as selectedMonth) ***REMOVED***
                  @for (seriesPerMuscleGroupPerUser of seriesPerMuscleGroupPerUserPerMonth()[selectedMonth] | keyvalue; track $index) ***REMOVED***
                    <td class="text-center">
                      ***REMOVED******REMOVED*** seriesPerMuscleGroupPerUser.value[muscleGroup] || 0 ***REMOVED******REMOVED***
                    </td>
              ***REMOVED***
            ***REMOVED***
                <td class="text-center">40</td>
              </tr>
        ***REMOVED***
          </tbody>
        </table>
        <div class="fw-semibold">
          ***REMOVED******REMOVED*** daysTrainedMessage() ***REMOVED******REMOVED***
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host ***REMOVED***
        display: block;
  ***REMOVED***
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, KeyValuePipe, ParseToMonthPipe, NgbDropdownModule],
***REMOVED***)
export class SeriesPerMuscleGroupMonthlyComponent ***REMOVED***
  @Input(***REMOVED*** required: true ***REMOVED***) public set rows(value: ExerciseRow[]) ***REMOVED***
    this.state.update(state => (***REMOVED*** ...state, rows: value ***REMOVED***));
    this.state.update(state => (***REMOVED*** ...state, selectedMonth: this.months().at(0) ?? 'Month' ***REMOVED***));
***REMOVED***

  private readonly state = signal<State>(***REMOVED***
    rows: [],
    selectedMonth: 'Month',
***REMOVED***);

  public readonly selectedMonth$: Subject<string> = new Subject();

  public readonly MUSCLE_GROUPS = MUSCLE_GROUPS;

  public readonly selectedMonth = computed(() => this.state().selectedMonth);

  public readonly seriesPerMuscleGroupPerUserPerMonth = computed(() => getSeriesAmountPerUserPerMuscleGroupPerMonth(this.state().rows));

  public readonly daysByMonth = computed(() => R.mapValues(groupByMonth(this.state().rows), x => x.length));
  public readonly months = computed(() => R.keys(this.seriesPerMuscleGroupPerUserPerMonth()));

  public readonly selectedMonthLabel = computed(() => this.state().selectedMonth ?? 'Month');
  public readonly daysTrainedMessage = computed(() => ***REMOVED***
    const selectedMonth = this.selectedMonth();
    const daysTrained = selectedMonth ? this.daysByMonth()[selectedMonth] : 0;
    return `$***REMOVED***daysTrained***REMOVED*** $***REMOVED***daysTrained === 1 ? 'day' : 'days'***REMOVED*** trained this month`;
***REMOVED***);

  public constructor() ***REMOVED***
    this.selectedMonth$.pipe(takeUntilDestroyed()).subscribe(selectedMonth => ***REMOVED***
      this.state.update(state => (***REMOVED***
        ...state,
        selectedMonth,
  ***REMOVED***));
***REMOVED***);
***REMOVED***
***REMOVED***
