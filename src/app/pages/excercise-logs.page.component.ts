import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbDropdownModule, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject, Observable, OperatorFunction, Subject, combineLatest, merge } from 'rxjs';
import { delay, distinctUntilChanged, filter, finalize, map, pairwise, startWith, tap, withLatestFrom } from 'rxjs/operators';

import * as R from 'remeda';

import type { ExcerciseRow } from '@models/excercise-row.model';
import type { GroupedLog } from '@models/grouped-log.model';
import { IfNullEmptyArrayPipe } from '@pipes/if-null-empty-array.pipe';
import { ExcerciseRowsComponent } from '@components/excercise-rows.component';
import { GroupedExcerciseRowsComponent } from '@components/grouped-excercise-rows.component';
import { PersonalRecordComponent } from '@components/personal-record.component';
import { ExcerciseLogApiService } from '@services/excercise-log-api.service';
import { getMissingExcerciseNames, getPersonalRecord, groupExcerciseLogs, mapGroupedToExcerciseRows } from '@helpers/excercise-log.helper';

interface Excercise {
  name: string;
  type: string;
}

@Component({
  selector: 'app-excercise-logs-page',
  template: `
    <!-- #region FILTERS -->
    <div class="container my-4">
      <input
        type="text"
        class="form-control mb-2"
        placeholder="Excercise"
        [(ngModel)]="excerciseTypeAhead"
        (selectItem)="onExcerciseTypeaheadChange($any($event).item)"
        [ngbTypeahead]="search"
        (focus)="focus$.next($any($event).target.value)"
        (click)="click$.next($any($event).target.value); excerciseTypeAhead = ''"
        #instance="ngbTypeahead"
      />

      <div class="row mb-2 gx-2">
        <!-- #region DROPDOWN TYPE -->
        <div class="col-6">
          <div ngbDropdown class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-primary w-100 d-flex justify-content-between align-items-center" ngbDropdownToggle>
              {{ selectedType$ | async | titlecase }}
            </button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem (click)="selectedTypeSubject.next(null)">Clear filter</button>
              <button ngbDropdownItem *ngFor="let type of types" (click)="selectedTypeSubject.next(type)">
                {{ type | titlecase }}
              </button>
            </div>
          </div>
        </div>
        <!-- #endregion -->

        <!-- #region DROPDOWN EXCERCISE -->
        <div class="col-6">
          <div ngbDropdown class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-primary w-100 d-flex justify-content-between align-items-center" ngbDropdownToggle>
              {{ selectedExcercise$ | async | titlecase }}
            </button>
            <div ngbDropdownMenu class="w-100">
              <div style="overflow: scroll; max-height: 400px">
                <button ngbDropdownItem (click)="selectedExcerciseSubject.next(null)">Clear filter</button>
                <button ngbDropdownItem *ngFor="let excercise of excercises$ | async" (click)="selectedExcerciseSubject.next(excercise)">
                  {{ excercise | titlecase }}
                </button>
              </div>
              <div class="d-flex justify-content-center align-items-center border-top border-1">
                <i class="fa fa-caret-down"></i>
              </div>
            </div>
          </div>
        </div>
        <!-- #endregion -->
      </div>

      <div class="row mb-2">
        <!-- #region DROPDOWN NAME -->
        <div class="col-12">
          <div ngbDropdown class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-primary w-100 d-flex justify-content-between align-items-center" ngbDropdownToggle>
              {{ selectedUsername$ | async | titlecase }}
            </button>
            <div ngbDropdownMenu class="w-100">
              <button ngbDropdownItem (click)="selectedUsernameSubject.next(null)">Clear filter</button>
              <button ngbDropdownItem *ngFor="let username of usernames" (click)="selectedUsernameSubject.next(username)">
                {{ username | titlecase }}
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
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    AsyncPipe,
    TitleCasePipe,
    IfNullEmptyArrayPipe,
    PersonalRecordComponent,
    GroupedExcerciseRowsComponent,
    ExcerciseRowsComponent,
    NgbDropdownModule,
    NgbTypeahead,
  ],
})
export class ExcerciseLogsPageComponent {
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

  public excerciseTypeAhead: string = '';

  @ViewChild('instance', { static: true }) instance: NgbTypeahead | null = null;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  public onExcerciseTypeaheadChange(term: string): void {
    this.selectedExcerciseSubject.next(term);
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(
      delay(100),
      filter(() => !this.instance!.isPopupOpen()),
      map(x => '')
    );

    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      withLatestFrom(this.excercises$),
      map(([term, excercises]) => (term === '' ? excercises : excercises.filter(v => v.toLowerCase().includes(term.toLowerCase()))))
    );
  };

  private readonly excerciseLogApiService = inject(ExcerciseLogApiService);

  public constructor() {
    this.selectedType$ = this.selectedTypeSubject.pipe(
      startWith(null),
      pairwise(),
      tap(([oldValue, currentValue]) => {
        if (oldValue === currentValue || !currentValue) {
          return;
        }
        const selectedExcercise = this.selectedExcerciseSubject.value;
        const selectedExcerciseType = this.excerciseRowsSubject.value.find(x => x.excerciseName === selectedExcercise)?.type;

        if (currentValue != selectedExcerciseType) {
          this.selectedExcerciseSubject.next(null);
        }
      }),
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
      map(([groups, selectedExcercise, selectedType, selectedUsername]) => {
        const result = R.pipe(
          groups,
          R.map(([date, valuesByDate]) => {
            const filteredValuesByDate = R.pipe(
              valuesByDate,
              R.filter(([username]) => (!selectedUsername ? true : selectedUsername === username)),
              R.map(([username, valuesByUsername]) => {
                const filteredValuesByUsername = R.pipe(
                  valuesByUsername,
                  R.filter(([_excercise, row]) => (!selectedType ? true : row.type === selectedType)),
                  R.filter(([excercise]) => (!selectedExcercise ? true : excercise === selectedExcercise)),
                  R.filter(x => x.length > 0)
                );

                return [username, filteredValuesByUsername] as const;
              }),
              R.filter(([_, x]) => x.length > 0)
            );

            return [date, filteredValuesByDate] as const;
          }),
          R.filter(([_, x]) => x.length > 0)
        );

        return result;
      })
    );

    this.personalRecord$ = combineLatest([this.selectedUsernameSubject, this.selectedExcerciseSubject]).pipe(
      map(([username, excercise]) =>
        username && excercise ? getPersonalRecord(this.excerciseRowsSubject.value, excercise, username) : null
      )
    );
  }

  public ngOnInit(): void {
    this.isLoading = true;
    this.excerciseLogApiService
      .getExcerciseLogs()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(excerciseLogs => {
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
          R.map(x => ({ name: x.name, type: x.type })),
          R.uniqBy(x => x.name)
        );

        this.excercisesSubject.next(excercises);

        console.log(getMissingExcerciseNames(this.excerciseRowsSubject.value));
      });
  }
}
