import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ExerciseLogComponent } from '@components/exercise-log.component';

import { FiltersComponent } from '@components/filters.component';
import { Filter } from '@models/filter';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';

@Component({
  selector: 'app-exercise-logs-page',
  templateUrl: 'exercise-logs.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ExerciseLogComponent, FiltersComponent],
})
export class ExerciseLogsPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);

  public readonly currentPage = signal(0);
  private readonly filter = signal<Filter | null>(null);

  public readonly logs = rxResource({
    request: this.filter,
    loader: ({ request: filter }) => {
      const userId = filter?.userId.at(0);
      const exerciseType = filter?.types.at(0);
      const exerciseId = filter?.exercisesIds.at(0);
      const weightInKg = filter?.weights.at(0);

      return this.exerciseLogApiService.getExerciseLogs(
        this.currentPage(),
        userId,
        exerciseType ?? null,
        exerciseId ?? null,
        weightInKg ?? null
      );
    },
  });

  public constructor() {}

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  public onFilterChange(filter: Filter) {
    this.currentPage.set(0);
    this.filter.set(filter);
    this.logs.reload();
  }

  public prevPage(): void {
    const prevValue = this.currentPage();
    this.currentPage.update(x => Math.max(x - 1, 0));

    if (prevValue !== this.currentPage()) {
      this.logs.reload();
    }
  }

  public nextPage(): void {
    const prevValue = this.currentPage();
    this.currentPage.update(x => x + 1);

    if (prevValue !== this.currentPage()) {
      this.logs.reload();
    }
  }
}
