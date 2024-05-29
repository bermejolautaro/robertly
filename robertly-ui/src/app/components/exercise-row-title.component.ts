import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExerciseLogDto } from '@models/exercise-log.model';
import { ExerciseRow } from '@models/exercise-row.model';
import { ParseToDatePipe } from '@pipes/parse-to-date.pipe';

@Component({
  selector: 'app-exercise-row-title',
  template: `
    <div class="w-100">
      @if (exerciseLog) {
        <div class="row w-100 pb-1" [ngClass]="showDate && showUsername ? 'fw-semibold' : null">
          @if (showExercise) {
            <div class="col d-flex align-items-center gap-1" [style.fontSize.rem]="1">
              {{ exerciseLog.exercise.name | titlecase }}
              @if (showStar) {
                <i class="fa fa-star"></i>
              }
            </div>
          }
        </div>
      }
      <div class="row">
        @if (showDate) {
          <div class="col d-flex text-muted" [style.fontSize.rem]="0.8">
            {{ exerciseLog.date | parseToDate }} - {{ exerciseLog.user.name | titlecase }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex: 1;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TitleCasePipe, ParseToDatePipe],
})
export class ExerciseRowTitleComponent {
  @Input() showStar: boolean = false;
  @Input() showExercise: boolean = true;
  @Input() showDate: boolean = true;
  @Input() showUsername: boolean = true;
  @Input({ required: true }) exerciseLog!: ExerciseLogDto;
}
