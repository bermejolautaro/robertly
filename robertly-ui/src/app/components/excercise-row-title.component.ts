import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExerciseRow } from '@models/excercise-row.model';
import { ParseToDatePipe } from '@pipes/parse-to-date.pipe';

@Component({
  selector: 'app-excercise-row-title',
  template: `
    <div class="w-100">
      @if (exerciseRow) {
        <div class="row w-100 pb-1" [ngClass]="showDate && showUsername ? 'fw-semibold' : null">
          @if (showExercise) {
            <div class="col d-flex align-items-center gap-1" [style.fontSize.rem]="1">
              {{ exerciseRow.excerciseName | titlecase }}
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
            {{ exerciseRow.date | parseToDate }} - {{ exerciseRow.username | titlecase }}
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
export class ExcerciseRowTitleComponent {
  @Input() showStar: boolean = false;
  @Input() showExercise: boolean = true;
  @Input() showDate: boolean = true;
  @Input() showUsername: boolean = true;
  @Input({ required: true }) exerciseRow!: ExerciseRow;
}
