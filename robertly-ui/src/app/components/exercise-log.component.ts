import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ExerciseLog } from '@models/exercise-log.model';
import { PadStartPipe } from '@pipes/pad-start.pipe';
import { ParseToDatePipe } from '@pipes/parse-to-date.pipe';
import { Paths } from 'src/main';

@Component({
  selector: 'app-exercise-log',
  template: `
    @let log = exerciseLog();

    @if (!!log) {
      <div
        class="log"
        (click)="navigateToEditLog()"
      >
        <div class="grid">
          <div class="d-flex flex-column align-self-center">
            <div class="title">{{ log.exercise?.name | titlecase }}</div>
            <div class="hint">{{ log.exerciseLogDate | parseToDate }}</div>
            <div class="hint">{{ log.user?.name }}</div>
          </div>
          <div class="series">
            @for (serie of log.series; track $index) {
              <div class="serie">
                <div>{{ serie.reps | padStart: 2 }} reps</div>
                <div>{{ serie.weightInKg | padStart: 2 }}kg</div>
              </div>
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="log">
        <div class="grid">
          <div class="d-flex flex-column placeholder-glow">
            <div class="title"><span class="placeholder col-6"></span></div>
            <div class="hint"><span class="placeholder col-12"></span></div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .log {
      background-color: var(--light-bg);
      color: var(--font-color);
      margin-bottom: 8px;
      border-radius: 5px;
      padding: 0.2rem 0.6rem 0.2rem 0.6rem;

      .grid {
        display: grid;
        grid-template-columns: 50% 50%;
      }

      .title {
        font-size: 15px;
        font-weight: 600;
      }

      .hint {
        font-size: 12px;
        opacity: 0.8;
      }

      .series {
        display: flex;
        flex-direction: column;
        font-size: 12px;
        opacity: 0.8;

        .serie {
          display: grid;
          grid-template-columns: 1fr auto;
          white-space: pre-wrap;
          text-align: right;
          gap: 10px;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, ParseToDatePipe, PadStartPipe],
})
export class ExerciseLogComponent {
  private readonly router = inject(Router);
  public readonly exerciseLog = input<ExerciseLog | null>();

  public navigateToEditLog(): void {
    const exerciseLog = this.exerciseLog();

    if (exerciseLog) {
      this.router.navigate([Paths.EXERCISE_LOGS, Paths.EDIT, exerciseLog.exerciseLogId]);
    }
  }
}
