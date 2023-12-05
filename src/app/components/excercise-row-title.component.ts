import ***REMOVED*** NgClass, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, Input ***REMOVED*** from '@angular/core';
import ***REMOVED*** ExerciseRow ***REMOVED*** from '@models/excercise-row.model';

@Component(***REMOVED***
  selector: 'app-excercise-row-title',
  template: `
    <div class="w-100">
      @if (exerciseRow) ***REMOVED***
        <div class="row w-100 pb-1" [ngClass]="showDate && showUsername ? 'fw-semibold' : null">
          @if (showExercise) ***REMOVED***
            <div class="col d-flex align-items-center gap-1" [style.fontSize.rem]="1">
              ***REMOVED******REMOVED*** exerciseRow.excerciseName | titlecase ***REMOVED******REMOVED***
              @if (showStar) ***REMOVED***
                <i class="fa fa-star"></i>
          ***REMOVED***
            </div>
      ***REMOVED***
        </div>
  ***REMOVED***
      <div class="row">
        @if (showDate) ***REMOVED***
          <div class="col d-flex text-muted" [style.fontSize.rem]="0.8">
            ***REMOVED******REMOVED*** exerciseRow.date ***REMOVED******REMOVED*** - ***REMOVED******REMOVED*** exerciseRow.username | titlecase ***REMOVED******REMOVED***
          </div>
    ***REMOVED***
      </div>
    </div>
  `,
  styles: [
    `
      :host ***REMOVED***
        display: flex;
        flex: 1;
  ***REMOVED***
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TitleCasePipe],
***REMOVED***)
export class ExcerciseRowTitleComponent ***REMOVED***
  @Input() showStar: boolean = false;
  @Input() showExercise: boolean = true;
  @Input() showDate: boolean = true;
  @Input() showUsername: boolean = true;
  @Input(***REMOVED*** required: true ***REMOVED***) exerciseRow!: ExerciseRow;
***REMOVED***
