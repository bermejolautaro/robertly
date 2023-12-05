import ***REMOVED*** NgClass ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, Input ***REMOVED*** from '@angular/core';

import ***REMOVED*** NgbAccordionModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** ExerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** ExcerciseRowTitleComponent ***REMOVED*** from '@components/excercise-row-title.component';
import ***REMOVED*** ExcerciseRowBodyComponent ***REMOVED*** from '@components/excercise-row-body.component';

@Component(***REMOVED***
  selector: 'app-excercise-rows',
  template: `
    <div class="row my-2">
      <div class="col">
        <div ngbAccordion>
          @for (exerciseRow of exerciseRows; track $index) ***REMOVED***
            <div ngbAccordionItem [ngClass]="exerciseRow.highlighted ? 'accordion-highlight ' + exerciseRow.highlighted : null">
              <h2 ngbAccordionHeader>
                <button ngbAccordionButton>
                  <app-excercise-row-title [exerciseRow]="exerciseRow"></app-excercise-row-title>
                </button>
              </h2>
              <div ngbAccordionCollapse>
                <div ngbAccordionBody>
                  <ng-template>
                    <app-excercise-row-body [exerciseRow]="exerciseRow"></app-excercise-row-body>
                  </ng-template>
                </div>
              </div>
            </div>
      ***REMOVED***
        </div>
      </div>
    </div>
  `,
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgbAccordionModule, ExcerciseRowTitleComponent, ExcerciseRowBodyComponent],
***REMOVED***)
export class ExcerciseRowsComponent ***REMOVED***
  @Input() public exerciseRows: ExerciseRow[] = [];
***REMOVED***
