import ***REMOVED*** AsyncPipe, KeyValuePipe, NgFor, NgIf, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, Input, computed, signal ***REMOVED*** from '@angular/core';

import * as R from 'remeda';

import ***REMOVED*** NgbDropdownModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** getSeriesAmountPerMuscleGroupMonthly, groupByMonth ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** MUSCLE_GROUPS ***REMOVED*** from '@models/constants';
import ***REMOVED*** ParseToMonthPipe ***REMOVED*** from '@pipes/date.pipe';

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
              ***REMOVED******REMOVED*** selectedWeekDropdownValue() | parseToMonth ***REMOVED******REMOVED***
            </button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem *ngFor="let month of monthsSignal()" (click)="selectedMonthDropdownSignal.set(month)">
                ***REMOVED******REMOVED*** month | parseToMonth ***REMOVED******REMOVED***
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
                ***REMOVED******REMOVED*** name.key | titlecase ***REMOVED******REMOVED***
              </td>
              <td class="text-center fw-semibold">Target</td>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let muscleGroup of muscleGroups">
              <td class="fw-semibold">***REMOVED******REMOVED*** muscleGroup | titlecase ***REMOVED******REMOVED***</td>
              <td class="text-center" *ngFor="let x of seriesPerMuscleGroupMonthlySignal()[selectedMonthSignal()!] | keyvalue">
                ***REMOVED******REMOVED*** x.value[muscleGroup] || 0 ***REMOVED******REMOVED***
              </td>
              <td class="text-center">40</td>
            </tr>
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
  imports: [NgFor, NgIf, TitleCasePipe, KeyValuePipe, AsyncPipe, ParseToMonthPipe, NgbDropdownModule],
***REMOVED***)
export class SeriesPerMuscleGroupMonthlyComponent ***REMOVED***
  @Input(***REMOVED*** required: true ***REMOVED***) public set rows(value: ExcerciseRow[]) ***REMOVED***
    this.rowsSignal.set(value);
***REMOVED***

  public readonly muscleGroups = MUSCLE_GROUPS;

  public readonly rowsSignal = signal<ExcerciseRow[]>([]);
  public readonly daysGroupByMonthSignal = computed(() => R.mapValues(groupByMonth(this.rowsSignal()), x => x.length));
  public readonly seriesPerMuscleGroupMonthlySignal = computed(() => getSeriesAmountPerMuscleGroupMonthly(this.rowsSignal()));
  public readonly monthsSignal = computed(() => R.keys(this.seriesPerMuscleGroupMonthlySignal()));

  public readonly selectedMonthDropdownSignal = signal<string | null>(null);
  public readonly selectedMonthSignal = computed(() => this.selectedMonthDropdownSignal() ?? this.monthsSignal()[0]);
  public readonly selectedWeekDropdownValue = computed(() => this.selectedMonthSignal() ?? 'Month');
  public readonly daysTrainedMessage = computed(() => ***REMOVED***
    const daysTrained = this.daysGroupByMonthSignal()[this.selectedMonthSignal()!];
    return `$***REMOVED***daysTrained***REMOVED*** $***REMOVED***daysTrained === 1 ? 'day' : 'days'***REMOVED*** trained this month`;
***REMOVED***);
***REMOVED***
