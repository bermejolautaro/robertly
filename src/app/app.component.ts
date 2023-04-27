import ***REMOVED*** Component, OnInit ***REMOVED*** from '@angular/core';
import ***REMOVED*** HttpClient, HttpClientModule ***REMOVED*** from '@angular/common/http'
import * as R from 'remeda';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import ***REMOVED*** BehaviorSubject, Observable, combineLatest, forkJoin ***REMOVED*** from 'rxjs';
import ***REMOVED*** map, pairwise, startWith, tap ***REMOVED*** from 'rxjs/operators'
import ***REMOVED*** AsyncPipe, NgClass, NgFor, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** NgbModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

dayjs.extend(customParseFormat)

interface ExcerciseLog ***REMOVED***
  date: string;
  weightKg: number;
  name: string;
  reps: number;
  serie: number;
  type: string;
  user: string;
***REMOVED***

interface Excercise ***REMOVED***
  name: string;
  type: string;
***REMOVED***

interface ExcerciseRow ***REMOVED***
  date: string;
  excerciseName: string;
  type: string;
  username: string;
  series: ExcerciseLog[],
  highlighted: boolean
***REMOVED***

@Component(***REMOVED***
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
***REMOVED***)
export class AppComponent implements OnInit ***REMOVED***
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


  public parsedData: Record<PropertyKey, Record<PropertyKey, Record<PropertyKey, [ExcerciseLog, ...ExcerciseLog[]]>>> = ***REMOVED******REMOVED***;

  public constructor(private readonly http: HttpClient) ***REMOVED***
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

    this.excerciseLogs$ = combineLatest([
      this.excerciseLogsSubject,
      this.selectedExcerciseSubject,
      this.selectedTypeSubject,
      this.selectedUsernameSubject
    ]).pipe(
      map(([logs, selectedExcercise, selectedTypeSubject, selectedUsername]) => ***REMOVED***
        let result = logs;

        if (selectedTypeSubject) ***REMOVED***
          result = R.filter(result, x => x.type === selectedTypeSubject);
    ***REMOVED***

        if (selectedExcercise) ***REMOVED***
          result = R.filter(result, x => x.name === selectedExcercise);
    ***REMOVED***

        if (selectedUsername) ***REMOVED***
          result = R.filter(result, x => x.user === selectedUsername)
    ***REMOVED***

        return result;
  ***REMOVED***))

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
***REMOVED***

  public ngOnInit(): void ***REMOVED***
    this.http.get<***REMOVED*** lautaro: string[][], roberto: string[][] ***REMOVED***>('https://gym-nodejs-excel-bermejolautaro.vercel.app/api/get-data')
      .subscribe(data => ***REMOVED***
        const parsedLautaroData: ExcerciseLog[] = this.processData(data.lautaro).map(x => (***REMOVED*** ...x, user: 'lautaro' ***REMOVED***));
        const parsedRobertoData: ExcerciseLog[] = this.processData(data.roberto).map(x => (***REMOVED*** ...x, user: 'roberto' ***REMOVED***));

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
          R.map(([date, v]) => v.map(([name, vv]) => vv.map(([excercise, vvv]) => (***REMOVED***
            date,
            username: name,
            excerciseName: excercise,
            type: vvv[0].type,
            series: vvv,
            highlighted: vvv.every(x => x.weightKg === vvv[0].weightKg) && vvv.every(x => x.reps >= 12)
      ***REMOVED***)))),
          R.flatMap(x => R.flatMap(x, y => y)),
          R.map(x => (***REMOVED*** ...x, date: dayjs(x.date, 'DD-MM-YYYY') ***REMOVED***)),
          R.sort((a, b) => a.date.isBefore(b.date) ? 1 : -1),
          R.map(x => (***REMOVED*** ...x, date: x.date.format('DD/MM/YYYY') ***REMOVED***))
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
          R.map(x => (***REMOVED*** name: x.name, type: x.type ***REMOVED***)),
          R.uniqBy(x => x.name)
        );

        this.excercisesSubject.next(excercises);
        this.excerciseLogsSubject.next(this.excerciseLogs);
  ***REMOVED***)
***REMOVED***

  public processData(data: string[][]): ExcerciseLog[] ***REMOVED***
    const result = [];

    for (let i = 0; i < data.length; i++) ***REMOVED***
      const prevRow = data[i - 1];
      const row = data[i];
      const nextRow = data[i + 1];

      for (let j = 0; j < row.length; j++) ***REMOVED***
        const element = row[j]

        const isHeader = j === 0 && (i === 0 || ((prevRow.length === 0 || prevRow[0] === '') && (nextRow.length === 0 || nextRow[0] === '')));
        const isExerciseName = j === 0 && !isHeader && !!element

        if (isHeader) ***REMOVED***
          result.push(***REMOVED*** header: true, value: element, row: i, col: j ***REMOVED***);
    ***REMOVED*** else if (isExerciseName) ***REMOVED***
          result.push(***REMOVED*** header: false, value: element, row: i, col: j ***REMOVED***);
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    const result2 = [];

    const dateRowIndexByType: Record<string, number> = ***REMOVED******REMOVED***;

    let lastHeader = '';

    for (const element of result) ***REMOVED***

      if (element.header) ***REMOVED***
        dateRowIndexByType[element.value] = element.row + 1;
        lastHeader = element.value;
  ***REMOVED*** else ***REMOVED***
        result2.push(***REMOVED***
          value: element.value,
          row: element.row,
          col: element.col,
          type: lastHeader
    ***REMOVED***)
  ***REMOVED***
***REMOVED***

    const result3 = [];

    for (const element of result2) ***REMOVED***
      const dateRowIndex = dateRowIndexByType[element.type]

      for (let i = 1; i < data[dateRowIndex].length; i++) ***REMOVED***
        const repsString = data[element.row][i];
        const series = repsString?.split('|') ?? '';

        for (let j = 0; j < series.length; j++) ***REMOVED***
          const serie = series[j];
          const [kg, reps] = serie.split('-');
          result3.push(***REMOVED***
            type: element.type.toLowerCase(),
            name: element.value.toLowerCase(),
            date: data[dateRowIndex][i],
            serie: j + 1,
            weightKg: Number(kg.replace(',', '.')),
            reps: Number(reps),
            user: ''
      ***REMOVED***)
    ***REMOVED***

  ***REMOVED***
***REMOVED***

    return result3;
***REMOVED***
***REMOVED***
