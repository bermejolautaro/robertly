import ***REMOVED*** Component, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** RouterLinkActive, RouterLinkWithHref, RouterOutlet ***REMOVED*** from '@angular/router';
import ***REMOVED*** SwUpdate, VersionReadyEvent ***REMOVED*** from '@angular/service-worker';

import ***REMOVED*** filter, first, forkJoin, map, switchMap, tap ***REMOVED*** from 'rxjs';
import ***REMOVED*** LOGS_PATH, STATS_PATH ***REMOVED*** from 'src/main';

import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';

import ***REMOVED*** ExerciseLogApiService ***REMOVED*** from '@services/excercise-log-api.service';
import ***REMOVED*** DOCUMENT, NgClass, TitleCasePipe ***REMOVED*** from '@angular/common';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import ***REMOVED*** ExerciseLog ***REMOVED*** from '@models/excercise-log.model';
import ***REMOVED*** NgbDropdownModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';
import ***REMOVED*** ExerciseApiService ***REMOVED*** from '@services/exercises-api.service';
import ***REMOVED*** Exercise ***REMOVED*** from '@models/exercise.model';

const GET_DATA_CACHE_KEY = 'robertly-get-data-cache';
const EXERCISE_LOGS_CACHE_KEY = 'robertly-exercise-logs';
const EXERCISES_CACHE_KEY = 'robertly-exercises';

@Component(***REMOVED***
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: `
      nav.navbar.fixed-bottom ***REMOVED***
        padding-bottom: max(env(safe-area-inset-bottom), 0.8rem);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
  ***REMOVED***
    `,
  standalone: true,
  providers: [ExerciseLogService],
  imports: [NgClass, RouterLinkWithHref, RouterLinkActive, RouterOutlet, TitleCasePipe, NgbDropdownModule],
***REMOVED***)
export class AppComponent ***REMOVED***
  public readonly exerciseLogService = inject(ExerciseLogService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly exerciseApiService = inject(ExerciseApiService);
  private readonly serviceWorkerUpdates = inject(SwUpdate);
  private readonly document = inject(DOCUMENT);

  public readonly STATS_PATH = STATS_PATH;
  public readonly LOGS_PATH = LOGS_PATH;

  public constructor() ***REMOVED***
    dayjs.extend(customParseFormat);
    dayjs.extend(weekOfYear);
    dayjs.extend(isoWeek);

    const cacheTimestamp = localStorage.getItem(GET_DATA_CACHE_KEY);

    let shouldFetchExerciseLogs = false;

    if (!cacheTimestamp) ***REMOVED***
      localStorage.setItem(GET_DATA_CACHE_KEY, dayjs().unix().toString());
      shouldFetchExerciseLogs = true;
***REMOVED*** else ***REMOVED***
      const x = dayjs.unix(+cacheTimestamp);
      const difference = dayjs().diff(x, 'seconds');

      if (difference > 5 * 60) ***REMOVED***
        shouldFetchExerciseLogs = true;
        localStorage.setItem(GET_DATA_CACHE_KEY, dayjs().unix().toString());
  ***REMOVED***
***REMOVED***

    if (shouldFetchExerciseLogs) ***REMOVED***
      this.fetchData();
***REMOVED*** else ***REMOVED***
      const exerciseLogs: ExerciseLog[] = JSON.parse(localStorage.getItem(EXERCISE_LOGS_CACHE_KEY) ?? '[]');
      const exercises: Exercise[] = JSON.parse(localStorage.getItem(EXERCISES_CACHE_KEY) ?? '[]');
      this.exerciseLogService.updateLogs$.next(exerciseLogs);
      this.exerciseLogService.updateExercises$.next(exercises);
***REMOVED***

    this.serviceWorkerUpdates.unrecoverable.subscribe(x => console.error(x));

    this.serviceWorkerUpdates.versionUpdates
      .pipe(
        tap(x => console.log(x)),
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        first()
      )
      .subscribe(() => ***REMOVED***
        this.document.location.reload();
  ***REMOVED***);
***REMOVED***

  public fetchData(): void ***REMOVED***
    forkJoin([this.exerciseLogApiService.getExerciseLogs(), this.exerciseApiService.getExercises()]).subscribe(
      ([exerciseLogs, exercises]) => ***REMOVED***
        localStorage.setItem(EXERCISE_LOGS_CACHE_KEY, JSON.stringify(exerciseLogs));
        localStorage.setItem(EXERCISES_CACHE_KEY, JSON.stringify(exercises));
        this.exerciseLogService.updateLogs$.next(exerciseLogs);
        this.exerciseLogService.updateExercises$.next(exercises);
  ***REMOVED***
    );
***REMOVED***
***REMOVED***
