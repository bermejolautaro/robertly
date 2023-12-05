import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

import { filter, first, tap } from 'rxjs';
import { LOGS_PATH, STATS_PATH } from 'src/main';

import { ExerciseLogService } from '@services/excercise-log.service';

import { ExerciseLogApiService } from '@services/excercise-log-api.service';
import { getMissingExerciseNames } from '@helpers/excercise-log.helper';
import { DOCUMENT, TitleCasePipe } from '@angular/common';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import { ExerciseLog } from '@models/excercise-log.model';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

const GET_DATA_CACHE_KEY = 'get-data-cache';
const EXERCISE_CACHE_KEY = 'exercise-logs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: `
      nav.navbar.fixed-bottom {
        padding-bottom: max(env(safe-area-inset-bottom), 0.8rem);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
    `,
  standalone: true,
  providers: [ExerciseLogService],
  imports: [RouterLinkWithHref, RouterLinkActive, RouterOutlet, TitleCasePipe, NgbDropdownModule],
})
export class AppComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly serviceWorkerUpdates = inject(SwUpdate);
  private readonly document = inject(DOCUMENT);

  public readonly STATS_PATH = STATS_PATH;
  public readonly LOGS_PATH = LOGS_PATH;

  public constructor() {
    dayjs.extend(customParseFormat);
    dayjs.extend(weekOfYear);
    dayjs.extend(isoWeek);

    const cacheTimestamp = localStorage.getItem(GET_DATA_CACHE_KEY);

    let shouldFetchExerciseLogs = false;

    if (!cacheTimestamp) {
      localStorage.setItem(GET_DATA_CACHE_KEY, dayjs().unix().toString());
      shouldFetchExerciseLogs = true;
    } else {
      const x = dayjs.unix(+cacheTimestamp);
      const difference = dayjs().diff(x, 'seconds');

      if (difference > 5 * 60) {
        shouldFetchExerciseLogs = true;
        localStorage.setItem(GET_DATA_CACHE_KEY, dayjs().unix().toString());
      }
    }

    if (shouldFetchExerciseLogs) {
      this.fetchExerciseLogs();
    } else {
      const exerciseLogs: ExerciseLog[] = JSON.parse(localStorage.getItem(EXERCISE_CACHE_KEY) ?? '[]');
      this.exerciseLogService.updateLogs$.next(exerciseLogs);
    }

    console.log(getMissingExerciseNames(this.exerciseLogService.exerciseRows()));

    this.serviceWorkerUpdates.unrecoverable.subscribe(x => console.error(x));

    this.serviceWorkerUpdates.versionUpdates
      .pipe(
        tap(x => console.log(x)),
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        first()
      )
      .subscribe(() => {
        this.document.location.reload();
      });
  }

  public fetchExerciseLogs(): void {
    this.exerciseLogApiService.getExerciseLogs().subscribe(exerciseLogs => {
      localStorage.setItem(EXERCISE_CACHE_KEY, JSON.stringify(exerciseLogs));
      this.exerciseLogService.updateLogs$.next(exerciseLogs);
    });
  }
}
