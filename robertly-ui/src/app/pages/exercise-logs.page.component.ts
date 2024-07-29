import { DOCUMENT, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseLogComponent } from '@components/exercise-log.component';

import { ExerciseRowsComponent } from '@components/exercise-rows.component';
import { FiltersComponent } from '@components/filters.component';
import { GroupedExerciseRowsComponent } from '@components/grouped-exercise-rows.component';
import { PersonalRecordComponent } from '@components/personal-record.component';
import { ExerciseLogDto } from '@models/exercise-log.model';
import { Filter } from '@models/filter';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { ExerciseLogService } from '@services/exercise-log.service';
import { tap } from 'rxjs';

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

  public readonly currentPage = signal(0);
  private readonly filter = signal<Filter | null>(null);

  public readonly logs = signal<ExerciseLogDto[]>([]);

  public constructor() {}

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
    this.fetchLogs();
  }

  public onFilterChange(filter: Filter) {
    this.filter.set(filter);
    this.fetchLogs();
  }

  public prevPage(): void {
    const prevValue = this.currentPage();
    this.currentPage.update(x => Math.max(x - 1, 0));

    if (prevValue !== this.currentPage()) {
      this.fetchLogs();
    }
  }

  public nextPage(): void {
    const prevValue = this.currentPage();
    this.currentPage.update(x => x + 1);

    if (prevValue !== this.currentPage()) {
      this.fetchLogs();
    }
  }

  private fetchLogs(): void {
    const filter = this.filter();
    const exerciseType = filter?.types.at(0);
    const exerciseId = filter?.exercisesIds.at(0);
    const weightInKg = filter?.weights.at(0);

    const exerciseLogs$ = this.exerciseLogApiService.getExerciseLogs(
      this.currentPage(),
      exerciseType ?? null,
      exerciseId ?? null,
      weightInKg ?? null
    );

    this.exerciseLogService.withLoading(
      exerciseLogs$.pipe(
        tap(exerciseLogs => {
          this.logs.set(exerciseLogs);
        })
      )
    );
  }
}
