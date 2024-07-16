import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ExerciseLogDto } from '@models/exercise-log.model';
import { PadStartPipe } from '@pipes/pad-start.pipe';
import { ParseToDatePipe } from '@pipes/parse-to-date.pipe';
import { ExerciseLogService } from '@services/exercise-log.service';

@Component({
  selector: 'app-exercise-log',
  templateUrl: './exercise-log.component.html',
  styleUrl: './exercise-log.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleCasePipe,
    ParseToDatePipe,
    PadStartPipe,
    DecimalPipe
  ],
})
export class ExerciseLogComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
  @Input({ required: true }) exerciseLog!: ExerciseLogDto;
}
