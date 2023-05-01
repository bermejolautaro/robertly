import { AsyncPipe, KeyValuePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, map } from 'rxjs';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { mapGroupedToExcerciseRows } from '@helpers/excercise-log.helper';
import { getSeriesAmountPerMuscleGroup } from '@helpers/excercise-log.helper';
import { groupExcerciseLogs } from '@helpers/excercise-log.helper';
import { MUSCLE_GROUPS } from '@models/constants';
import { ExcerciseLogApiService } from '@services/excercise-log-api.service';

import * as R from 'remeda';

@Component({
  selector: 'app-stats-page',
  template: `
    <div class="container my-4">
      <div class="row mb-3">
        <div class="col">
          <h5>Series Per Muscle Group - Weekly</h5>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <div ngbDropdown class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>{{ selectedWeek$ | async }}</button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem (click)="selectedWeekSubject.next(null)">Clear filter</button>
              <button ngbDropdownItem *ngFor="let week of weeks" (click)="selectedWeekSubject.next(week)">{{ week }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <table class="table" *ngIf="selectedWeekSubject | async as selectedWeek">
          <thead>
            <tr>
              <th scope="col"></th>
                <th *ngFor="let name of data[selectedWeek] | keyvalue">{{ $any(name.key) | titlecase }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let muscleGroup of muscleGroups">
              <th>{{ muscleGroup | titlecase }}</th>
              <td>
                {{ (data && data[selectedWeek] && data[selectedWeek]['lautaro'] && data[selectedWeek]['lautaro'][muscleGroup]) || 0 }}
              </td>
              <td>
                {{ (data && data[selectedWeek] && data[selectedWeek]['roberto'] && data[selectedWeek]['roberto'][muscleGroup]) || 0 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [``],
  standalone: true,
  imports: [NgIf, NgFor, NgbDropdownModule, TitleCasePipe, KeyValuePipe, AsyncPipe],
})
export class StatsPageComponent implements OnInit {
  public muscleGroups = MUSCLE_GROUPS;

  public selectedWeekSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public selectedWeek$: Observable<string>;

  public weeks: string[] = [];
  public data: any;

  public constructor(private readonly excerciseLogApiService: ExcerciseLogApiService) {
    this.selectedWeek$ = this.selectedWeekSubject.pipe(map(x => x ?? 'Week'));
  }

  public ngOnInit(): void {
    this.excerciseLogApiService.getExcerciseLogs().subscribe(x => {
      const groupedLogs = groupExcerciseLogs(x);
      const rows = mapGroupedToExcerciseRows(groupedLogs);
      this.data = getSeriesAmountPerMuscleGroup(rows);

      this.weeks = R.keys(this.data);
    });
  }
}
