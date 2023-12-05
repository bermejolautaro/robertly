import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { amountDaysTrained } from '@helpers/excercise-log.helper';

import { SeriesPerMuscleGroupWeeklyComponent } from '@components/series-per-muscle-group-weekly.component';
import { SeriesPerMuscleGroupMonthlyComponent } from '@components/series-per-muscle-group-monthly.component';
import { ExerciseLogService } from '@services/excercise-log.service';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats.page.component.html',
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SeriesPerMuscleGroupWeeklyComponent, SeriesPerMuscleGroupMonthlyComponent],
})
export class StatsPageComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);

  public amountDaysTrained = amountDaysTrained;
}
