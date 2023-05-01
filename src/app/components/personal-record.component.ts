import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExcerciseRowTitleComponent } from '@app/components/excercise-row-title.component';
import { ExcerciseRowBodyComponent } from '@app/components//excercise-row-body.component';
import { ExcerciseRow } from '@app/models/excercise-row.model';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-personal-record',
  template: `
    <ng-container *ngIf="personalRecord">
      <h5>Personal record</h5>
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
    </ng-container>
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
