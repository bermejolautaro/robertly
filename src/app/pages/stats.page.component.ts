import ***REMOVED*** ChangeDetectionStrategy, Component, inject ***REMOVED*** from '@angular/core';

import ***REMOVED*** amountDaysTrained ***REMOVED*** from '@helpers/excercise-log.helper';

import ***REMOVED*** SeriesPerMuscleGroupWeeklyComponent ***REMOVED*** from '@components/series-per-muscle-group-weekly.component';
import ***REMOVED*** SeriesPerMuscleGroupMonthlyComponent ***REMOVED*** from '@components/series-per-muscle-group-monthly.component';
import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';

@Component(***REMOVED***
  selector: 'app-stats-page',
  templateUrl: './stats.page.component.html',
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SeriesPerMuscleGroupWeeklyComponent, SeriesPerMuscleGroupMonthlyComponent],
***REMOVED***)
export class StatsPageComponent ***REMOVED***
  public readonly exerciseLogService = inject(ExerciseLogService);

  public amountDaysTrained = amountDaysTrained;
***REMOVED***
