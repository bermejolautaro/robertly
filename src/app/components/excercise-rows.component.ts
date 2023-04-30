import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExcerciseRow } from '@app/models/excercise-row.model';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ExcerciseRowTitleComponent } from './excercise-row-title.component';
import { ExcerciseRowBodyComponent } from './excercise-row-body.component';

@Component({
  selector: 'app-excercise-rows',
  template: `
    <div class="row my-2">
      <div class="col">
        <div ngbAccordion>
          <div
            ngbAccordionItem
            *ngFor="let excerciseRow of excerciseRows"
            [ngClass]="excerciseRow.highlighted ? 'accordion-highlight ' + excerciseRow.highlighted : null"
          >
            <h2 ngbAccordionHeader>
              <button ngbAccordionButton>
                <app-excercise-row-title [excerciseRow]="excerciseRow"></app-excercise-row-title>
              </button>
            </h2>
            <div ngbAccordionCollapse>
              <div ngbAccordionBody>
                <ng-template>
                  <app-excercise-row-body [excerciseRow]="excerciseRow"></app-excercise-row-body>
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
  imports: [NgFor, NgIf, TitleCasePipe, NgClass, NgbAccordionModule, ExcerciseRowTitleComponent, ExcerciseRowBodyComponent],
})
export class ExcerciseRowsComponent {
  @Input() public excerciseRows: ExcerciseRow[] = [];
}
