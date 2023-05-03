import ***REMOVED*** AsyncPipe, KeyValuePipe, NgFor, NgIf, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, Input ***REMOVED*** from '@angular/core';

import * as R from 'remeda';

import ***REMOVED*** getSeriesAmountPerMuscleGroupMonthly, groupByMonth ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** BehaviorSubject, Observable, map ***REMOVED*** from 'rxjs';
import ***REMOVED*** MUSCLE_GROUPS ***REMOVED*** from '@models/constants';
import ***REMOVED*** NgbDropdownModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

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
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>***REMOVED******REMOVED*** selectedMonth$ | async ***REMOVED******REMOVED***</button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem (click)="selectedMonthSubject.next(null)">Clear filter</button>
              <button ngbDropdownItem *ngFor="let month of months" (click)="selectedMonthSubject.next(month)">***REMOVED******REMOVED*** month ***REMOVED******REMOVED***</button>
            </div>
          </div>
        </div>
        <ng-container *ngIf="selectedMonthSubject | async as selectedMonth">
          <ng-container *ngIf="seriesPerMuscleGroupMonthly && daysGroupByMonth">
            <table class="table table-sm m-0 mb-3">
              <thead>
                <tr>
                  <td scope="col" class="fw-semibold">Muscle Group</td>
                  <td class="text-center fw-semibold" *ngFor="let name of seriesPerMuscleGroupMonthly[selectedMonth] | keyvalue">
                    ***REMOVED******REMOVED*** name.key | titlecase ***REMOVED******REMOVED***
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let muscleGroup of muscleGroups">
                  <td class="fw-semibold">***REMOVED******REMOVED*** muscleGroup | titlecase ***REMOVED******REMOVED***</td>
                  <td class="text-center" *ngFor="let x of seriesPerMuscleGroupMonthly[selectedMonth] | keyvalue">
                    ***REMOVED******REMOVED*** x.value[muscleGroup] || 0 ***REMOVED******REMOVED***
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="fw-semibold">
              ***REMOVED******REMOVED*** daysGroupByMonth[selectedMonth] ***REMOVED******REMOVED*** ***REMOVED******REMOVED*** daysGroupByMonth[selectedMonth] === 1 ? 'day' : 'days' ***REMOVED******REMOVED*** trained this month
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
export class SeriesPerMuscleGroupMonthlyComponent ***REMOVED***
  private _rows: ExcerciseRow[] = [];

  @Input() public set rows(value: ExcerciseRow[]) ***REMOVED***
    this._rows = value;
    this.seriesPerMuscleGroupMonthly = getSeriesAmountPerMuscleGroupMonthly(this.rows);
    this.daysGroupByMonth = R.mapValues(groupByMonth(this.rows), x => x.length);

    this.months = R.keys(this.seriesPerMuscleGroupMonthly);
    this.selectedMonthSubject.next(this.months[0]);
***REMOVED***

  public get rows(): ExcerciseRow[] ***REMOVED***
    return this._rows;
***REMOVED***

  public readonly muscleGroups = MUSCLE_GROUPS;

  public seriesPerMuscleGroupMonthly: Record<string, Record<string, Record<string, number>>> | null = null;
  public daysGroupByMonth: Record<PropertyKey, number> | null = null;
  public months: string[] = [];

  public selectedMonthSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public selectedMonth$: Observable<string> = this.selectedMonthSubject.pipe(map(x => x ?? 'Month'));
***REMOVED***
