import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ExerciseLogDto } from '@models/exercise-log.model';
import { ExerciseLogService } from '@services/exercise-log.service';

@Component({
  selector: 'app-exercise-row-body',
  template: `
    @if (exerciseLog) {
      <table class="table table-striped table-sm m-0" (click)="exerciseLogService.logClicked$.next(exerciseLog)">
        <tbody>
          @for (serie of exerciseLog.series; track $index) {
            <tr class="row">
              <td class="fw-bold col">Serie {{ $index + 1 }}</td>
              <td class="col text-center">{{ serie.reps }} reps</td>
              <td class="col text-center">{{ serie.weightInKg }}kg</td>
            </tr>
          }

          @if (exerciseLog.totalReps) {
            <tr class="row">
              <td class="fw-bold col">Total</td>
              <td class="col text-center">{{ exerciseLog.totalReps }} reps</td>
              <td class="col text-center">{{ exerciseLog.series[0]!.weightInKg }}kg</td>
            </tr>
          }

          @if (exerciseLog.average) {
            <tr class="row">
              <td class="fw-bold col">Average</td>
              <td class="col text-center">{{ exerciseLog.average }} reps</td>
              <td class="col text-center">{{ exerciseLog.series[0]!.weightInKg }}kg</td>
            </tr>
          }

          <tr class="row">
            <td class="fw-bold col">Tonnage</td>
            <td class="col text-center">&nbsp;</td>
            <td class="col text-center">{{ exerciseLog.tonnage }}kg</td>
          </tr>
        </tbody>
      </table>
    }
  `,
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ExerciseRowBodyComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
  @Input({ required: true }) exerciseLog!: ExerciseLogDto;
}
