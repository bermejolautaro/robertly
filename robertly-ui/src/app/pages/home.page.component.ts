import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal, DOCUMENT } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseLogComponent } from '@components/exercise-log.component';
import { ProgressBarComponent } from '@components/progress-bar.component';
import { RingComponent } from '@components/ring.component';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { FoodLogsApiService } from '@services/food-logs-api.service';
import { Paths } from 'src/main';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.component.html',
  styleUrl: './home.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ExerciseLogComponent, RingComponent, ProgressBarComponent, SlicePipe],
})
export class HomePageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly foodLogsApiService = inject(FoodLogsApiService);
  private readonly router = inject(Router);

  public readonly Paths = Paths;

  public readonly daysPerWeekTarget = computed(() => 4);

  public readonly showMoreRecentlyUpdated = signal(false);
  public readonly recentlyUpdatedAmountToShow = computed(() =>
    this.showMoreRecentlyUpdated() ? (this.recentlyUpdatedLogsResource.value()?.length ?? 10) : 3
  );

  public readonly isLoading = computed(
    () =>
      this.recentlyUpdatedLogsResource.isLoading() &&
      this.latestWorkoutLogsResource.isLoading() &&
      this.exerciseLogStats.isLoading()
  );

  public readonly exerciseLogStats = rxResource({
    stream: () => {
      return this.exerciseLogApiService.getDaysTrained();
    },
  });

  public readonly recentlyUpdatedLogsResource = rxResource({
    stream: () => {
      return this.exerciseLogApiService.getRecentlyUpdated();
    },
  });

  public readonly latestWorkoutLogsResource = rxResource({
    stream: () => {
      return this.exerciseLogApiService.getExerciseLogsLatestWorkout();
    },
  });

  public readonly macros = rxResource({
    stream: () => {
      return this.foodLogsApiService.getMacros(Intl.DateTimeFormat().resolvedOptions().timeZone);
    },
  });

  public readonly recentlyUpdatedLogs = computed(() =>
    this.recentlyUpdatedLogsResource.isLoading() ? [null, null] : this.recentlyUpdatedLogsResource.value()
  );

  public readonly latestWorkoutLogs = computed(() =>
    this.latestWorkoutLogsResource.isLoading() ? [null, null] : this.latestWorkoutLogsResource.value()
  );

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  public navigateTo(segments: string[]): void {
    this.router.navigate(segments);
  }

  public toggleShowMoreRecentlyUpdated(): void {
    this.showMoreRecentlyUpdated.update(x => !x);
  }
}
