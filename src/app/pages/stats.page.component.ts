import ***REMOVED*** AsyncPipe, KeyValuePipe, NgFor, NgIf, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, OnInit ***REMOVED*** from '@angular/core';

import ***REMOVED*** BehaviorSubject, Observable, map ***REMOVED*** from 'rxjs';

import ***REMOVED*** NgbDropdownModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** mapGroupedToExcerciseRows ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** getSeriesAmountPerMuscleGroup ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** groupExcerciseLogs ***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** MUSCLE_GROUPS ***REMOVED*** from '@models/constants';
import ***REMOVED*** ExcerciseLogApiService ***REMOVED*** from '@services/excercise-log-api.service';

import * as R from 'remeda';

@Component(***REMOVED***
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
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>***REMOVED******REMOVED*** selectedWeek$ | async ***REMOVED******REMOVED***</button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem (click)="selectedWeekSubject.next(null)">Clear filter</button>
              <button ngbDropdownItem *ngFor="let week of weeks" (click)="selectedWeekSubject.next(week)">***REMOVED******REMOVED*** week ***REMOVED******REMOVED***</button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <table class="table" *ngIf="selectedWeekSubject | async as selectedWeek">
          <thead>
            <tr>
              <th scope="col"></th>
                <th *ngFor="let name of data[selectedWeek] | keyvalue">***REMOVED******REMOVED*** $any(name.key) | titlecase ***REMOVED******REMOVED***</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let muscleGroup of muscleGroups">
              <th>***REMOVED******REMOVED*** muscleGroup | titlecase ***REMOVED******REMOVED***</th>
              <td>
                ***REMOVED******REMOVED*** (data && data[selectedWeek] && data[selectedWeek]['lautaro'] && data[selectedWeek]['lautaro'][muscleGroup]) || 0 ***REMOVED******REMOVED***
              </td>
              <td>
                ***REMOVED******REMOVED*** (data && data[selectedWeek] && data[selectedWeek]['roberto'] && data[selectedWeek]['roberto'][muscleGroup]) || 0 ***REMOVED******REMOVED***
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
***REMOVED***)
export class StatsPageComponent implements OnInit ***REMOVED***
  public muscleGroups = MUSCLE_GROUPS;

  public selectedWeekSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public selectedWeek$: Observable<string>;

  public weeks: string[] = [];
  public data: any;

  public constructor(private readonly excerciseLogApiService: ExcerciseLogApiService) ***REMOVED***
    this.selectedWeek$ = this.selectedWeekSubject.pipe(map(x => x ?? 'Week'));
***REMOVED***

  public ngOnInit(): void ***REMOVED***
    this.excerciseLogApiService.getExcerciseLogs().subscribe(x => ***REMOVED***
      const groupedLogs = groupExcerciseLogs(x);
      const rows = mapGroupedToExcerciseRows(groupedLogs);
      this.data = getSeriesAmountPerMuscleGroup(rows);

      this.weeks = R.keys(this.data);
***REMOVED***);
***REMOVED***
***REMOVED***
