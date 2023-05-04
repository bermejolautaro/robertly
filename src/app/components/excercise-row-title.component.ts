import ***REMOVED*** NgClass, NgFor, NgIf, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, Input ***REMOVED*** from '@angular/core';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';

@Component(***REMOVED***
  selector: 'app-excercise-row-title',
  template: `
    <div class="w-100">
      <div class="row w-100 pb-1" [ngClass]="showDate && showUsername ? 'fw-bold': null" *ngIf="excerciseRow">
        <div *ngIf="showExcercise" class="col d-flex" [style.fontSize.rem]="1">
          ***REMOVED******REMOVED*** excerciseRow.excerciseName | titlecase ***REMOVED******REMOVED***
        </div>
      </div>
      <div class="row">
        <div *ngIf="showDate" class="col d-flex text-muted" [style.fontSize.rem]=".8">
          ***REMOVED******REMOVED*** excerciseRow.date ***REMOVED******REMOVED*** - ***REMOVED******REMOVED*** excerciseRow.username | titlecase ***REMOVED******REMOVED***
        </div>
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
  imports: [NgFor, NgIf, NgClass, TitleCasePipe],
***REMOVED***)
export class ExcerciseRowTitleComponent ***REMOVED***
  @Input() showExcercise: boolean = true;
  @Input() showDate: boolean = true;
  @Input() showUsername: boolean = true;
  @Input(***REMOVED*** required: true ***REMOVED***) excerciseRow!: ExcerciseRow;
***REMOVED***
