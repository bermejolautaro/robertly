import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ExerciseLogDto } from '@models/exercise-log.model';
import { PadStartPipe } from '@pipes/pad-start.pipe';
import { ParseToDatePipe } from '@pipes/parse-to-date.pipe';
import { ExerciseLogService } from '@services/exercise-log.service';

@Component({
    selector: 'app-exercise-log',
    templateUrl: './exercise-log.component.html',
    styleUrl: './exercise-log.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TitleCasePipe,
        ParseToDatePipe,
        PadStartPipe,
    ]
})
export class ExerciseLogComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
  public readonly exerciseLog = input<ExerciseLogDto | null>();
}
