import ***REMOVED*** Component, OnInit ***REMOVED*** from '@angular/core';
import ***REMOVED*** SwUpdate, VersionReadyEvent ***REMOVED*** from '@angular/service-worker';

import * as R from 'remeda';

import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';

import ***REMOVED*** BehaviorSubject, Observable, combineLatest ***REMOVED*** from 'rxjs';
import ***REMOVED*** filter, finalize, map, pairwise, startWith, take, tap ***REMOVED*** from 'rxjs/operators';

import ***REMOVED*** type ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** type GroupedLog ***REMOVED*** from '@models/grouped-log.model';
import ***REMOVED*** type ExcerciseName, MUSCLE_GROUP_PER_EXCERCISE***REMOVED*** from '@models/constants';
import ***REMOVED*** ExcerciseLogApiService ***REMOVED*** from '@services/excercise-log-api.service';
import ***REMOVED*** parseAndCompare ***REMOVED*** from '@helpers/date.helper';

dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);

interface Excercise ***REMOVED***
  name: string;
  type: string;
***REMOVED***

@Component(***REMOVED***
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
***REMOVED***)
export class AppComponent implements OnInit ***REMOVED***
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

  public constructor(private readonly excerciseLogApiService: ExcerciseLogApiService, private readonly serviceWorkerUpdates: SwUpdate) ***REMOVED***
    this.serviceWorkerUpdates.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        take(1)
      )
      .subscribe(() => ***REMOVED***
        document.location.reload();
  ***REMOVED***);

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
      map(([rows, selectedExcercise, selectedTypeSubject, selectedUsername]) => ***REMOVED***
        let result = rows;

        if (selectedTypeSubject) ***REMOVED***
          result = R.filter(result, x => x.type === selectedTypeSubject);
    ***REMOVED***

        if (selectedExcercise) ***REMOVED***
          result = R.filter(result, x => x.excerciseName === selectedExcercise);
    ***REMOVED***

        if (selectedUsername) ***REMOVED***
          result = R.filter(result, x => x.username === selectedUsername);
    ***REMOVED***

        return result;
  ***REMOVED***)
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
        const groupedLogs = R.pipe(
          excerciseLogs,
          R.groupBy(x => x.date),
          R.mapValues((x, date) =>
            R.pipe(
              x,
              R.groupBy(y => y.user),
              R.mapValues((y, username) =>
                R.pipe(
                  y,
                  R.groupBy(z => z.name),
                  R.mapValues((series, excerciseName) => (***REMOVED***
                    date: date.toString(),
                    username: username.toString(),
                    excerciseName: excerciseName.toString(),
                    type: R.first(series).type,
                    series: [...series],
                    highlighted: series.every(x => x.weightKg === R.first(series).weightKg)
                      ? series.every(x => x.reps >= 12)
                        ? ('green' as const)
                        : series.every(x => x.reps >= 8)
                        ? ('yellow' as const)
                        : null
                      : null,
                    muscleGroup: MUSCLE_GROUP_PER_EXCERCISE[excerciseName as ExcerciseName],
                    total: series.every(x => x.weightKg === R.first(series).weightKg) ? R.sumBy(series, x => x.reps) : null,
              ***REMOVED***)),
                  R.toPairs
                )
              ),
              R.toPairs
            )
          ),
          R.toPairs,
          R.sort(([a], [b]) => parseAndCompare(a, b))
        );

        this.groupedLogsSubject.next(groupedLogs);

        const excerciseRows = R.pipe(
          groupedLogs,
          R.flatMap(([_, v]) => v.flatMap(([_, vv]) => vv.flatMap(([_, vvv]) => vvv))),
          R.sort((a, b) => parseAndCompare(a.date, b.date))
        );

        // const x = R.pipe(
        //   excerciseRows,
        //   R.groupBy(row => dayjs(row.date, 'DD/MM/YYYY').week()),
        //   R.mapValues(x =>
        //     R.pipe(
        //       x,
        //       R.groupBy(y => y.username),
        //       R.mapValues(y => R.pipe(
        //         y,
        //         R.groupBy(z => z.muscleGroup),
        //         R.mapValues(h => R.pipe(
        //           h,
        //           R.map(x => x.series.length),
        //           R.sumBy(g => g)
        //         ))
        //       )),
        //     )
        //   )
        // );

        this.excerciseRowsSubject.next(excerciseRows);

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

function getPersonalRecord(rows: ExcerciseRow[], excerciseName: string, username: string): ExcerciseRow | null ***REMOVED***
  const result = R.pipe(
    rows,
    R.filter(x => x.username === username && x.excerciseName === excerciseName),
    R.sort(
      (a, b) =>
        R.first(R.sort(b.series, (aa, bb) => bb.weightKg - aa.weightKg))!.weightKg -
        R.first(R.sort(a.series, (aa, bb) => bb.weightKg - aa.weightKg))!.weightKg
    ),
    R.first()
  );

  return result ?? null;
***REMOVED***
