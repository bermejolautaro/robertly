import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DAY_JS } from 'src/main';
import * as R from 'remeda';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { SeriesPerMuscleRow } from '@models/series-per-muscle';
import { ExerciseApiService } from '@services/exercises-api.service';
import { RingComponent } from '@components/ring.component';

function calculateTarget(muscleGroup: string) {
  switch (muscleGroup) {
    case 'biceps':
    case 'triceps':
    case 'calves':
    case 'shoulders':
      return 6;
    case 'back':
    case 'legs':
    case 'chest':
      return 10;
    case 'forearms':
    case 'glutes':
      return 3;
    default:
      return 10;
  }
}

@Component({
  selector: 'app-series-per-muscle-page',
  template: `
    <div class="pb-4">
      <button
        [class.active]="period() === 'week'"
        class="btn me-1 badge rounded-pill chip"
        (click)="period.set('week')"
      >
        Week
      </button>
      <button
        [class.active]="period() === 'month'"
        class="btn me-1 badge rounded-pill chip"
        (click)="period.set('month')"
      >
        Month
      </button>
      <button
        [class.active]="period() === 'year'"
        class="btn me-1 badge rounded-pill chip"
        (click)="period.set('year')"
      >
        Year
      </button>
    </div>

    @if (period() === 'week') {
      @for (keyvalue of seriesPerWeek(); track $index) {
        <div class="pb-4">
          <div class="pb-2 text-end">{{ keyvalue[0] }}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 0.5rem 0.2rem">
            @for (series of keyvalue[1]; track $index) {
              @defer (on viewport) {
                <div class="d-flex justify-content-center align-items-center flex-column">
                  <app-ring
                    [value]="series.totalSeries"
                    [maxValue]="series.target * 1"
                    size="s"
                  ></app-ring>
                  <div style="text-align: center; font-size: 12px">
                    {{ series.muscleGroup | titlecase }}
                  </div>
                </div>
              } @placeholder {
                <div></div>
              }
            }
          </div>
        </div>
      }
    }

    @if (period() === 'month') {
      @for (keyvalue of seriesPerMonth(); track $index) {
        <div class="pb-4">
          <div class="pb-2 text-end">{{ keyvalue[0] }}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 0.5rem 0.2rem">
            @for (series of keyvalue[1]; track $index) {
              @defer (on viewport) {
                <div class="d-flex justify-content-center align-items-center flex-column">
                  <app-ring
                    [value]="series.totalSeries"
                    [maxValue]="series.target * 4"
                    size="s"
                  ></app-ring>
                  <div style="text-align: center; font-size: 12px">
                    {{ series.muscleGroup | titlecase }}
                  </div>
                </div>
              } @placeholder {
                <div></div>
              }
            }
          </div>
        </div>
      }
    }

    @if (period() === 'year') {
      @for (keyvalue of seriesPerYear(); track $index) {
        <div class="pb-4">
          <div class="pb-2 text-end">{{ keyvalue[0] }}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 0.5rem 0.2rem">
            @for (series of keyvalue[1]; track $index) {
              @defer (on viewport) {
                <div class="d-flex justify-content-center align-items-center flex-column">
                  <app-ring
                    [value]="series.totalSeries"
                    [maxValue]="series.target * 52"
                    size="s"
                  ></app-ring>
                  <div style="text-align: center; font-size: 12px">
                    {{ series.muscleGroup | titlecase }}
                  </div>
                </div>
              } @placeholder {
                <div></div>
              }
            }
          </div>
        </div>
      }
    }
  `,
  styles: `
    .badge.chip {
      font-size: 16px;
      font-weight: 400;

      &.active {
        --bs-btn-active-border-color: transparent;
        --bs-btn-active-bg: var(--primary);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, NgbModalModule, FormsModule, ReactiveFormsModule, RingComponent],
})
export class SeriesPerMusclePageComponent {
  private readonly router = inject(Router);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly dayjs = inject(DAY_JS);
  private readonly exercisesApiService = inject(ExerciseApiService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public readonly seriesPerMuscle = rxResource({
    loader: () => this.exerciseLogApiService.getSeriesPerMuscle(),
  });

  private readonly defaultValues = linkedSignal<SeriesPerMuscleRow[]>(() =>
    this.exercisesApiService.muscleGroups().map(x => ({
      totalSeries: 0,
      muscleGroup: x ?? '',
      firstDateInPeriod: '',
      month: 0,
      week: 0,
      year: 0,
      target: calculateTarget(x),
    }))
  );

  public readonly period = signal<'week' | 'month' | 'year'>('week');

  public readonly seriesPerWeek = signal<[key: string, value: SeriesPerMuscleRow[]][]>([]);
  public readonly seriesPerMonth = signal<[key: string, value: SeriesPerMuscleRow[]][]>([]);
  public readonly seriesPerYear = signal<[key: string, value: SeriesPerMuscleRow[]][]>([]);

  readonly #onFetchSeriesPerMuscle = effect(() => {
    const seriesPerMuscle = this.seriesPerMuscle.value();

    if (seriesPerMuscle) {
      const perWeek = R.pipe(
        seriesPerMuscle.seriesPerMuscleWeekly,
        R.groupBy(x => `${x.year}-${x.week.toString().padStart(2, '0')}`),
        R.mapValues(x => {
          const result = this.defaultValues().map(defaultValue => {
            const row = x.find(z => z.muscleGroup === defaultValue.muscleGroup);

            if (row) {
              return { ...row, target: defaultValue.target };
            }

            return defaultValue;
          });

          return result;
        }),
        R.entries(),
        R.sortBy(x => x[0]),
        R.reverse(),
        R.map(x => [`Week ${x[0].split('-')[1]} of ${x[0].split('-')[0]}`, x[1]] as [string, SeriesPerMuscleRow[]])
      );

      const perYear = R.pipe(
        seriesPerMuscle.seriesPerMuscleYearly,
        R.groupBy(x => `${x.year}`),
        R.mapValues(x => {
          const result = this.defaultValues().map(defaultValue => {
            const row = x.find(z => z.muscleGroup === defaultValue.muscleGroup);

            if (row) {
              return { ...row, target: defaultValue.target };
            }

            return defaultValue;
          });

          return result;
        }),
        R.entries(),
        R.sortBy(x => x[0]),
        R.reverse()
      );

      const perMonth = R.pipe(
        seriesPerMuscle.seriesPerMuscleMonthly,
        R.groupBy(x => `${x.year.toString()}-${x.month.toString().padStart(2, '0')}-01`),
        R.mapValues(x => {
          const result = this.defaultValues().map(defaultValue => {
            const row = x.find(z => z.muscleGroup === defaultValue.muscleGroup);

            if (row) {
              return { ...row, target: defaultValue.target };
            }

            return defaultValue;
          });

          return result;
        }),
        R.entries(),
        R.sortBy(x => x[0]),
        R.reverse(),
        R.map(
          x =>
            [this.titleCasePipe.transform(this.dayjs(x[0]).format('MMM[ - ]YYYY')), x[1]] as [
              string,
              SeriesPerMuscleRow[],
            ]
        )
      );

      this.seriesPerWeek.set(perWeek);
      this.seriesPerMonth.set(perMonth);
      this.seriesPerYear.set(perYear);
    }
  });
}
