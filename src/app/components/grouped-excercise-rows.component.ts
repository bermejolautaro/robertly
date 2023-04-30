import { NgClass, NgFor, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { GroupedLog } from '@app/models/grouped-log.model';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ExcerciseRowBodyComponent } from './excercise-row-body.component';

@Component({
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
                    {{ namesByDate[0] }}
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
                              {{ excercisesByUsername[0] | titlecase }}
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
                                    <div class="row w-100">
                                      <div class="col d-flex align-items-center justify-content-center text-center">
                                        {{ logByExcercise[0] | titlecase }}
                                      </div>
                                    </div>
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
  imports: [NgFor, NgbAccordionModule, TitleCasePipe, NgClass, ExcerciseRowBodyComponent],
})
export class GroupedExcerciseRowsComponent {
  @Input() public groupedExcerciseLogs: GroupedLog[] = [];
}
