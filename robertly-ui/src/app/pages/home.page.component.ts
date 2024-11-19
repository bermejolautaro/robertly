import { DOCUMENT, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ExerciseLogComponent } from '@components/exercise-log.component';

import { ExerciseLogApiService } from '@services/exercise-log-api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ExerciseLogComponent, SlicePipe],
})
export class HomePageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);

  public readonly showMore = signal(false);
  public readonly latestWorkoutAmountToShow = computed(() => this.showMore() ? this.latestWorkoutLogs.value()?.length ?? 10 : 3);

  public readonly latestWorkoutLogs = rxResource({
    loader: () => {
      return this.exerciseLogApiService.getExerciseLogsLatestWorkout();
    },
  });

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  public toggleShowMore(): void {
    this.showMore.update(x => !x);
  }
}
