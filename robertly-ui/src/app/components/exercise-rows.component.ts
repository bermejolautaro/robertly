import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { ExerciseRowTitleComponent } from '@components/exercise-row-title.component';
import { ExerciseRowBodyComponent } from '@components/exercise-row-body.component';
import { ExerciseLogDto } from '@models/exercise-log.model';

@Component({
  selector: 'app-exercise-rows',
  template: `
    <div class="row my-2">
      <div class="col">
        <div ngbAccordion>
          @for (exerciseLog of exerciseLogs; track $index) {
            <div ngbAccordionItem [ngClass]="exerciseLog.highlighted ? 'accordion-highlight ' + exerciseLog.highlighted : null">
              <h2 ngbAccordionHeader>
                <button ngbAccordionButton>
                  <app-exercise-row-title [exerciseLog]="exerciseLog"></app-exercise-row-title>
                </button>
              </h2>
              <div ngbAccordionCollapse>
                <div ngbAccordionBody>
                  <ng-template>
                    <app-exercise-row-body [exerciseLog]="exerciseLog"></app-exercise-row-body>
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
  @Input() public exerciseLogs: ExerciseLogDto[] = [];
}
