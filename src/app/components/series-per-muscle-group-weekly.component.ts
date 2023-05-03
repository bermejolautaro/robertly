import { AsyncPipe, KeyValuePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import * as R from 'remeda';

import { getSeriesAmountPerMuscleGroupWeekly, groupByWeek } from '@helpers/excercise-log.helper';
import { ExcerciseRow } from '@models/excercise-row.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { MUSCLE_GROUPS } from '@models/constants';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

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
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>{{ selectedWeek$ | async }}</button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem (click)="selectedWeekSubject.next(null)">Clear filter</button>
              <button ngbDropdownItem *ngFor="let week of weeks" (click)="selectedWeekSubject.next(week)">{{ week }}</button>
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
                    {{ name.key | titlecase }}
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let muscleGroup of muscleGroups">
                  <td class="fw-semibold">{{ muscleGroup | titlecase }}</td>
                  <td class="text-center" *ngFor="let x of seriesPerMuscleGroupWeekly[selectedWeek] | keyvalue">
                    {{ x.value[muscleGroup] || 0 }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="fw-semibold">
              {{ daysGroupByWeek[selectedWeek] }} {{ daysGroupByWeek[selectedWeek] === 1 ? 'day' : 'days' }} trained this week
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
export class SeriesPerMuscleGroupWeeklyComponent {
  private _rows: ExcerciseRow[] = [];

  @Input() public set rows(value: ExcerciseRow[]) {
    this._rows = value;
    this.seriesPerMuscleGroupWeekly = getSeriesAmountPerMuscleGroupWeekly(this.rows);
    this.daysGroupByWeek = R.mapValues(groupByWeek(this.rows), x => x.length);

    this.weeks = R.keys(this.seriesPerMuscleGroupWeekly);
    this.selectedWeekSubject.next(this.weeks[0]);
  }

  public get rows(): ExcerciseRow[] {
    return this._rows;
  }

  public readonly muscleGroups = MUSCLE_GROUPS;

  public seriesPerMuscleGroupWeekly: Record<string, Record<string, Record<string, number>>> | null = null;
  public daysGroupByWeek: Record<PropertyKey, number> | null = null;
  public weeks: string[] = [];

  public selectedWeekSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public selectedWeek$: Observable<string> = this.selectedWeekSubject.pipe(map(x => x ?? 'Week'));
}
