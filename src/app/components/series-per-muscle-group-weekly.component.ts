import ***REMOVED*** KeyValuePipe, NgFor, NgIf, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, Input, computed, signal ***REMOVED*** from '@angular/core';

import * as R from 'remeda';

import ***REMOVED*** NgbDropdownModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** getSeriesAmountPerMuscleGroupWeekly, groupByWeek ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** MUSCLE_GROUPS ***REMOVED*** from '@models/constants';

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
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>***REMOVED******REMOVED*** selectedWeekDropdownValue() ***REMOVED******REMOVED***</button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem *ngFor="let week of weeksSignal()" (click)="selectedWeekDropdownSignal.set(week)">
                ***REMOVED******REMOVED*** week ***REMOVED******REMOVED***
              </button>
            </div>
          </div>
        </div>
        <table class="table table-sm m-0 mb-3">
          <thead>
            <tr>
              <td scope="col" class="fw-semibold">Muscle Group</td>
              <td class="text-center fw-semibold" *ngFor="let name of seriesPerMuscleGroupWeeklySignal()[selectedWeekSignal()] | keyvalue">
                ***REMOVED******REMOVED*** name.key | titlecase ***REMOVED******REMOVED***
              </td>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let muscleGroup of muscleGroups">
              <td class="fw-semibold">***REMOVED******REMOVED*** muscleGroup | titlecase ***REMOVED******REMOVED***</td>
              <td class="text-center" *ngFor="let x of seriesPerMuscleGroupWeeklySignal()[selectedWeekSignal()] | keyvalue">
                ***REMOVED******REMOVED*** x.value[muscleGroup] || 0 ***REMOVED******REMOVED***
              </td>
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
  imports: [NgFor, NgIf, TitleCasePipe, KeyValuePipe, NgbDropdownModule],
***REMOVED***)
export class SeriesPerMuscleGroupWeeklyComponent ***REMOVED***
  @Input(***REMOVED*** required: true ***REMOVED***) public set rows(value: ExcerciseRow[]) ***REMOVED***
    this.rowsSignal.set(value);
***REMOVED***

  public readonly muscleGroups = MUSCLE_GROUPS;

  public readonly rowsSignal = signal<ExcerciseRow[]>([]);
  public readonly daysGroupByWeekSignal = computed(() => R.mapValues(groupByWeek(this.rowsSignal()), x => x.length));
  public readonly seriesPerMuscleGroupWeeklySignal = computed(() => getSeriesAmountPerMuscleGroupWeekly(this.rowsSignal()));
  public readonly weeksSignal = computed(() => R.keys(this.seriesPerMuscleGroupWeeklySignal()));
  public readonly selectedWeekDropdownSignal = signal<string | null>(null);
  public readonly selectedWeekSignal = computed(() => this.selectedWeekDropdownSignal() ?? this.weeksSignal()[0]);
  public readonly selectedWeekDropdownValue = computed(() => this.selectedWeekSignal() ?? 'Week');

  public readonly daysTrainedMessage = computed(() => ***REMOVED***
    const daysTrained = this.daysGroupByWeekSignal()[this.selectedWeekSignal()];
    return `$***REMOVED***daysTrained***REMOVED*** $***REMOVED***daysTrained === 1 ? 'day' : 'days'***REMOVED*** trained this week`;
***REMOVED***);
***REMOVED***
