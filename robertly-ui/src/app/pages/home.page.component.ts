import { DOCUMENT, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseLogComponent } from '@components/exercise-log/exercise-log.component';
import { RingComponent } from '@components/ring.component';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { Paths } from 'src/main';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home.page.component.html',
  styles: `
    .services {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      align-items: start;
      margin-top: 0.5rem;
      background-color: var(--light-bg);
      border-radius: 5px;
      padding: 0.9rem 0;
      gap: 1rem 0.5rem;
    }

    .service {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .iconoir-plus-circle-solid {
        width: 0;
        height: 0;
        position: relative;
        top: -26px;
        right: 2px;
        font-size: 18px;
        color: #a78cf3;
      }

      span {
        padding: 0;
        font-size: 10px;
        text-decoration: none;
        color: white;
        width: 64px;
      }
    }

    .service-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 100%;
      color: rgba(255, 255, 255, 0.9);
      border: 2px solid rgba(255, 255, 255, 0.4);
      padding: 1.1rem;
      width: 36px;
      height: 36px;
      margin-bottom: 0.15rem;

      i {
        font-size: 22px;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ExerciseLogComponent, RingComponent, SlicePipe],
})
export class HomePageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly router = inject(Router);

  public readonly Paths = Paths;

  public readonly daysPerWeekTarget = computed(() => 4);

  public readonly showMoreRecentlyUpdated = signal(false);
  public readonly recentlyUpdatedAmountToShow = computed(() =>
    this.showMoreRecentlyUpdated() ? (this.recentlyUpdatedLogsResource.value()?.length ?? 10) : 2
  );

  public readonly showMoreLatestWorkout = signal(false);
  public readonly latestWorkoutAmountToShow = computed(() =>
    this.showMoreLatestWorkout() ? (this.latestWorkoutLogsResource.value()?.length ?? 10) : 2
  );

  public readonly isLoading = computed(
    () =>
      this.recentlyUpdatedLogsResource.isLoading() &&
      this.latestWorkoutLogsResource.isLoading() &&
      this.stats.isLoading()
  );

  public readonly stats = rxResource({
    loader: () => {
      return this.exerciseLogApiService.getDaysTrained();
    },
  });

  public readonly recentlyUpdatedLogsResource = rxResource({
    loader: () => {
      return this.exerciseLogApiService.getRecentlyUpdated();
    },
  });

  public readonly latestWorkoutLogsResource = rxResource({
    loader: () => {
      return this.exerciseLogApiService.getExerciseLogsLatestWorkout();
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

  public toggleShowMoreLatestWorkout(): void {
    this.showMoreLatestWorkout.update(x => !x);
  }
}
