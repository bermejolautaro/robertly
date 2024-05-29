import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { ExerciseRowTitleComponent } from '@components/exercise-row-title.component';
import { ExerciseRowBodyComponent } from '@components/exercise-row-body.component';
import { ExerciseRow } from '@models/exercise-row.model';

@Component({
  selector: 'app-personal-record',
  template: `
    <div ngbAccordion>
      <div ngbAccordionItem class="accordion-highlight light-blue">
        <h2 ngbAccordionHeader>
          <button ngbAccordionButton>
            <!-- <app-exercise-row-title [exerciseRow]="personalRecord" [showStar]="true"></app-exercise-row-title> -->
          </button>
        </h2>
        <div ngbAccordionCollapse>
          <div ngbAccordionBody>
            <ng-template>
              <!-- <app-exercise-row-body [exerciseRow]="personalRecord"></app-exercise-row-body> -->
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ExerciseRowTitleComponent, ExerciseRowBodyComponent, NgbAccordionModule],
})
export class PersonalRecordComponent {
  @Input({ required: true }) personalRecord!: ExerciseRow;
}
