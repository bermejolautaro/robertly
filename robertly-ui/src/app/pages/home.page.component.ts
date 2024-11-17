import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ExerciseLogComponent } from '@components/exercise-log.component';

import { ExerciseLogApiService } from '@services/exercise-log-api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ExerciseLogComponent],
})
export class HomePageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);

  public readonly logs = rxResource({
    loader: () => {
      return this.exerciseLogApiService.getExerciseLogsLatestWorkout();
    },
  });

  public constructor() {}

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
}
