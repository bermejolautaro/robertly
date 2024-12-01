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
import { ExerciseApiService } from '@services/exercises-api.service';

import * as R from 'remeda';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats.page.component.html',
  styleUrl: './stats.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbNavModule, RingComponent, TitleCasePipe, DropdownComponent],
})
export class StatsPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly dayjs = inject(DAY_JS);
  private readonly exercisesApiService = inject(ExerciseApiService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public readonly exerciseLogApiService = inject(ExerciseLogApiService);

  private readonly defaultValues = linkedSignal(() =>
    this.exercisesApiService
      .muscleGroups()
      .map(x => ({ totalSeries: 0, muscleGroup: x ?? '', firstDateInPeriod: '', month: 0, week: 0, year: 0 }))
  );

  public readonly period = signal<'week' | 'month' | 'year'>('week');

  public readonly seriesPerWeek = signal<[key: string, value: SeriesPerMuscleRow[]][]>([]);
  public readonly seriesPerMonth = signal<[key: string, value: SeriesPerMuscleRow[]][]>([]);
  public readonly seriesPerYear = signal<[key: string, value: SeriesPerMuscleRow[]][]>([]);

  public readonly selectedOptionControl = signal(new FormControl('Series Per Muscle'));
  public readonly options = signal(['Series Per Muscle', 'Exercise', 'Tonnage']);

  public readonly seriesPerMuscle = rxResource({
    loader: () => this.exerciseLogApiService.getSeriesPerMuscle(),
  });

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
              return row;
            }

            return defaultValue as SeriesPerMuscleRow;
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
              return row;
            }

            return defaultValue as SeriesPerMuscleRow;
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
              return row;
            }

            return defaultValue as SeriesPerMuscleRow;
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

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
}
