import ***REMOVED*** AsyncPipe, NgFor, NgIf, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** FormsModule ***REMOVED*** from '@angular/forms';

import ***REMOVED*** NgbDropdownModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** BehaviorSubject, Observable, combineLatest ***REMOVED*** from 'rxjs';
import ***REMOVED*** finalize, map, pairwise, startWith, tap ***REMOVED*** from 'rxjs/operators';

import * as R from 'remeda';

import type ***REMOVED*** ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';
import type ***REMOVED*** GroupedLog ***REMOVED*** from '@models/grouped-log.model';
import ***REMOVED*** IfNullEmptyArrayPipe ***REMOVED*** from '@pipes/if-null-empty-array.pipe';
import ***REMOVED*** ExcerciseRowsComponent ***REMOVED*** from '@components/excercise-rows.component';
import ***REMOVED*** GroupedExcerciseRowsComponent ***REMOVED*** from '@components/grouped-excercise-rows.component';
import ***REMOVED*** PersonalRecordComponent ***REMOVED*** from '@components/personal-record.component';
import ***REMOVED*** ExcerciseLogApiService ***REMOVED*** from '@services/excercise-log-api.service';
import ***REMOVED*** getPersonalRecord, groupExcerciseLogs, mapGroupedToExcerciseRows ***REMOVED*** from '@helpers/excercise-log.helper';

interface Excercise ***REMOVED***
  name: string;
  type: string;
***REMOVED***

@Component(***REMOVED***
  selector: 'app-excercise-logs-page',
  template: `
    <!-- #region FILTERS -->
    <div class="container my-4">
      <div class="row mb-2 gx-2">
        <!-- #region DROPDOWN TYPE -->
        <div class="col-6">
          <div ngbDropdown class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>
              ***REMOVED******REMOVED*** selectedType$ | async | titlecase ***REMOVED******REMOVED***
            </button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem (click)="selectedTypeSubject.next(null)">Clear filter</button>
              <button ngbDropdownItem *ngFor="let type of types" (click)="selectedTypeSubject.next(type)">
                ***REMOVED******REMOVED*** type | titlecase ***REMOVED******REMOVED***
              </button>
            </div>
          </div>
        </div>
        <!-- #endregion -->

        <!-- #region DROPDOWN EXCERCISE -->
        <div class="col-6">
          <div ngbDropdown class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>
              ***REMOVED******REMOVED*** selectedExcercise$ | async | titlecase ***REMOVED******REMOVED***
            </button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem (click)="selectedExcerciseSubject.next(null)">Clear filter</button>
              <button ngbDropdownItem *ngFor="let excercise of excercises$ | async" (click)="selectedExcerciseSubject.next(excercise)">
                ***REMOVED******REMOVED*** excercise | titlecase ***REMOVED******REMOVED***
              </button>
            </div>
          </div>
        </div>
        <!-- #endregion -->
      </div>

      <div class="row mb-2">
        <!-- #region DROPDOWN NAME -->
        <div class="col-12">
          <div ngbDropdown class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>
              ***REMOVED******REMOVED*** selectedUsername$ | async | titlecase ***REMOVED******REMOVED***
            </button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem (click)="selectedUsernameSubject.next(null)">Clear filter</button>
              <button ngbDropdownItem *ngFor="let username of usernames" (click)="selectedUsernameSubject.next(username)">
                ***REMOVED******REMOVED*** username | titlecase ***REMOVED******REMOVED***
              </button>
            </div>
          </div>
        </div>
        <!-- #endregion -->
      </div>

      <div class="row">
        <div class="col-12">
          <div class="form-check form-switch d-flex align-items-center gap-1">
            <input class="form-check-input" type="checkbox" role="switch" [(ngModel)]="isGrouped" />
            <label class="form-check-label">Grouped</label>
          </div>
        </div>
      </div>
    </div>
    <!-- #endregion -->

    <div *ngIf="!isLoading; else loadingSpinner">
      <div class="container" *ngIf="isGrouped">
        <app-personal-record
          *ngIf="personalRecord$ | async as personalRecord"
          class="mb-3"
          [personalRecord]="personalRecord"
        ></app-personal-record>

        <app-grouped-excercise-rows [groupedExcerciseLogs]="groupedLogs$ | async | ifNullEmptyArray"> </app-grouped-excercise-rows>
      </div>

      <div class="container" *ngIf="!isGrouped">
        <app-personal-record
          *ngIf="personalRecord$ | async as personalRecord"
          class="mb-3"
          [personalRecord]="personalRecord"
        ></app-personal-record>

        <app-excercise-rows [excerciseRows]="excerciseRows$ | async | ifNullEmptyArray"></app-excercise-rows>
      </div>
    </div>

    <ng-template #loadingSpinner>
      <div class="position-absolute top-50 start-50 translate-middle">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .dropdown-menu ***REMOVED***
        max-height: 400px;
        overflow: scroll;
  ***REMOVED***
    `,
  ],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    AsyncPipe,
    TitleCasePipe,
    FormsModule,
    NgbDropdownModule,
    PersonalRecordComponent,
    GroupedExcerciseRowsComponent,
    ExcerciseRowsComponent,
    IfNullEmptyArrayPipe,
  ],
