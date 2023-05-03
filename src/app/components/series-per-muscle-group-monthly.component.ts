import { AsyncPipe, KeyValuePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import * as R from 'remeda';

import { getSeriesAmountPerMuscleGroupMonthly, groupByMonth } from '@helpers/excercise-log.helper';
import { ExcerciseRow } from '@models/excercise-row.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { MUSCLE_GROUPS } from '@models/constants';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

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
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>{{ selectedMonth$ | async }}</button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem (click)="selectedMonthSubject.next(null)">Clear filter</button>
              <button ngbDropdownItem *ngFor="let month of months" (click)="selectedMonthSubject.next(month)">{{ month }}</button>
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
                    {{ name.key | titlecase }}
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let muscleGroup of muscleGroups">
                  <td class="fw-semibold">{{ muscleGroup | titlecase }}</td>
                  <td class="text-center" *ngFor="let x of seriesPerMuscleGroupMonthly[selectedMonth] | keyvalue">
                    {{ x.value[muscleGroup] || 0 }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="fw-semibold">
              {{ daysGroupByMonth[selectedMonth] }} {{ daysGroupByMonth[selectedMonth] === 1 ? 'day' : 'days' }} trained this month
            </div>
          </ng-container>
        </ng-container>
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
  imports: [NgFor, NgIf, TitleCasePipe, KeyValuePipe, AsyncPipe, NgbDropdownModule],
})
export class SeriesPerMuscleGroupMonthlyComponent {
  private _rows: ExcerciseRow[] = [];

  @Input() public set rows(value: ExcerciseRow[]) {
    this._rows = value;
    this.seriesPerMuscleGroupMonthly = getSeriesAmountPerMuscleGroupMonthly(this.rows);
    this.daysGroupByMonth = R.mapValues(groupByMonth(this.rows), x => x.length);

    this.months = R.keys(this.seriesPerMuscleGroupMonthly);
    this.selectedMonthSubject.next(this.months[0]);
  }

  public get rows(): ExcerciseRow[] {
    return this._rows;
  }

  public readonly muscleGroups = MUSCLE_GROUPS;

  public seriesPerMuscleGroupMonthly: Record<string, Record<string, Record<string, number>>> | null = null;
  public daysGroupByMonth: Record<PropertyKey, number> | null = null;
  public months: string[] = [];

  public selectedMonthSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public selectedMonth$: Observable<string> = this.selectedMonthSubject.pipe(map(x => x ?? 'Month'));
}
