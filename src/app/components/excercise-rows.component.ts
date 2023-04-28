import { NgClass, NgFor, NgIf, TitleCasePipe } from "@angular/common";
import { Component, Input } from "@angular/core";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ExcerciseRow } from "@app/models/excercise-row.model";

@Component({
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
                  {{ excerciseRow.excerciseName | titlecase }}
                </div>
                <div class="col-4 d-flex align-items-center justify-content-center text-center">
                  {{ excerciseRow.date }}
                </div>
                <div class="col-4 d-flex align-items-center justify-content-center text-center">
                  {{ excerciseRow.username | titlecase }}
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
                      <td class="fw-bold col">Serie {{ serie.serie }}</td>
                      <td class="col text-center">{{ serie.reps }} reps</td>
                      <td class="col text-center">{{ serie.weightKg }}kg</td>
                    </tr>
                    <tr class="row" *ngIf="excerciseRow.total">
                      <td class="fw-bold col">Total</td>
                      <td class="col text-center">{{ excerciseRow.total }} reps</td>
                      <td class="col text-center">{{ excerciseRow.series[0].weightKg }}kg</td>
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
})
export class ExcerciseRowsComponent {
  @Input() public excerciseRows: ExcerciseRow[] = [];
}