import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { ExerciseRow } from '@models/exercise-row.model';
import { ExerciseRowTitleComponent } from '@components/exercise-row-title.component';
import { ExerciseRowBodyComponent } from '@components/exercise-row-body.component';

@Component({
  selector: 'app-exercise-rows',
  template: `
    <div class="row my-2">
      <div class="col">
        <div ngbAccordion>
          @for (exerciseRow of exerciseRows; track $index) {
            <div ngbAccordionItem [ngClass]="exerciseRow.highlighted ? 'accordion-highlight ' + exerciseRow.highlighted : null">
              <h2 ngbAccordionHeader>
                <button ngbAccordionButton>
                  <app-exercise-row-title [exerciseRow]="exerciseRow"></app-exercise-row-title>
                </button>
              </h2>
              <div ngbAccordionCollapse>
                <div ngbAccordionBody>
                  <ng-template>
                    <app-exercise-row-body [exerciseRow]="exerciseRow"></app-exercise-row-body>
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
  imports: [NgClass, NgTemplateOutlet, NgbAccordionModule, ExerciseRowTitleComponent, ExerciseRowBodyComponent],
})
export class ExerciseRowsComponent {
  @Input() public exerciseRows: ExerciseRow[] = [];
}
