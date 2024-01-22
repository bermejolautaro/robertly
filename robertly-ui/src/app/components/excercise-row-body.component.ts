import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ExerciseRow } from '@models/excercise-row.model';
import { ExerciseLogService } from '@services/exercise-log.service';

@Component({
  selector: 'app-excercise-row-body',
  template: `
    @if (exerciseRow) {
      <table class="table table-striped table-sm m-0" (click)="exerciseLogService.logClicked$.next(exerciseRow)">
        <tbody>
          @for (serie of exerciseRow.series; track $index) {
            <tr class="row">
              <td class="fw-bold col">Serie {{ $index + 1 }}</td>
              <td class="col text-center">{{ serie.reps }} reps</td>
              <td class="col text-center">{{ serie.weightInKg }}kg</td>
            </tr>
          }

          @if (exerciseRow.total) {
            <tr class="row">
              <td class="fw-bold col">Total</td>
              <td class="col text-center">{{ exerciseRow.total }} reps</td>
              <td class="col text-center">{{ exerciseRow.series[0]!.weightInKg }}kg</td>
            </tr>
          }

          @if (exerciseRow.average) {
            <tr class="row">
              <td class="fw-bold col">Average</td>
              <td class="col text-center">{{ exerciseRow.average }} reps</td>
              <td class="col text-center">{{ exerciseRow.series[0]!.weightInKg }}kg</td>
            </tr>
          }

          <tr class="row">
            <td class="fw-bold col">Tonnage</td>
            <td class="col text-center">&nbsp;</td>
            <td class="col text-center">{{ exerciseRow.tonnage }}kg</td>
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
export class ExcerciseRowBodyComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
  @Input({ required: true }) exerciseRow!: ExerciseRow;
}
