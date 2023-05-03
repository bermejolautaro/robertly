import ***REMOVED*** NgClass, NgFor, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, Input ***REMOVED*** from '@angular/core';

import ***REMOVED*** NgbAccordionModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** GroupedLog ***REMOVED*** from '@models/grouped-log.model';
import ***REMOVED*** ExcerciseRowBodyComponent ***REMOVED*** from '@components/excercise-row-body.component';
import ***REMOVED*** ExcerciseRowTitleComponent ***REMOVED*** from '@components/excercise-row-title.component';

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
                    <div ngbAccordionItem *ngFor="let excercisesByUsername of namesByDate[1]">
                      <h2 ngbAccordionHeader>
                        <button ngbAccordionButton>
                          <div class="row w-100">
                            <div class="col d-flex align-items-center justify-content-center text-center">
                              ***REMOVED******REMOVED*** excercisesByUsername[0] | titlecase ***REMOVED******REMOVED***
                            </div>
                          </div>
                        </button>
                      </h2>
                      <div ngbAccordionCollapse>
                        <div ngbAccordionBody>
                          <ng-template>
                            <div ngbAccordion>
                              <div
                                ngbAccordionItem
                                *ngFor="let logByExcercise of excercisesByUsername[1]"
                                [ngClass]="logByExcercise[1].highlighted ? 'accordion-highlight ' + logByExcercise[1].highlighted : null"
                              >
                                <h2 ngbAccordionHeader>
                                  <button ngbAccordionButton>
                                    <app-excercise-row-title
                                      [showUsername]="false"
                                      [showDate]="false"
                                      [excerciseRow]="logByExcercise[1]"
                                    ></app-excercise-row-title>
                                  </button>
                                </h2>
                                <div ngbAccordionCollapse>
                                  <div ngbAccordionBody>
                                    <ng-template>
                                      <app-excercise-row-body [excerciseRow]="logByExcercise[1]"></app-excercise-row-body>
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
  imports: [NgFor, NgbAccordionModule, TitleCasePipe, NgClass, ExcerciseRowBodyComponent, ExcerciseRowTitleComponent],
***REMOVED***)
export class GroupedExcerciseRowsComponent ***REMOVED***
  @Input() public groupedExcerciseLogs: GroupedLog[] = [];
***REMOVED***
