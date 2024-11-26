import { ChangeDetectionStrategy, Component, OnInit, effect, inject, linkedSignal, signal } from '@angular/core';

import { DOCUMENT, TitleCasePipe } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RingComponent } from '@components/ring.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { DAY_JS } from 'src/main';
import { SeriesPerMuscleRow } from '@models/series-per-muscle';
import { DropdownComponent } from '../components/dropdown.component';
import { FormControl } from '@angular/forms';
import { ExerciseLogService } from '@services/exercise-log.service';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbNavModule, RingComponent, TitleCasePipe, DropdownComponent],
})
export class StatsPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly dayjs = inject(DAY_JS);
  private readonly exerciseLogService = inject(ExerciseLogService);

  public readonly exerciseLogApiService = inject(ExerciseLogApiService);

  private readonly defaultValues = linkedSignal(() =>
    this.exerciseLogService
      .muscleGroups()
      .map(x => ({ totalSeries: 0, muscleGroup: x ?? '', firstDateInPeriod: '', month: 0, week: 0, year: 0 }))
  );

  public readonly seriesPerWeek = linkedSignal<SeriesPerMuscleRow[]>(this.defaultValues);
  public readonly seriesPerMonth = linkedSignal<SeriesPerMuscleRow[]>(this.defaultValues);
  public readonly seriesPerYear = linkedSignal<SeriesPerMuscleRow[]>(this.defaultValues);

  public readonly selectedOptionControl = signal(new FormControl('Series Per Muscle'));
  public readonly options = signal(['Series Per Muscle', 'Exercise', 'Tonnage']);

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
        this.seriesPerWeek.update(x =>
          x.map(y => {
            const serie = perWeek.find(a => a.muscleGroup === y.muscleGroup);
            return !serie ? y : { ...y, totalSeries: serie?.totalSeries ?? 0 };
          })
        );
      }

      if (perMonth.length) {
        this.seriesPerMonth.update(x =>
          x.map(y => {
            const serie = perMonth.find(a => a.muscleGroup === y.muscleGroup);
            return !serie ? y : { ...y, totalSeries: serie?.totalSeries ?? 0 };
          })
        );
      }

      if (perYear) {
        this.seriesPerYear.update(x =>
          x.map(y => {
            const serie = perYear.find(a => a.muscleGroup === y.muscleGroup);
            return !serie ? y : { ...y, totalSeries: serie?.totalSeries ?? 0 };
          })
        );
      }
    }
  });

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
}
