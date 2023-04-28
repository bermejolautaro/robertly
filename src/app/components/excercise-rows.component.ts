import ***REMOVED*** NgClass, NgFor, NgIf, TitleCasePipe ***REMOVED*** from "@angular/common";
import ***REMOVED*** Component, Input ***REMOVED*** from "@angular/core";

import ***REMOVED*** NgbModule ***REMOVED*** from "@ng-bootstrap/ng-bootstrap";

import ***REMOVED*** ExcerciseRow ***REMOVED*** from "@app/models/excercise-row.model";

@Component(***REMOVED***
  selector: 'app-excercise-rows',
  template: `
  <div class="row my-2">
    <div class="col">
      <div ngbAccordion>
        <div ngbAccordionItem
            *ngFor="let excerciseRow of excerciseRows"
            [ngClass]="excerciseRow.highlighted ? 'accordion-highlight' : null">
          <h2 ngbAccordionHeader>
            <button ngbAccordionButton>
              <div class="row w-100">
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
            </button>
          </h2>
          <div ngbAccordionCollapse>
            <div ngbAccordionBody>
              <ng-template>
                <table class="table table-striped" style="margin: 0">
                  <tbody>
                    <tr class="row" *ngFor="let serie of excerciseRow.series">
                      <td class="fw-bold col">Serie ***REMOVED******REMOVED*** serie.serie ***REMOVED******REMOVED***</td>
                      <td class="col text-center">***REMOVED******REMOVED*** serie.reps ***REMOVED******REMOVED*** reps</td>
                      <td class="col text-center">***REMOVED******REMOVED*** serie.weightKg ***REMOVED******REMOVED***kg</td>
                    </tr>
                    <tr class="row" *ngIf="excerciseRow.total">
                      <td class="fw-bold col">Total</td>
                      <td class="col text-center">***REMOVED******REMOVED*** excerciseRow.total ***REMOVED******REMOVED*** reps</td>
                      <td class="col text-center">***REMOVED******REMOVED*** excerciseRow.series[0].weightKg ***REMOVED******REMOVED***kg</td>
                    </tr>
                  </tbody>
                </table>
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
  imports: [NgFor, NgIf, TitleCasePipe, NgClass, NgbModule]
***REMOVED***)
export class ExcerciseRowsComponent ***REMOVED***
  @Input() public excerciseRows: ExcerciseRow[] = [];
***REMOVED***