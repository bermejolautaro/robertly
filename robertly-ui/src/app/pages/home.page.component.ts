import { DOCUMENT, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseLogComponent } from '@components/exercise-log.component';

import { ExerciseRowsComponent } from '@components/exercise-rows.component';
import { FiltersComponent } from '@components/filters.component';
import { GroupedExerciseRowsComponent } from '@components/grouped-exercise-rows.component';
import { PersonalRecordComponent } from '@components/personal-record.component';
import { ExerciseLogDto } from '@models/exercise-log.model';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { ExerciseLogService } from '@services/exercise-log.service';
import { forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home.page.component.html',
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
export class HomePageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  public readonly exerciseLogService = inject(ExerciseLogService);

  public readonly logs = signal<ExerciseLogDto[]>([]);

  public constructor() {}

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });

    const exerciseLogs$ = this.exerciseLogApiService.getExerciseLogsLatestWorkout();

    this.exerciseLogService.withLoading(
      forkJoin([exerciseLogs$]).pipe(
        tap(([exerciseLogs]) => {
          this.logs.set(exerciseLogs);
        })
      )
    );
  }
}
