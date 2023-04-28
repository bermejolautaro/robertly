import ***REMOVED*** NgFor, TitleCasePipe ***REMOVED*** from "@angular/common";
import ***REMOVED*** Component, Input ***REMOVED*** from "@angular/core";

import ***REMOVED*** GroupedLog ***REMOVED*** from "@app/models/grouped-log.model";
import ***REMOVED*** NgbAccordionModule, NgbModule ***REMOVED*** from "@ng-bootstrap/ng-bootstrap";

@Component(***REMOVED***
  selector: 'app-grouped-excercise-rows',
  template: `
  <div class="row my-2">
    <div class="col">
      <div ngbAccordion>
        <div ngbAccordionItem *ngFor="let namesByDate of groupedExcerciseLogs">
          <h2 ngbAccordionHeader>
            <button ngbAccordionButton>
              <div class="row w-100">
                <div class="col d-flex align-items-center justify-content-center text-center">
                  ***REMOVED******REMOVED*** namesByDate[0] ***REMOVED******REMOVED***
                </div>
              </div>
            </button>
          </h2>
          <div ngbAccordionCollapse>
            <div ngbAccordionBody>
              <ng-template>
                <div ngbAccordion>
                  <div ngbAccordionItem *ngFor="let excercisesByName of namesByDate[1]">
                    <h2 ngbAccordionHeader>
                      <button ngbAccordionButton>
                        <div class="row w-100">
                          <div class="col d-flex align-items-center justify-content-center text-center">
                            ***REMOVED******REMOVED*** excercisesByName[0] | titlecase ***REMOVED******REMOVED***
                          </div>
                        </div>
                      </button>
                    </h2>
                    <div ngbAccordionCollapse>
                      <div ngbAccordionBody>
                        <ng-template>
                          <div ngbAccordion>
                            <div ngbAccordionItem *ngFor="let logByExcercise of excercisesByName[1]">
                              <h2 ngbAccordionHeader>
                                <button ngbAccordionButton>
                                  <div class="row w-100">
                                    <div class="col d-flex align-items-center justify-content-center text-center">
                                      ***REMOVED******REMOVED*** logByExcercise[0] | titlecase ***REMOVED******REMOVED***
                                    </div>
                                  </div>
                                </button>
                              </h2>
                              <div ngbAccordionCollapse>
                                <div ngbAccordionBody>
                                  <ng-template>
                                    <table class="table table-striped" style="margin: 0">
                                      <tbody>
                                        <tr class="row" *ngFor="let serie of logByExcercise[1]">
                                          <td class="fw-bold col">Serie ***REMOVED******REMOVED*** serie.serie ***REMOVED******REMOVED***</td>
                                          <td class="col text-center">***REMOVED******REMOVED*** serie.reps ***REMOVED******REMOVED*** reps</td>
                                          <td class="col text-center">***REMOVED******REMOVED*** serie.weightKg ***REMOVED******REMOVED***kg</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </ng-template>
                                </div>
                              </div>
                            </div>
                          </div>
                        </ng-template>
                      </div>
                    </div>
                  </div>
                </div>
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
  imports: [NgFor, NgbAccordionModule, TitleCasePipe]
***REMOVED***)
export class GroupedExcerciseRowsComponent ***REMOVED***
  @Input() public groupedExcerciseLogs: GroupedLog[] = [];
***REMOVED***