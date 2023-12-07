import { NgClass, NgFor, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { GroupedLog } from '@models/grouped-log.model';
import { ExcerciseRowBodyComponent } from '@components/excercise-row-body.component';
import { ExcerciseRowTitleComponent } from '@components/excercise-row-title.component';

@Component({
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
                    {{ exerciseLogsPerExerciseNamePerUsernamePerDate[0] }}
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
                              {{ exerciseLogsPerExerciseNamePerUsername[0] | titlecase }}
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
})
export class GroupedExcerciseRowsComponent {
  @Input({alias: 'groupedExcerciseLogs'}) public exerciseLogsPerExerciseNamePerUsernamePerDateList: GroupedLog[] = [];

  public ngOnInit(): void {
    console.log(this.exerciseLogsPerExerciseNamePerUsernamePerDateList);
  }
}
