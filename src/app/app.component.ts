import ***REMOVED*** Component, OnInit ***REMOVED*** from '@angular/core';
import ***REMOVED*** HttpClient ***REMOVED*** from '@angular/common/http'

import * as R from 'remeda';

import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

import ***REMOVED*** BehaviorSubject, Observable, combineLatest ***REMOVED*** from 'rxjs';
import ***REMOVED*** filter, map, pairwise, startWith, tap ***REMOVED*** from 'rxjs/operators'

import ***REMOVED*** ExcerciseLog ***REMOVED*** from '@models/excercise-log.model';
import ***REMOVED*** ExcerciseLogApiService ***REMOVED*** from './services/excercise-log-api.service';
import ***REMOVED*** SwUpdate, VersionReadyEvent ***REMOVED*** from '@angular/service-worker';

dayjs.extend(customParseFormat)

type GroupedLog = readonly [string, Array<readonly [string, Array<[string, [ExcerciseLog, ...Array<ExcerciseLog>]]>]>];

interface Excercise ***REMOVED***
  name: string;
  type: string;
***REMOVED***

interface ExcerciseRow ***REMOVED***
  date: string;
  excerciseName: string;
  type: string;
  username: string;
  series: ExcerciseLog[];
  highlighted: boolean;
  total: number | null;
***REMOVED***

@Component(***REMOVED***
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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

  public isGrouped: boolean = false;

  public constructor(
    private readonly excerciseLogApiService: ExcerciseLogApiService,
    private readonly serviceWorkerUpdates: SwUpdate) ***REMOVED***

      this.serviceWorkerUpdates.versionUpdates.pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      ).subscribe(() => ***REMOVED***
        document.location.reload();
  ***REMOVED***);

    this.selectedType$ = this.selectedTypeSubject.pipe(
      startWith(null),
      pairwise(),
      tap(([oldValue, currentValue]) => ***REMOVED***
        if (oldValue !== currentValue) ***REMOVED***
          this.selectedExcerciseSubject.next(null);
    ***REMOVED***
  ***REMOVED***),
      map(([, currentValue]) => currentValue ?? 'Type'),
    );

    this.selectedExcercise$ = this.selectedExcerciseSubject.pipe(
      map(x => x ?? 'Excercise'),
    );

    this.selectedUsername$ = this.selectedUsernameSubject.pipe(
      map(x => x ?? 'Username')
    );

    this.excercises$ = combineLatest([
      this.excercisesSubject,
      this.selectedTypeSubject
    ]).pipe(
      map(([excercises, selectedType]) => !selectedType ? excercises : excercises.filter(x => x.type === selectedType)),
      map(x => x.map(x => x.name)),
    )

    this.excerciseRows$ = combineLatest([
      this.excerciseRowsSubject,
      this.selectedExcerciseSubject,
      this.selectedTypeSubject,
      this.selectedUsernameSubject
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
          result = R.filter(result, x => x.username === selectedUsername)
    ***REMOVED***

        return result;
  ***REMOVED***))

    this.groupedLogs$ = combineLatest([
      this.groupedLogsSubject,
      this.selectedExcerciseSubject,
      this.selectedTypeSubject,
      this.selectedUsernameSubject
    ]).pipe(
      map(([groups, selectedExcercise, selectedTypeSubject, selectedUsername]) => ***REMOVED***
        const result = R.pipe(
          groups,
          R.map(([date, v]) => ***REMOVED***
            let x = v.filter(([username]) => ***REMOVED***
              let result = true;

              if (selectedUsername) ***REMOVED***
                result &&= username === selectedUsername
          ***REMOVED***

              return result;
        ***REMOVED***).map(([username, vv]) => ***REMOVED***
              let y = vv.filter(([excercise]) => ***REMOVED***
                let result = true;

                if (selectedExcercise) ***REMOVED***
                  result &&= excercise === selectedExcercise;
            ***REMOVED***

                return result;
          ***REMOVED***)

              return [username, y] as const;
        ***REMOVED***)

            return [date, x] as const;
      ***REMOVED***),
          R.filter(([_, v]) => v.length > 0)
        )

        console.log(result);

        return result;
  ***REMOVED***))
***REMOVED***

  public ngOnInit(): void ***REMOVED***
    this.excerciseLogApiService.getExcerciseLogs()
      .subscribe(excerciseLogs => ***REMOVED***

        const groupedLogs = R.pipe(
          excerciseLogs,
          R.groupBy(x => x.date),
          R.mapValues(x => R.pipe(
            x,
            R.groupBy(y => y.user),
            R.mapValues(y => R.pipe(
              y,
              R.groupBy(z => z.name),
              R.toPairs
            )),
            R.toPairs
          )),
          R.toPairs,
          R.sort(([dateA], [dateB]) => dayjs(dateA, 'DD-MM-YYYY').isBefore(dayjs(dateB, 'DD-MM-YYYY')) ? 1 : -1)
        );

        this.groupedLogsSubject.next(groupedLogs)

        const excerciseRows = R.pipe(
          groupedLogs,
          R.map(([date, v]) => v.map(([name, vv]) => vv.map(([excercise, log]) => (***REMOVED***
            date,
            username: name,
            excerciseName: excercise,
            type: R.first(log).type,
            series: log,
            highlighted: log.every(x => x.weightKg === R.first(log).weightKg) && log.every(x => x.reps >= 12),
            total: log.every(x => x.weightKg === R.first(log).weightKg) ? R.sumBy(log, x => x.reps) : null
      ***REMOVED***)))),
          R.flatMap(x => R.flatMap(x, y => y)),
          R.map(x => (***REMOVED*** ...x, date: dayjs(x.date, 'DD-MM-YYYY') ***REMOVED***)),
          R.sort((a, b) => a.date.isBefore(b.date) ? 1 : -1),
          R.map(x => (***REMOVED*** ...x, date: x.date.format('DD/MM/YYYY') ***REMOVED***))
        );

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
  ***REMOVED***)
***REMOVED***
***REMOVED***
