import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { ExcerciseRowTitleComponent } from '@components/excercise-row-title.component';
import { ExcerciseRowBodyComponent } from '@components//excercise-row-body.component';
import { ExcerciseRow } from '@models/excercise-row.model';

@Component({
  selector: 'app-personal-record',
  template: `
    <h5 class="mb-3">Personal record</h5>
    <div ngbAccordion>
      <div ngbAccordionItem class="accordion-highlight light-blue">
        <h2 ngbAccordionHeader>
          <button ngbAccordionButton>
            <app-excercise-row-title [excerciseRow]="personalRecord"></app-excercise-row-title>
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
  @Input() personalRecord: ExcerciseRow | null = null;
}
