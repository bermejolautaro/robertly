import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressBarComponent } from '@components/progress-bar.component';
import { DaysTrainedRow } from '@models/days-trained';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { DAY_JS } from 'src/main';

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

    @let daysTrainedValue = daysTrained.value();
    @if (daysTrainedValue) {
      @if (period() === 'week') {
        @for (value of daysTrainedValue.daysTrainedWeekly; track $index) {
          <div class="pb-4">
            <div style="display: grid; grid-template-columns: 1fr; gap: 0.5rem 0.2rem">
              <app-progress-bar
                [current]="value.daysTrained"
                [goal]="4"
                [IsExcessInterpretedAsNegative]="false"
                label="Week {{ value.week }} of {{ value.year }}"
              ></app-progress-bar>
            </div>
          </div>
        }
      }

      @if (period() === 'month') {
        @for (value of daysTrainedValue.daysTrainedMonthly; track $index) {
          <div class="pb-4">
            <div style="display: grid; grid-template-columns: 1fr; gap: 0.5rem 0.2rem">
              <app-progress-bar
                [current]="value.daysTrained"
                [goal]="4 * 4"
                [IsExcessInterpretedAsNegative]="false"
                [label]="getMonthLabel(value)"
              ></app-progress-bar>
            </div>
          </div>
        }
      }

      @if (period() === 'year') {
        @for (value of daysTrainedValue.daysTrainedYearly; track $index) {
          <div class="pb-4">
            <div style="display: grid; grid-template-columns: 1fr; gap: 0.5rem 0.2rem">
              <app-progress-bar
                [current]="value.daysTrained"
                [goal]="4 * 52"
                [IsExcessInterpretedAsNegative]="false"
                label="{{ value.year }}"
              ></app-progress-bar>
            </div>
          </div>
        }
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
  imports: [ProgressBarComponent],
})
export class DaysTrainedPageComponent {
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dayjs = inject(DAY_JS);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public readonly period = signal<'week' | 'month' | 'year'>('week');

  public readonly daysTrained = rxResource({
    stream: () => this.exerciseLogApiService.getDaysTrained2(),
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

  public getMonthLabel(row: DaysTrainedRow): string {
    return this.titleCasePipe.transform(this.dayjs(`${row.year}-${row.month}-01`).format('MMMM[ - ]YYYY'));
  }

  public onClickPeriod(period: 'week' | 'month' | 'year'): void {
    this.period.set(period);
    this.router.navigate([], {
      queryParams: { period },
    });
  }
}
