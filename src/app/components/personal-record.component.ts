import ***REMOVED*** NgIf ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, Input ***REMOVED*** from '@angular/core';
import ***REMOVED*** NgbAccordionModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** ExcerciseRowTitleComponent ***REMOVED*** from '@components/excercise-row-title.component';
import ***REMOVED*** ExcerciseRowBodyComponent ***REMOVED*** from '@components//excercise-row-body.component';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';

@Component(***REMOVED***
  selector: 'app-personal-record',
  template: `
    <div ngbAccordion>
      <div ngbAccordionItem class="accordion-highlight light-blue">
        <h2 ngbAccordionHeader>
          <button ngbAccordionButton>
            <app-excercise-row-title [excerciseRow]="personalRecord" [showStar]="true"></app-excercise-row-title>
          </button>
        </h2>
        <div ngbAccordionCollapse>
          <div ngbAccordionBody>
            <ng-template>
              <app-excercise-row-body [excerciseRow]="personalRecord"></app-excercise-row-body>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host ***REMOVED***
        display: block;
  ***REMOVED***
    `,
  ],
  standalone: true,
  imports: [NgIf, ExcerciseRowTitleComponent, ExcerciseRowBodyComponent, NgbAccordionModule],
***REMOVED***)
export class PersonalRecordComponent ***REMOVED***
  @Input(***REMOVED*** required: true ***REMOVED***) personalRecord!: ExcerciseRow;
***REMOVED***