***REMOVED***)
export class ExcerciseLogsPageComponent ***REMOVED***
  public excerciseRowsSubject: BehaviorSubject<ExcerciseRow[]> = new BehaviorSubject<ExcerciseRow[]>([]);
  public excerciseRows$: Observable<ExcerciseRow[]>;

  public types: string[] = [];
  public selectedTypeSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public selectedType$: Observable<string>;

  public excercisesSubject: BehaviorSubject<Excercise[]> = new BehaviorSubject<Excercise[]>([]);
  public excercises$: Observable<string[]>;
  public selectedExcerciseSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public selectedExcercise$: Observable<string>;

  public usernames: string[] = [];
  public selectedUsernameSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public selectedUsername$: Observable<string>;

  public groupedLogsSubject: BehaviorSubject<GroupedLog[]> = new BehaviorSubject<GroupedLog[]>([]);
  public groupedLogs$: Observable<GroupedLog[]>;

  public personalRecord$: Observable<ExcerciseRow | null>;

  public isGrouped: boolean = false;
  public isLoading: boolean = true;

  private readonly excerciseLogApiService = inject(ExcerciseLogApiService);

  public constructor() ***REMOVED***
    this.selectedType$ = this.selectedTypeSubject.pipe(
      startWith(null),
      pairwise(),
      tap(([oldValue, currentValue]) => ***REMOVED***
        if (oldValue === currentValue || !currentValue) ***REMOVED***
          return;
    ***REMOVED***
        const selectedExcercise = this.selectedExcerciseSubject.value;
        const selectedExcerciseType = this.excerciseRowsSubject.value.find(x => x.excerciseName === selectedExcercise)?.type;

        if (currentValue != selectedExcerciseType) ***REMOVED***
          this.selectedExcerciseSubject.next(null);
    ***REMOVED***
  ***REMOVED***),
      map(([, currentValue]) => currentValue ?? 'Type')
    );

    this.selectedExcercise$ = this.selectedExcerciseSubject.pipe(map(x => x ?? 'Excercise'));

    this.selectedUsername$ = this.selectedUsernameSubject.pipe(map(x => x ?? 'Username'));

    this.excercises$ = combineLatest([this.excercisesSubject, this.selectedTypeSubject]).pipe(
      map(([excercises, selectedType]) => (!selectedType ? excercises : excercises.filter(x => x.type === selectedType))),
      map(x => x.map(x => x.name))
    );

    this.excerciseRows$ = combineLatest([
      this.excerciseRowsSubject,
      this.selectedExcerciseSubject,
      this.selectedTypeSubject,
      this.selectedUsernameSubject,
    ]).pipe(
      map(([rows, selectedExcercise, selectedTypeSubject, selectedUsername]) =>
        R.pipe(
          rows,
          selectedTypeSubject ? R.filter(x => x.type === selectedTypeSubject) : R.identity,
          selectedExcercise ? R.filter(x => x.excerciseName === selectedExcercise) : R.identity,
          selectedUsername ? R.filter(x => x.username === selectedUsername) : R.identity
        )
      )
    );

    this.groupedLogs$ = combineLatest([
      this.groupedLogsSubject,
      this.selectedExcerciseSubject,
      this.selectedTypeSubject,
      this.selectedUsernameSubject,
    ]).pipe(
      map(([groups, selectedExcercise, selectedType, selectedUsername]) => ***REMOVED***
        const result = R.pipe(
          groups,
          R.map(([date, valuesByDate]) => ***REMOVED***
            const filteredValuesByDate = R.pipe(
              valuesByDate,
              R.filter(([username]) => (!selectedUsername ? true : selectedUsername === username)),
              R.map(([username, valuesByUsername]) => ***REMOVED***
                const filteredValuesByUsername = R.pipe(
                  valuesByUsername,
                  R.filter(([_excercise, row]) => (!selectedType ? true : row.type === selectedType)),
                  R.filter(([excercise]) => (!selectedExcercise ? true : excercise === selectedExcercise)),
                  R.filter(x => x.length > 0)
                );

                return [username, filteredValuesByUsername] as const;
          ***REMOVED***),
              R.filter(([_, x]) => x.length > 0)
            );

            return [date, filteredValuesByDate] as const;
      ***REMOVED***),
          R.filter(([_, x]) => x.length > 0)
        );

        return result;
  ***REMOVED***)
    );

    this.personalRecord$ = combineLatest([this.selectedUsernameSubject, this.selectedExcerciseSubject]).pipe(
      map(([username, excercise]) =>
        username && excercise ? getPersonalRecord(this.excerciseRowsSubject.value, excercise, username) : null
      )
    );
***REMOVED***

  public ngOnInit(): void ***REMOVED***
    this.isLoading = true;
    this.excerciseLogApiService
      .getExcerciseLogs()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(excerciseLogs => ***REMOVED***
        this.groupedLogsSubject.next(groupExcerciseLogs(excerciseLogs));
        this.excerciseRowsSubject.next(mapGroupedToExcerciseRows(this.groupedLogsSubject.value));

        this.types = R.pipe(
          excerciseLogs,
          R.map(x => x.type),
          R.uniq()
        );

        this.usernames = R.pipe(
          excerciseLogs,
          R.map(x => x.user),
          R.uniq()
        );

        const excercises = R.pipe(
          excerciseLogs,
          R.map(x => (***REMOVED*** name: x.name, type: x.type ***REMOVED***)),
          R.uniqBy(x => x.name)
        );

        this.excercisesSubject.next(excercises);
  ***REMOVED***);
***REMOVED***
***REMOVED***
