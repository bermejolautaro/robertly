import ***REMOVED*** ChangeDetectionStrategy, Component, OnInit, inject ***REMOVED*** from '@angular/core';

import ***REMOVED*** SeriesPerMuscleGroupWeeklyComponent ***REMOVED*** from '@components/series-per-muscle-group-weekly.component';
import ***REMOVED*** SeriesPerMuscleGroupMonthlyComponent ***REMOVED*** from '@components/series-per-muscle-group-monthly.component';
import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';
import ***REMOVED*** DOCUMENT, KeyValuePipe, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** SeriesPerMuscleGroupYearlyComponent ***REMOVED*** from '@components/series-per-muscle-group-yearly.component';

@Component(***REMOVED***
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
***REMOVED***)
export class StatsPageComponent implements OnInit ***REMOVED***
  private readonly document = inject(DOCUMENT);
  public readonly exerciseLogService = inject(ExerciseLogService);

  public ngOnInit(): void ***REMOVED***
    this.document.defaultView?.scroll(***REMOVED*** top: 0, left: 0, behavior: 'smooth' ***REMOVED***);
***REMOVED***
***REMOVED***
