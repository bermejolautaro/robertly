import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { ExerciseRow } from '@models/excercise-row.model';
import { ExcerciseRowTitleComponent } from '@components/excercise-row-title.component';
import { ExcerciseRowBodyComponent } from '@components/excercise-row-body.component';

@Component({
  selector: 'app-excercise-rows',
  template: `
    <div class="row my-2">
      <div class="col">
        <div ngbAccordion>
          @for (exerciseRow of exerciseRows; track $index) {
            <div ngbAccordionItem [ngClass]="exerciseRow.highlighted ? 'accordion-highlight ' + exerciseRow.highlighted : null">
              <h2 ngbAccordionHeader>
                <button ngbAccordionButton>
                  <app-excercise-row-title [exerciseRow]="exerciseRow"></app-excercise-row-title>
                </button>
              </h2>
              <div ngbAccordionCollapse>
                <div ngbAccordionBody>
                  <ng-template>
                    <app-excercise-row-body [exerciseRow]="exerciseRow"></app-excercise-row-body>
                  </ng-template>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgTemplateOutlet, NgbAccordionModule, ExcerciseRowTitleComponent, ExcerciseRowBodyComponent],
})
export class ExcerciseRowsComponent {
  @Input() public exerciseRows: ExerciseRow[] = [];
}
