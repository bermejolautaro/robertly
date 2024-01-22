import { DOCUMENT, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ExcerciseRowsComponent } from '@components/excercise-rows.component';
import { GroupedExerciseRowsComponent } from '@components/grouped-exercise-rows.component';
import { PersonalRecordComponent } from '@components/personal-record.component';
import { ExerciseLogService } from '@services/exercise-log.service';

@Component({
  selector: 'app-excercise-logs-page',
  templateUrl: 'excercise-logs.page.component.html',
  styles: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    FormsModule,
    PersonalRecordComponent,
    GroupedExerciseRowsComponent,
    ExcerciseRowsComponent,
  ],
})
export class ExcerciseLogsPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  public readonly exerciseLogService = inject(ExerciseLogService);

  public isGrouped: boolean = false;

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
}
