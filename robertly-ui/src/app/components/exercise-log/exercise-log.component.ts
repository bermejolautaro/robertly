import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ExerciseLogDto } from '@models/exercise-log.model';
import { PadStartPipe } from '@pipes/pad-start.pipe';
import { ParseToDatePipe } from '@pipes/parse-to-date.pipe';
import { Paths } from 'src/main';

@Component({
    selector: 'app-exercise-log',
    templateUrl: './exercise-log.component.html',
    styleUrl: './exercise-log.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TitleCasePipe,
        ParseToDatePipe,
        PadStartPipe,
    ]
})
export class ExerciseLogComponent {
  private readonly router = inject(Router);
  public readonly exerciseLog = input<ExerciseLogDto | null>();

  public navigateToEditLog(): void {
    const exerciseLog = this.exerciseLog();

    if (exerciseLog) {
      this.router.navigate([Paths.LOGS, Paths.LOGS_EDIT, exerciseLog.id]);
    }
  }
}
