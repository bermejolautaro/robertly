import ***REMOVED*** NgClass, NgFor, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, Input ***REMOVED*** from '@angular/core';

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
          <div ngbAccordionItem *ngFor="let exerciseLogsPerExerciseNamePerUsernamePerDate of exerciseLogsPerExerciseNamePerUsernamePerDateList">
            <h2 ngbAccordionHeader>
              <button ngbAccordionButton>
                <div class="row w-100">
                  <div class="col d-flex align-items-center justify-content-center text-center">
                    ***REMOVED******REMOVED*** exerciseLogsPerExerciseNamePerUsernamePerDate[0] ***REMOVED******REMOVED***
                  </div>
                </div>
              </button>
            </h2>
            <div ngbAccordionCollapse>
              <div ngbAccordionBody>
                <ng-template>
                  <div ngbAccordion>
                    <div ngbAccordionItem *ngFor="let exerciseLogsPerExerciseNamePerUsername of exerciseLogsPerExerciseNamePerUsernamePerDate[1]">
                      <h2 ngbAccordionHeader>
                        <button ngbAccordionButton>
                          <div class="row w-100">
                            <div class="col d-flex align-items-center justify-content-center text-center">
                              ***REMOVED******REMOVED*** exerciseLogsPerExerciseNamePerUsername[0] | titlecase ***REMOVED******REMOVED***
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
                                *ngFor="let exerciseLogsPerExerciseName of exerciseLogsPerExerciseNamePerUsername[1]"
                                [ngClass]="exerciseLogsPerExerciseName[1].highlighted ? 'accordion-highlight ' + exerciseLogsPerExerciseName[1].highlighted : null"
                              >
                                <h2 ngbAccordionHeader>
                                  <button ngbAccordionButton>
                                    <app-excercise-row-title
                                      [showUsername]="false"
                                      [showDate]="false"
                                      [exerciseRow]="exerciseLogsPerExerciseName[1]"
                                    ></app-excercise-row-title>
                                  </button>
                                </h2>
                                <div ngbAccordionCollapse>
                                  <div ngbAccordionBody>
                                    <ng-template>
                                      <app-excercise-row-body [exerciseRow]="exerciseLogsPerExerciseName[1]"></app-excercise-row-body>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgbAccordionModule, TitleCasePipe, NgClass, ExcerciseRowBodyComponent, ExcerciseRowTitleComponent],
***REMOVED***)
export class GroupedExcerciseRowsComponent ***REMOVED***
  @Input(***REMOVED***alias: 'groupedExcerciseLogs'***REMOVED***) public exerciseLogsPerExerciseNamePerUsernamePerDateList: GroupedLog[] = [];

  public ngOnInit(): void ***REMOVED***
***REMOVED***
***REMOVED***
