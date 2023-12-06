import ***REMOVED*** KeyValuePipe, NgClass, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, Input, computed, inject, signal ***REMOVED*** from '@angular/core';

import * as R from 'remeda';

import ***REMOVED*** NgbDropdownModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** getSeriesAmountPerMuscleGroupPerWeek, groupByWeek ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** ExerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** takeUntilDestroyed ***REMOVED*** from '@angular/core/rxjs-interop';
import ***REMOVED*** Subject ***REMOVED*** from 'rxjs';
import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';

type State = ***REMOVED***
  rows: ExerciseRow[];
  selectedWeek: string;
***REMOVED***;

@Component(***REMOVED***
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
              Week from Monday: ***REMOVED******REMOVED*** selectedWeekLabel() ***REMOVED******REMOVED***
            </button>
            <div ngbDropdownMenu class="w-100" style="overflow-x: hidden; overflow-y: scroll; max-height: 400px">
              @for (week of weeks(); track week) ***REMOVED***
                <button ngbDropdownItem [ngClass]="***REMOVED*** active: week === selectedWeek()***REMOVED***" (click)="selectedWeek$.next(week)">
                  ***REMOVED******REMOVED*** week ***REMOVED******REMOVED***
                </button>
          ***REMOVED***
            </div>
          </div>
        </div>
        <table class="table table-sm m-0 mb-3">
          <thead>
            <tr>
              <td scope="col" class="fw-semibold">Muscle Group</td>
              @if (selectedWeek(); as selectedWeek) ***REMOVED***
                @for (seriesPerMuscleGroupPerUser of seriesPerMuscleGroupPerUserPerWeek()[selectedWeek] | keyvalue; track $index) ***REMOVED***
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
                @if (selectedWeek(); as selectedWeek) ***REMOVED***
                  @for (seriesPerMuscleGroupPerUser of seriesPerMuscleGroupPerUserPerWeek()[selectedWeek] | keyvalue; track $index) ***REMOVED***
                    <td class="text-center">
                      ***REMOVED******REMOVED*** seriesPerMuscleGroupPerUser.value[muscleGroup] || 0 ***REMOVED******REMOVED***
                    </td>
              ***REMOVED***
            ***REMOVED***
                <td class="text-center">10</td>
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
  imports: [NgClass, TitleCasePipe, KeyValuePipe, NgbDropdownModule],
***REMOVED***)
export class SeriesPerMuscleGroupWeeklyComponent ***REMOVED***
  @Input(***REMOVED*** required: true ***REMOVED***) public set rows(value: ExerciseRow[]) ***REMOVED***
    this.state.update(state => (***REMOVED*** ...state, rows: value ***REMOVED***));
    this.state.update(state => (***REMOVED*** ...state, selectedWeek: this.weeks().at(0) ?? 'Week' ***REMOVED***));
***REMOVED***

  public readonly exerciseLogService = inject(ExerciseLogService);

  private readonly state = signal<State>(***REMOVED***
    rows: [],
    selectedWeek: 'Week',
***REMOVED***);

  public readonly selectedWeek$: Subject<string> = new Subject();

  public readonly selectedWeek = computed(() => this.state().selectedWeek);

  public readonly seriesPerMuscleGroupPerUserPerWeek = computed(() => getSeriesAmountPerMuscleGroupPerWeek(this.state().rows));

  public readonly daysByWeek = computed(() => R.mapValues(groupByWeek(this.exerciseLogService.logs()), x => x.length));
  public readonly weeks = computed(() => R.keys(this.seriesPerMuscleGroupPerUserPerWeek()));

  public readonly selectedWeekLabel = computed(() => this.state().selectedWeek ?? 'Week');
  public readonly daysTrainedMessage = computed(() => ***REMOVED***
    const selectedWeek = this.selectedWeek();
    const daysTrained = selectedWeek ? this.daysByWeek()[selectedWeek] : 0;
    return `$***REMOVED***daysTrained***REMOVED*** $***REMOVED***daysTrained === 1 ? 'day' : 'days'***REMOVED*** trained this week`;
***REMOVED***);

  public constructor() ***REMOVED***
    this.selectedWeek$.pipe(takeUntilDestroyed()).subscribe(selectedWeek => ***REMOVED***
      this.state.update(state => (***REMOVED***
        ...state,
        selectedWeek,
  ***REMOVED***));
***REMOVED***);
***REMOVED***
***REMOVED***
