import ***REMOVED*** AsyncPipe, KeyValuePipe, NgFor, NgIf, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, Input ***REMOVED*** from '@angular/core';

import * as R from 'remeda';

import ***REMOVED*** getSeriesAmountPerMuscleGroupWeekly, groupByWeek ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** BehaviorSubject, Observable, map ***REMOVED*** from 'rxjs';
import ***REMOVED*** MUSCLE_GROUPS ***REMOVED*** from '@models/constants';
import ***REMOVED*** NgbDropdownModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

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
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>***REMOVED******REMOVED*** selectedWeek$ | async ***REMOVED******REMOVED***</button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem (click)="selectedWeekSubject.next(null)">Clear filter</button>
              <button ngbDropdownItem *ngFor="let week of weeks" (click)="selectedWeekSubject.next(week)">***REMOVED******REMOVED*** week ***REMOVED******REMOVED***</button>
            </div>
          </div>
        </div>
        <ng-container *ngIf="selectedWeekSubject | async as selectedWeek">
          <ng-container *ngIf="seriesPerMuscleGroupWeekly && daysGroupByWeek">
            <table class="table table-sm m-0 mb-3">
              <thead>
                <tr>
                  <td scope="col" class="fw-semibold">Muscle Group</td>
                  <td class="text-center fw-semibold" *ngFor="let name of seriesPerMuscleGroupWeekly[selectedWeek] | keyvalue">
                    ***REMOVED******REMOVED*** name.key | titlecase ***REMOVED******REMOVED***
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let muscleGroup of muscleGroups">
                  <td class="fw-semibold">***REMOVED******REMOVED*** muscleGroup | titlecase ***REMOVED******REMOVED***</td>
                  <td class="text-center" *ngFor="let x of seriesPerMuscleGroupWeekly[selectedWeek] | keyvalue">
                    ***REMOVED******REMOVED*** x.value[muscleGroup] || 0 ***REMOVED******REMOVED***
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="fw-semibold">
              ***REMOVED******REMOVED*** daysGroupByWeek[selectedWeek] ***REMOVED******REMOVED*** ***REMOVED******REMOVED*** daysGroupByWeek[selectedWeek] === 1 ? 'day' : 'days' ***REMOVED******REMOVED*** trained this week
            </div>
          </ng-container>
        </ng-container>
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
  imports: [NgFor, NgIf, TitleCasePipe, KeyValuePipe, AsyncPipe, NgbDropdownModule],
***REMOVED***)
export class SeriesPerMuscleGroupWeeklyComponent ***REMOVED***
  private _rows: ExcerciseRow[] = [];

  @Input() public set rows(value: ExcerciseRow[]) ***REMOVED***
    this._rows = value;
    this.seriesPerMuscleGroupWeekly = getSeriesAmountPerMuscleGroupWeekly(this.rows);
    this.daysGroupByWeek = R.mapValues(groupByWeek(this.rows), x => x.length);

    this.weeks = R.keys(this.seriesPerMuscleGroupWeekly);
    this.selectedWeekSubject.next(this.weeks[0]);
***REMOVED***

  public get rows(): ExcerciseRow[] ***REMOVED***
    return this._rows;
***REMOVED***

  public readonly muscleGroups = MUSCLE_GROUPS;

  public seriesPerMuscleGroupWeekly: Record<string, Record<string, Record<string, number>>> | null = null;
  public daysGroupByWeek: Record<PropertyKey, number> | null = null;
  public weeks: string[] = [];

  public selectedWeekSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public selectedWeek$: Observable<string> = this.selectedWeekSubject.pipe(map(x => x ?? 'Week'));
***REMOVED***
