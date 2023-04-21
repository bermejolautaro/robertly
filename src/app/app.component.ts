import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import * as R from 'remeda';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import { BehaviorSubject, Observable, combineLatest, forkJoin } from 'rxjs';
import { distinctUntilChanged, map, pairwise, startWith, tap } from 'rxjs/operators'
import { AsyncPipe, NgClass, NgFor, TitleCasePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

dayjs.extend(customParseFormat)

interface ExcerciseLog {
  date: string;
  weightKg: number;
  name: string;
  reps: number;
  serie: number;
  type: string;
  user: string;
}

interface Excercise {
  name: string;
  type: string;
}

interface ExcerciseRow {
  date: string;
  excerciseName: string;
  type: string;
  username: string;
  series: ExcerciseLog[],
  highlighted: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HttpClientModule, AsyncPipe, NgFor, NgbModule, NgClass, TitleCasePipe]
})
export class AppComponent implements OnInit {
  public excerciseLogs: ExcerciseLog[] = [];

  public excerciseRows: ExcerciseRow[] = [];
  public excerciseRowsSubject: BehaviorSubject<ExcerciseRow[]> = new BehaviorSubject<ExcerciseRow[]>([]);
  public excerciseRows$: Observable<ExcerciseRow[]>;

  public excerciseLogsSubject: BehaviorSubject<ExcerciseLog[]> = new BehaviorSubject<ExcerciseLog[]>([]);
  public excerciseLogs$: Observable<ExcerciseLog[]> = this.excerciseLogsSubject.asObservable();

  public selectedTypeSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public selectedType$: Observable<string>;

  public selectedExcerciseSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public selectedExcercise$: Observable<string>;

  public excercisesSubject: BehaviorSubject<Excercise[]> = new BehaviorSubject<Excercise[]>([]);
  public excercises$: Observable<string[]>;

  public usernames: string[] = [];
  public selectedUsernameSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public selectedUsername$: Observable<string>;

  public types: string[] = [];


  public parsedData: Record<PropertyKey, Record<PropertyKey, Record<PropertyKey, [ExcerciseLog, ...ExcerciseLog[]]>>> = {};

  public constructor(private readonly http: HttpClient) {
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

    this.excerciseLogs$ = combineLatest([
      this.excerciseLogsSubject,
      this.selectedExcerciseSubject,
      this.selectedTypeSubject,
      this.selectedUsernameSubject
    ]).pipe(
      map(([logs, selectedExcercise, selectedTypeSubject, selectedUsername]) => {
        let result = logs;

        if (selectedTypeSubject) {
          result = R.filter(result, x => x.type === selectedTypeSubject);
        }

        if (selectedExcercise) {
          result = R.filter(result, x => x.name === selectedExcercise);
        }

        if (selectedUsername) {
          result = R.filter(result, x => x.user === selectedUsername)
        }

        return result;
      }))

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
  }

  public ngOnInit(): void {
    forkJoin([
      this.http.get<string[][]>('assets/lautaro.json'),
      this.http.get<string[][]>('assets/roberto.json'),
    ]).subscribe(([lautaroData, robertoData]) => {
      const parsedLautaroData: ExcerciseLog[] = this.processData(lautaroData).map(x => ({ ...x, user: 'lautaro' }));
      const parsedRobertoData: ExcerciseLog[] = this.processData(robertoData).map(x => ({ ...x, user: 'roberto' }));

      this.excerciseLogs = parsedLautaroData.concat(parsedRobertoData);

      this.parsedData = R.pipe(
        this.excerciseLogs,
        R.groupBy((item) => item.type),
        R.mapValues(x => R.pipe(
          x,
          R.groupBy(y => y.name),
          R.mapValues(y => R.groupBy(y, z => z.serie))
        ))
      )

      const result: ExcerciseRow[] = R.pipe(
        this.excerciseLogs,
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
        R.map(([date, v]) => v.map(([name, vv]) => vv.map(([excercise, vvv]) => ({
          date,
          username: name,
          excerciseName: excercise,
          type: vvv[0].type,
          series: vvv,
          highlighted: vvv.every(x => x.weightKg === vvv[0].weightKg) && vvv.every(x => x.reps >= 12)
        })))),
        R.flatMap(x => R.flatMap(x, y => y)),
        R.map(x => ({ ...x, date: dayjs(x.date, 'DD-MM-YYYY') })),
        R.sort((a, b) => a.date.isBefore(b.date) ? 1 : -1),
        R.map(x => ({ ...x, date: x.date.format('DD/MM/YYYY') }))
      );

      this.excerciseRows = result;
      this.excerciseRowsSubject.next(result);

      this.types = R.pipe(
        this.excerciseLogs,
        R.map(x => x.type),
        R.uniq()
      );

      this.usernames = R.pipe(
        this.excerciseLogs,
        R.map(x => x.user),
        R.uniq()
      );

      const excercises = R.pipe(
        this.excerciseLogs,
        R.map(x => ({ name: x.name, type: x.type })),
        R.uniqBy(x => x.name)
      );

      this.excercisesSubject.next(excercises);
      this.excerciseLogsSubject.next(this.excerciseLogs);
    })
  }

  public processData(data: string[][]): ExcerciseLog[] {
    const result = [];

    for (let i = 0; i < data.length; i++) {
      const prevRow = data[i - 1];
      const row = data[i];
      const nextRow = data[i + 1];

      for (let j = 0; j < row.length; j++) {
        const element = row[j]

        const isHeader = j === 0 && (i === 0 || ((prevRow.length === 0 || prevRow[0] === '') && (nextRow.length === 0 || nextRow[0] === '')));
        const isExerciseName = j === 0 && !isHeader && !!element

        if (isHeader) {
          result.push({ header: true, value: element, row: i, col: j });
        } else if (isExerciseName) {
          result.push({ header: false, value: element, row: i, col: j });
        }
      }
    }

    const result2 = [];

    const dateRowIndexByType: Record<string, number> = {};

    let lastHeader = '';

    for (const element of result) {

      if (element.header) {
        dateRowIndexByType[element.value] = element.row + 1;
        lastHeader = element.value;
      } else {
        result2.push({
          value: element.value,
          row: element.row,
          col: element.col,
          type: lastHeader
        })
      }
    }

    const result3 = [];

    for (const element of result2) {
      const dateRowIndex = dateRowIndexByType[element.type]

      for (let i = 1; i < data[dateRowIndex].length; i++) {
        const repsString = data[element.row][i];
        const series = repsString?.split('|') ?? '';

        for (let j = 0; j < series.length; j++) {
          const serie = series[j];
          const [kg, reps] = serie.split('-');
          result3.push({
            type: element.type.toLowerCase(),
            name: element.value.toLowerCase(),
            date: data[dateRowIndex][i],
            serie: j + 1,
            weightKg: Number(kg.replace(',', '.')),
            reps: Number(reps),
            user: ''
          })
        }

      }
    }

    return result3;
  }
}
