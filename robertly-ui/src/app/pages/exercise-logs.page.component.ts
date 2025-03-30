import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ExerciseLogComponent } from '@components/exercise-log/exercise-log.component';

import { FiltersComponent } from '@components/filters/filters.component';
import { Filter } from '@models/filter';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';

@Component({
  selector: 'app-exercise-logs-page',
  templateUrl: 'exercise-logs.page.component.html',
  styles: `
    .toggle-filters {
      border: 1px solid white;
      border-radius: 5px;
      width: 2rem;
      height: 2rem;
    }

    .active-filters {
      display: inline;
      position: relative;
      text-align: center;
      background: rgb(239, 68, 68);
      border-radius: 100%;
      width: 18px;
      height: 18px;
      font-size: 12px;
      font-weight: bold;
      top: -6px;
      right: -44px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ExerciseLogComponent, FiltersComponent],
})
export class ExerciseLogsPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);

  public readonly showFilters = signal(false);

  public readonly currentPage = signal(0);
  private readonly filter = signal<Filter | null>(null);

  public readonly filtersCount = computed(() => {
    const filter = this.filter();

    if (!filter) {
      return 0;
    }

    return Object.values(filter).reduce((acc, curr) => acc + curr.length, 0);
  });

  public readonly logsResource = rxResource({
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

  public readonly logs = computed(() =>
    this.logsResource.isLoading() ? [null, null, null, null, null] : this.logsResource.value()?.data
  );

  public constructor() {}

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  public onFilterChange(filter: Filter) {
    this.currentPage.set(0);
    this.filter.set(filter);
    this.logsResource.reload();
  }

  public prevPage(): void {
    const prevValue = this.currentPage();
    this.currentPage.update(x => Math.max(x - 1, 0));

    if (prevValue !== this.currentPage()) {
      this.logsResource.reload();
    }
  }

  public nextPage(): void {
    const prevValue = this.currentPage();

    this.currentPage.update(x => Math.min(x + 1, this.logsResource.value()?.pageCount ?? Infinity));

    if (prevValue !== this.currentPage()) {
      this.logsResource.reload();
    }
  }
}
