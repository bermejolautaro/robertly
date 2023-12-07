import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { SeriesPerMuscleGroupWeeklyComponent } from '@components/series-per-muscle-group-weekly.component';
import { SeriesPerMuscleGroupMonthlyComponent } from '@components/series-per-muscle-group-monthly.component';
import { ExerciseLogService } from '@services/excercise-log.service';
import { DOCUMENT, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { SeriesPerMuscleGroupYearlyComponent } from '@components/series-per-muscle-group-yearly.component';
import { NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SeriesPerMuscleGroupGraphMonthlyComponent } from '@components/series-per-muscle-group-graph-monthly.component';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats.page.component.html',
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgbNavModule,
    TitleCasePipe,
    KeyValuePipe,
    SeriesPerMuscleGroupWeeklyComponent,
    SeriesPerMuscleGroupMonthlyComponent,
    SeriesPerMuscleGroupGraphMonthlyComponent,
    SeriesPerMuscleGroupYearlyComponent,
  ],
})
export class StatsPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  public readonly exerciseLogService = inject(ExerciseLogService);
  
  public active = 1;

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
}
