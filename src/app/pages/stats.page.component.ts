import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { amountDaysTrained } from '@helpers/excercise-log.helper';

import { SeriesPerMuscleGroupWeeklyComponent } from '@components/series-per-muscle-group-weekly.component';
import { SeriesPerMuscleGroupMonthlyComponent } from '@components/series-per-muscle-group-monthly.component';
import { ExerciseLogService } from '@services/excercise-log.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats.page.component.html',
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SeriesPerMuscleGroupWeeklyComponent, SeriesPerMuscleGroupMonthlyComponent],
})
export class StatsPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  public readonly exerciseLogService = inject(ExerciseLogService);

  public amountDaysTrained = amountDaysTrained;

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
}
