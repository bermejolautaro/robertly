import ***REMOVED*** NgClass, NgFor, NgIf, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, Input ***REMOVED*** from '@angular/core';

import ***REMOVED*** NgbAccordionModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** ExcerciseRowTitleComponent ***REMOVED*** from '@components/excercise-row-title.component';
import ***REMOVED*** ExcerciseRowBodyComponent ***REMOVED*** from '@components/excercise-row-body.component';

@Component(***REMOVED***
  selector: 'app-excercise-rows',
  template: `
    <div class="row my-2">
      <div class="col">
        <div ngbAccordion>
          <div
            ngbAccordionItem
            *ngFor="let excerciseRow of filtered()"
            [ngClass]="excerciseRow.highlighted ? 'accordion-highlight ' + excerciseRow.highlighted : null"
          >
            <h2 ngbAccordionHeader>
              <button ngbAccordionButton>
                <app-excercise-row-title [excerciseRow]="excerciseRow"></app-excercise-row-title>
              </button>
            </h2>
            <div ngbAccordionCollapse>
              <div ngbAccordionBody>
                <ng-template>
                  <app-excercise-row-body [excerciseRow]="excerciseRow"></app-excercise-row-body>
                </ng-template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgIf, TitleCasePipe, NgClass, NgbAccordionModule, ExcerciseRowTitleComponent, ExcerciseRowBodyComponent],
***REMOVED***)
export class ExcerciseRowsComponent ***REMOVED***
  @Input() public excerciseRows: ExcerciseRow[] = [];

  public filteredRows(): ExcerciseRow[] ***REMOVED***
    return this.excerciseRows.filter(x => !!x.series.at(0)?.serie);
***REMOVED***
***REMOVED***
