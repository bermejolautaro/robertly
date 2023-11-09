import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { ExcerciseRow } from '@models/excercise-row.model';
import { ExcerciseRowTitleComponent } from '@components/excercise-row-title.component';
import { ExcerciseRowBodyComponent } from '@components/excercise-row-body.component';

@Component({
  selector: 'app-excercise-rows',
  template: `
    <div class="row my-2">
      <div class="col">
        <div ngbAccordion>
          <div
            ngbAccordionItem
            *ngFor="let excerciseRow of filteredRows()"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgIf, TitleCasePipe, NgClass, NgbAccordionModule, ExcerciseRowTitleComponent, ExcerciseRowBodyComponent],
})
export class ExcerciseRowsComponent {
  @Input() public excerciseRows: ExcerciseRow[] = [];

  public filteredRows(): ExcerciseRow[] {
    return this.excerciseRows.filter(x => !!x.series.at(0)?.serie);
  }
}
