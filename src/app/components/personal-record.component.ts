import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { ExcerciseRowTitleComponent } from '@components/excercise-row-title.component';
import { ExcerciseRowBodyComponent } from '@components//excercise-row-body.component';
import { ExcerciseRow } from '@models/excercise-row.model';

@Component({
  selector: 'app-personal-record',
  template: `
    <div ngbAccordion>
      <div ngbAccordionItem class="accordion-highlight light-blue">
        <h2 ngbAccordionHeader>
          <button ngbAccordionButton>
            <app-excercise-row-title [excerciseRow]="personalRecord" [showStar]="true"></app-excercise-row-title>
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
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  standalone: true,
  imports: [NgIf, ExcerciseRowTitleComponent, ExcerciseRowBodyComponent, NgbAccordionModule],
})
export class PersonalRecordComponent {
  @Input({ required: true }) personalRecord!: ExcerciseRow;
}
