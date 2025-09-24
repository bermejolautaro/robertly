import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DAY_JS } from 'src/main';
import * as R from 'remeda';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { RingComponent } from '@components/ring.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-series-per-muscle-page',
  template: `
    <div class="pb-4">
      <button
        [class.active]="period() === 'week'"
        class="btn me-1 badge rounded-pill chip"
        (click)="onClickPeriod('week')"
      >
        Week
      </button>
      <button
        [class.active]="period() === 'month'"
        class="btn me-1 badge rounded-pill chip"
        (click)="onClickPeriod('month')"
      >
        Month
      </button>
      <button
        [class.active]="period() === 'year'"
        class="btn me-1 badge rounded-pill chip"
        (click)="onClickPeriod('year')"
      >
        Year
      </button>
    </div>

    <ng-template
      #template
      let-date="date"
      let-groupedSeries="groupedSeries"
    >
      <div class="pb-4">
        <div class="pb-2 text-end">{{ date }}</div>
        <div class="series-per-muscle-grid">
          @for (series of groupedSeries; track $index) {
            @defer (on viewport) {
              <div class="d-flex justify-content-center align-items-center flex-column">
                <app-ring
                  [value]="series.totalSeries"
                  [maxValue]="series.targetValue"
                  size="s"
                ></app-ring>
                <div class="series-per-muscle-label">
                  {{ series.muscleGroup | titlecase }}
                </div>
              </div>
            } @placeholder {
              <div></div>
            }
          }
        </div>
      </div>
    </ng-template>

    @if (period() === 'week') {
      @for (value of seriesPerWeek(); track $index) {
        <ng-container
          *ngTemplateOutlet="template; context: { date: value.date, groupedSeries: value.groupedSeries }"
        ></ng-container>
      }
    }

    @if (period() === 'month') {
      @for (value of seriesPerMonth(); track $index) {
        <ng-container
          *ngTemplateOutlet="template; context: { date: value.date, groupedSeries: value.groupedSeries }"
        ></ng-container>
      }
    }

    @if (period() === 'year') {
      @for (value of seriesPerYear(); track $index) {
        <ng-container
          *ngTemplateOutlet="template; context: { date: value.date, groupedSeries: value.groupedSeries }"
        ></ng-container>
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

    .series-per-muscle-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      gap: 0.5rem 0.2rem;
    }

    .series-per-muscle-label {
      text-align: center;
      font-size: 12px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, NgbModalModule, FormsModule, ReactiveFormsModule, RingComponent, NgTemplateOutlet],
})
export class SeriesPerMusclePageComponent {
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dayjs = inject(DAY_JS);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public readonly seriesPerMuscle = rxResource({
    stream: () => this.exerciseLogApiService.getSeriesPerMuscle(),
  });

  public readonly period = signal<'week' | 'month' | 'year'>('week');

  public readonly seriesPerWeek = computed(() => {
    const seriesPerMuscle = this.seriesPerMuscle.value();

    if (!seriesPerMuscle) {
      return [];
    }

    return R.pipe(
      seriesPerMuscle.seriesPerMuscleWeekly,
      R.groupBy(x => `${x.year}-${x.week?.toString().padStart(2, '0')}`),
      R.entries(),
      R.map(([date, groupedSeries]) => ({
        date: `Week ${date.split('-')[1]} of ${date.split('-')[0]}`,
        groupedSeries,
      }))
    );
  });

  public readonly seriesPerMonth = computed(() => {
    const seriesPerMuscle = this.seriesPerMuscle.value();

    if (!seriesPerMuscle) {
      return [];
    }

    return R.pipe(
      seriesPerMuscle.seriesPerMuscleMonthly,
      R.groupBy(x => `${x.year?.toString()}-${x.month?.toString().padStart(2, '0')}-01`),
      R.entries(),
      R.map(([date, groupedSeries]) => ({
        date: this.titleCasePipe.transform(this.dayjs(date).format('MMMM[ - ]YYYY')),
        groupedSeries,
      }))
    );
  });

  public readonly seriesPerYear = computed(() => {
    const seriesPerMuscle = this.seriesPerMuscle.value();

    if (!seriesPerMuscle) {
      return [];
    }

    return R.pipe(
      seriesPerMuscle.seriesPerMuscleYearly,
      R.groupBy(x => ` ${x.year} `),
      R.entries(),
      R.map(([date, groupedSeries]) => ({
        date,
        groupedSeries,
      }))
    );
  });

  public constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(paramMap => {
      const period = paramMap.get('period');

      if (period === 'month') {
        this.period.set('month');
      } else if (period === 'year') {
        this.period.set('year');
      } else {
        this.period.set('week');
      }
    });
  }

  public onClickPeriod(period: 'week' | 'month' | 'year'): void {
    this.period.set(period);
    this.router.navigate([], {
      queryParams: { period },
    });
  }
}
