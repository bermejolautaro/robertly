import ***REMOVED*** NgFor, NgIf, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, Input ***REMOVED*** from '@angular/core';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@app/models/excercise-row.model';

@Component(***REMOVED***
  selector: 'app-excercise-row-title',
  template: `
    <div class="row w-100" *ngIf="excerciseRow">
      <div class="col-4 d-flex align-items-center justify-content-center text-center">
        ***REMOVED******REMOVED*** excerciseRow.excerciseName | titlecase ***REMOVED******REMOVED***
      </div>
      <div class="col-4 d-flex align-items-center justify-content-center text-center">
        ***REMOVED******REMOVED*** excerciseRow.date ***REMOVED******REMOVED***
      </div>
      <div class="col-4 d-flex align-items-center justify-content-center text-center">
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
  @Input() excerciseRow: ExcerciseRow | null = null;
***REMOVED***
