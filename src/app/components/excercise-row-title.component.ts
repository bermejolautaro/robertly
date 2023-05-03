import ***REMOVED*** NgFor, NgIf, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, Input ***REMOVED*** from '@angular/core';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';

@Component(***REMOVED***
  selector: 'app-excercise-row-title',
  template: `
    <div class="row w-100" *ngIf="excerciseRow">
      <div *ngIf="showExcercise" class="col d-flex align-items-center justify-content-center text-center">
        ***REMOVED******REMOVED*** excerciseRow.excerciseName | titlecase ***REMOVED******REMOVED***
      </div>
      <div *ngIf="showDate" class="col d-flex align-items-center justify-content-center text-center">
        ***REMOVED******REMOVED*** excerciseRow.date ***REMOVED******REMOVED***
      </div>
      <div *ngIf="showUsername" class="col d-flex align-items-center justify-content-center text-center">
        ***REMOVED******REMOVED*** excerciseRow.username | titlecase ***REMOVED******REMOVED***
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
  imports: [NgFor, NgIf, TitleCasePipe],
***REMOVED***)
export class ExcerciseRowTitleComponent ***REMOVED***
  @Input() showExcercise: boolean = true;
  @Input() showDate: boolean = true;
  @Input() showUsername: boolean = true;
  @Input(***REMOVED*** required: true ***REMOVED***) excerciseRow!: ExcerciseRow;
***REMOVED***
