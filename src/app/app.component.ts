import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import * as R from 'remeda';

import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map, pairwise, startWith, tap } from 'rxjs/operators'

import { ExcerciseLog } from '@models/excercise-log.model';
import { ExcerciseLogApiService } from './services/excercise-log-api.service';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

dayjs.extend(customParseFormat)

type GroupedLog = readonly [string, Array<readonly [string, Array<[string, [ExcerciseLog, ...Array<ExcerciseLog>]]>]>];

interface Excercise {
  name: string;
  type: string;
}

interface ExcerciseRow {
  date: string;
  excerciseName: string;
  type: string;
  username: string;
  series: ExcerciseLog[];
  highlighted: boolean;
  total: number | null;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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
    private readonly serviceWorkerUpdates: SwUpdate) {

      this.serviceWorkerUpdates.versionUpdates.pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      ).subscribe(() => {
        document.location.reload();
      });

    this.selectedType$ = this.selectedTypeSubject.pipe(
      startWith(null),
      pairwise(),
      tap(([oldValue, currentValue]) => {
        if (oldValue !== currentValue) {
          this.selectedExcerciseSubject.next(null);
        }
      }),
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
      map(([rows, selectedExcercise, selectedTypeSubject, selectedUsername]) => {
        let result = rows;

        if (selectedTypeSubject) {
          result = R.filter(result, x => x.type === selectedTypeSubject);
        }

        if (selectedExcercise) {
          result = R.filter(result, x => x.excerciseName === selectedExcercise);
        }

        if (selectedUsername) {
          result = R.filter(result, x => x.username === selectedUsername)
        }

        return result;
      }))

    this.groupedLogs$ = combineLatest([
      this.groupedLogsSubject,
      this.selectedExcerciseSubject,
      this.selectedTypeSubject,
      this.selectedUsernameSubject
    ]).pipe(
      map(([groups, selectedExcercise, selectedTypeSubject, selectedUsername]) => {
        const result = R.pipe(
          groups,
          R.map(([date, v]) => {
            let x = v.filter(([username]) => {
              let result = true;

              if (selectedUsername) {
                result &&= username === selectedUsername
              }

              return result;
            }).map(([username, vv]) => {
              let y = vv.filter(([excercise]) => {
                let result = true;

                if (selectedExcercise) {
                  result &&= excercise === selectedExcercise;
                }

                return result;
              })

              return [username, y] as const;
            })

            return [date, x] as const;
          }),
          R.filter(([_, v]) => v.length > 0)
        )

        console.log(result);

        return result;
      }))
  }

  public ngOnInit(): void {
    this.excerciseLogApiService.getExcerciseLogs()
      .subscribe(excerciseLogs => {

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
          R.map(([date, v]) => v.map(([name, vv]) => vv.map(([excercise, log]) => ({
            date,
            username: name,
            excerciseName: excercise,
            type: R.first(log).type,
            series: log,
            highlighted: log.every(x => x.weightKg === R.first(log).weightKg) && log.every(x => x.reps >= 12),
            total: log.every(x => x.weightKg === R.first(log).weightKg) ? R.sumBy(log, x => x.reps) : null
          })))),
          R.flatMap(x => R.flatMap(x, y => y)),
          R.map(x => ({ ...x, date: dayjs(x.date, 'DD-MM-YYYY') })),
          R.sort((a, b) => a.date.isBefore(b.date) ? 1 : -1),
          R.map(x => ({ ...x, date: x.date.format('DD/MM/YYYY') }))
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
          R.map(x => ({ name: x.name, type: x.type })),
          R.uniqBy(x => x.name)
        );

        this.excercisesSubject.next(excercises);
      })
  }
}
