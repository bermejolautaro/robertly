import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { ExerciseRowBodyComponent } from '@components/exercise-row-body.component';
import { ExerciseRowTitleComponent } from '@components/exercise-row-title.component';
import { ExerciseLogService } from '@services/exercise-log.service';
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
  imports: [NgbAccordionModule, TitleCasePipe, ParseToDatePipe, NgClass, ExerciseRowBodyComponent, ExerciseRowTitleComponent],
})
export class GroupedExerciseRowsComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
}
