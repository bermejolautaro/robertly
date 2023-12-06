import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { SeriesPerMuscleGroupWeeklyComponent } from '@components/series-per-muscle-group-weekly.component';
import { SeriesPerMuscleGroupMonthlyComponent } from '@components/series-per-muscle-group-monthly.component';
import { ExerciseLogService } from '@services/excercise-log.service';
import { DOCUMENT, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { SeriesPerMuscleGroupYearlyComponent } from '@components/series-per-muscle-group-yearly.component';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats.page.component.html',
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleCasePipe,
    KeyValuePipe,
    SeriesPerMuscleGroupWeeklyComponent,
    SeriesPerMuscleGroupMonthlyComponent,
    SeriesPerMuscleGroupYearlyComponent,
  ],
})
export class StatsPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  public readonly exerciseLogService = inject(ExerciseLogService);

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
}
