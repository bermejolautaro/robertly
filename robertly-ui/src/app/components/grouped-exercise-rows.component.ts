import ***REMOVED*** NgClass, NgFor, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, inject ***REMOVED*** from '@angular/core';

import ***REMOVED*** NgbAccordionModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** ExcerciseRowBodyComponent ***REMOVED*** from '@components/excercise-row-body.component';
import ***REMOVED*** ExcerciseRowTitleComponent ***REMOVED*** from '@components/excercise-row-title.component';
import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';
import ***REMOVED*** ParseToDatePipe ***REMOVED*** from '@pipes/parse-to-date.pipe';

@Component(***REMOVED***
  selector: 'app-grouped-exercise-rows',
  templateUrl: './grouped-exercise-rows.component.html',
  styles: `
    table ***REMOVED***
      td, tr ***REMOVED***
        font-size: 12px;
        padding: .3rem;
  ***REMOVED***
***REMOVED***
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgbAccordionModule, TitleCasePipe, ParseToDatePipe, NgClass, ExcerciseRowBodyComponent, ExcerciseRowTitleComponent],
***REMOVED***)
export class GroupedExerciseRowsComponent ***REMOVED***
  public readonly exerciseLogService = inject(ExerciseLogService);
***REMOVED***
