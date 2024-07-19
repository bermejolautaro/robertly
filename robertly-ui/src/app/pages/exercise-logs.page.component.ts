import { DOCUMENT, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseLogComponent } from '@components/exercise-log.component';

import { ExerciseRowsComponent } from '@components/exercise-rows.component';
import { FiltersComponent } from '@components/filters.component';
import { GroupedExerciseRowsComponent } from '@components/grouped-exercise-rows.component';
import { PersonalRecordComponent } from '@components/personal-record.component';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { ExerciseLogService } from '@services/exercise-log.service';
import { forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-exercise-logs-page',
  templateUrl: 'exercise-logs.page.component.html',
  styles: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    FormsModule,
    PersonalRecordComponent,
    GroupedExerciseRowsComponent,
    ExerciseRowsComponent,
    ExerciseLogComponent,
    FiltersComponent,
  ],
})
export class ExerciseLogsPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  public readonly exerciseLogService = inject(ExerciseLogService);

  public isGrouped: boolean = false;

  public constructor() {}

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });

    const exerciseLogs$ = this.exerciseLogApiService.getExerciseLogsLatestWorkout();

    if (!this.exerciseLogService.logs().length) {
      this.exerciseLogService.withLoading(
        forkJoin([exerciseLogs$]).pipe(
          tap(([exerciseLogs]) => {
            this.exerciseLogService.updateLogs$.next(exerciseLogs);
          })
        )
      );
    }
  }
}
