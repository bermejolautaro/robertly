import { NgClass, NgFor, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { ExcerciseRowBodyComponent } from '@components/excercise-row-body.component';
import { ExcerciseRowTitleComponent } from '@components/excercise-row-title.component';
import { ExerciseLogService } from '@services/excercise-log.service';
import { ParseToDatePipe } from '@pipes/parse-to-date.pipe';

@Component({
  selector: 'app-grouped-exercise-rows',
  templateUrl: './grouped-exercise-rows.component.html',
  styles: `
    table {
      td, tr {
        font-size: 12px;
        padding: .3rem;
      }
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgbAccordionModule, TitleCasePipe, ParseToDatePipe, NgClass, ExcerciseRowBodyComponent, ExcerciseRowTitleComponent],
})
export class GroupedExerciseRowsComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
}
