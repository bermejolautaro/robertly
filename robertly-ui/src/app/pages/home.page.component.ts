import { DOCUMENT, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ExerciseLogComponent } from '@components/exercise-log.component';
import { RingComponent } from '@components/ring.component';

import { ExerciseLogApiService } from '@services/exercise-log-api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ExerciseLogComponent, RingComponent, SlicePipe],
})
export class HomePageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);

  public readonly daysPerWeekTarget = computed(() => 4);

  public readonly showMoreRecentlyUpdated = signal(false);
  public readonly recentlyUpdatedAmountToShow = computed(() =>
    this.showMoreRecentlyUpdated() ? this.recentlyUpdatedLogs.value()?.length ?? 10 : 2
  );

  public readonly showMoreLatestWorkout = signal(false);
  public readonly latestWorkoutAmountToShow = computed(() =>
    this.showMoreLatestWorkout() ? this.latestWorkoutLogs.value()?.length ?? 10 : 2
  );

  public readonly isLoading = computed(
    () => this.recentlyUpdatedLogs.isLoading() && this.latestWorkoutLogs.isLoading() && this.stats.isLoading()
  );

  public readonly stats = rxResource({
    loader: () => {
      return this.exerciseLogApiService.getStats();
    },
  });

  public readonly recentlyUpdatedLogs = rxResource({
    loader: () => {
      return this.exerciseLogApiService.getRecentlyUpdated();
    },
  });

  public readonly latestWorkoutLogs = rxResource({
    loader: () => {
      return this.exerciseLogApiService.getExerciseLogsLatestWorkout();
    },
  });

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  public toggleShowMoreRecentlyUpdated(): void {
    this.showMoreRecentlyUpdated.update(x => !x);
  }

  public toggleShowMoreLatestWorkout(): void {
    this.showMoreLatestWorkout.update(x => !x);
  }
}

