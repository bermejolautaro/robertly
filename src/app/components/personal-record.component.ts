import ***REMOVED*** NgIf ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, Input ***REMOVED*** from '@angular/core';
import ***REMOVED*** ExcerciseRowTitleComponent ***REMOVED*** from '@app/components/excercise-row-title.component';
import ***REMOVED*** ExcerciseRowBodyComponent ***REMOVED*** from '@app/components//excercise-row-body.component';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@app/models/excercise-row.model';
import ***REMOVED*** NgbAccordionModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

@Component(***REMOVED***
  selector: 'app-personal-record',
  template: `
    <ng-container *ngIf="personalRecord">
      <h5>Personal record</h5>
      <div ngbAccordion>
        <div ngbAccordionItem class="accordion-highlight light-blue">
          <h2 ngbAccordionHeader>
            <button ngbAccordionButton>
              <app-excercise-row-title [excerciseRow]="personalRecord"></app-excercise-row-title>
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
    </ng-container>
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
  @Input() personalRecord: ExcerciseRow | null = null;
***REMOVED***
