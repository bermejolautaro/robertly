import { NgFor, TitleCasePipe } from "@angular/common";
import { Component, Input } from "@angular/core";

import { GroupedLog } from "@app/models/grouped-log.model";
import { NgbAccordionModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";

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
                  <div ngbAccordionItem *ngFor="let excercisesByName of namesByDate[1]">
                    <h2 ngbAccordionHeader>
                      <button ngbAccordionButton>
                        <div class="row w-100">
                          <div class="col d-flex align-items-center justify-content-center text-center">
                            {{ excercisesByName[0] | titlecase }}
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
                                      {{ logByExcercise[0] | titlecase }}
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
                                          <td class="fw-bold col">Serie {{ serie.serie }}</td>
                                          <td class="col text-center">{{ serie.reps }} reps</td>
                                          <td class="col text-center">{{ serie.weightKg }}kg</td>
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
})
export class GroupedExcerciseRowsComponent {
  @Input() public groupedExcerciseLogs: GroupedLog[] = [];
}