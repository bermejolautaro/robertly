import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from '@angular/core';

import { DOCUMENT, TitleCasePipe } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RingComponent } from '@components/ring.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { DAY_JS } from 'src/main';
import { SeriesPerMuscleRow } from '@models/series-per-muscle';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbNavModule, RingComponent, TitleCasePipe],
})
export class StatsPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly dayjs = inject(DAY_JS);
  public readonly exerciseLogApiService = inject(ExerciseLogApiService);

  private readonly defaultValues: SeriesPerMuscleRow[] = [
    { totalSeries: 0, muscleGroup: 'arms', firstDateInPeriod: '', month: 0, week: 0, year: 0 },
    { totalSeries: 0, muscleGroup: 'back', firstDateInPeriod: '', month: 0, week: 0, year: 0 },
    { totalSeries: 0, muscleGroup: 'calves', firstDateInPeriod: '', month: 0, week: 0, year: 0 },
    { totalSeries: 0, muscleGroup: 'chest', firstDateInPeriod: '', month: 0, week: 0, year: 0 },
    { totalSeries: 0, muscleGroup: 'legs', firstDateInPeriod: '', month: 0, week: 0, year: 0 },
    { totalSeries: 0, muscleGroup: 'shoulders', firstDateInPeriod: '', month: 0, week: 0, year: 0 },
  ];

  public seriesPerWeek = signal<SeriesPerMuscleRow[]>(this.defaultValues);
  public seriesPerMonth = signal<SeriesPerMuscleRow[]>(this.defaultValues);
  public seriesPerYear = signal<SeriesPerMuscleRow[]>(this.defaultValues);

  public readonly seriesPerMuscle = rxResource({
    loader: () => this.exerciseLogApiService.getSeriesPerMuscle(),
  });

  readonly #onFetchSeriesPerMuscle = effect(() => {
    const seriesPerMuscle = this.seriesPerMuscle.value();

    if (seriesPerMuscle) {
      const currentYear = this.dayjs().year();
      const currentMonth = this.dayjs().month() + 1;
      const currentWeek = this.dayjs().week();

      const perWeek = seriesPerMuscle.seriesPerMuscleWeekly.filter(
        x => x.week === currentWeek && x.year === currentYear
      );

      const perMonth = seriesPerMuscle.seriesPerMuscleMonthly.filter(
        x => x.month === currentMonth && x.year === currentYear
      );

      const perYear = seriesPerMuscle.seriesPerMuscleYearly.filter(x => x.year === currentYear);

      if (perWeek.length) {
        this.seriesPerWeek.set(perWeek);
      }

      if (perMonth) {
        this.seriesPerMonth.set(perMonth);
      }

      if (perYear) {
        this.seriesPerYear.set(perYear);
      }
    }
  });

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
}
