import ***REMOVED*** KeyValuePipe, NgClass, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, Input, computed, inject, signal ***REMOVED*** from '@angular/core';

import * as R from 'remeda';

import ***REMOVED*** NgbDropdownModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** getSeriesAmountPerUserPerMuscleGroupPerYear, groupByYear ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** ExerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** takeUntilDestroyed ***REMOVED*** from '@angular/core/rxjs-interop';
import ***REMOVED*** Subject ***REMOVED*** from 'rxjs';
import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';
import ***REMOVED*** ParseToYearPipe ***REMOVED*** from '@pipes/parse-to-year.pipe';

type State = ***REMOVED***
  rows: ExerciseRow[];
  selectedYear: string;
***REMOVED***;

@Component(***REMOVED***
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
              ***REMOVED******REMOVED*** selectedYearLabel() | parseToYear ***REMOVED******REMOVED***
            </button>
            <div ngbDropdownMenu class="w-100" style="overflow-x: hidden; overflow-y: scroll; max-height: 400px">
              @for (year of years(); track year) ***REMOVED***
                <button ngbDropdownItem [ngClass]="***REMOVED*** active: year === selectedYear() ***REMOVED***" (click)="selectedYear$.next(year)">
                  ***REMOVED******REMOVED*** year | parseToYear ***REMOVED******REMOVED***
                </button>
          ***REMOVED***
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-sm m-0 mb-3">
            <thead>
              <tr>
                <td scope="col" class="fw-semibold">Muscle Group</td>
                @if (selectedYear(); as selectedYear) ***REMOVED***
                  @for (seriesPerMuscleGroupPerUser of seriesPerMuscleGroupPerUserPerYear()[selectedYear] | keyvalue; track $index) ***REMOVED***
                    <td class="text-center fw-semibold">
                      ***REMOVED******REMOVED*** seriesPerMuscleGroupPerUser.key | titlecase ***REMOVED******REMOVED***
                    </td>
              ***REMOVED***
            ***REMOVED***
                <td class="text-center fw-semibold">Target</td>
              </tr>
            </thead>
            <tbody>
              @for (muscleGroup of exerciseLogService.muscleGroups(); track $index) ***REMOVED***
                <tr>
                  <td class="fw-semibold">***REMOVED******REMOVED*** muscleGroup | titlecase ***REMOVED******REMOVED***</td>
                  @if (selectedYear(); as selectedYear) ***REMOVED***
                    @for (seriesPerMuscleGroupPerUser of seriesPerMuscleGroupPerUserPerYear()[selectedYear] | keyvalue; track $index) ***REMOVED***
                      <td class="text-center">
                        ***REMOVED******REMOVED*** seriesPerMuscleGroupPerUser.value[muscleGroup] || 0 ***REMOVED******REMOVED***
                      </td>
                ***REMOVED***
              ***REMOVED***
                  <td class="text-center">***REMOVED******REMOVED*** 40 * 12***REMOVED******REMOVED***</td>
                </tr>
          ***REMOVED***
            </tbody>
          </table>
        </div>
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
  imports: [NgClass, ParseToYearPipe, TitleCasePipe, KeyValuePipe, NgbDropdownModule],
***REMOVED***)
export class SeriesPerMuscleGroupYearlyComponent ***REMOVED***
  @Input(***REMOVED*** required: true ***REMOVED***) public set rows(value: ExerciseRow[]) ***REMOVED***
    this.state.update(state => (***REMOVED*** ...state, rows: value ***REMOVED***));
    this.state.update(state => (***REMOVED*** ...state, selectedYear: this.years().at(0) ?? 'Year' ***REMOVED***));
***REMOVED***

  public readonly exerciseLogService = inject(ExerciseLogService);

  private readonly state = signal<State>(***REMOVED***
    rows: [],
    selectedYear: 'Year',
***REMOVED***);

  public readonly selectedYear$: Subject<string> = new Subject();

  public readonly selectedYear = computed(() => this.state().selectedYear);

  public readonly seriesPerMuscleGroupPerUserPerYear = computed(() => getSeriesAmountPerUserPerMuscleGroupPerYear(this.state().rows));

  public readonly daysByYear = computed(() => R.mapValues(groupByYear(this.exerciseLogService.logs()), x => x.length));
  public readonly years = computed(() => R.keys(this.seriesPerMuscleGroupPerUserPerYear()));

  public readonly selectedYearLabel = computed(() => this.state().selectedYear ?? 'Year');
  public readonly daysTrainedMessage = computed(() => ***REMOVED***
    const selectedYear = this.selectedYear();
    const daysTrained = selectedYear ? this.daysByYear()[selectedYear] : 0;
    return `$***REMOVED***daysTrained***REMOVED*** $***REMOVED***daysTrained === 1 ? 'day' : 'days'***REMOVED*** trained this year`;
***REMOVED***);

  public constructor() ***REMOVED***
    this.selectedYear$.pipe(takeUntilDestroyed()).subscribe(selectedYear => ***REMOVED***
      this.state.update(state => (***REMOVED***
        ...state,
        selectedYear,
  ***REMOVED***));
***REMOVED***);
***REMOVED***
***REMOVED***
