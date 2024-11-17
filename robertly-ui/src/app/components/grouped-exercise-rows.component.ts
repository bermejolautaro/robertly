import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseLogService } from '@services/exercise-log.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbAccordionModule],
})
export class GroupedExerciseRowsComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
}
