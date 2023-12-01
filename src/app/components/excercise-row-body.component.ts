import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExcerciseRow } from '@models/excercise-row.model';

@Component({
  selector: 'app-excercise-row-body',
  template: `
    @if (excerciseRow) {
    <table class="table table-striped table-sm m-0">
      <tbody>
        @for (serie of excerciseRow.series; track serie.serie) {
        <tr class="row">
          <td class="fw-bold col">Serie {{ serie.serie }}</td>
          <td class="col text-center">{{ serie.reps }} reps</td>
          <td class="col text-center">{{ serie.weightKg }}kg</td>
        </tr>
        } 
        
        @if (excerciseRow.total) {
        <tr class="row">
          <td class="fw-bold col">Total</td>
          <td class="col text-center">{{ excerciseRow.total }} reps</td>
          <td class="col text-center">{{ excerciseRow.series[0]!.weightKg }}kg</td>
        </tr>
        } 
        
        @if (excerciseRow.average) {
        <tr class="row">
          <td class="fw-bold col">Average</td>
          <td class="col text-center">{{ excerciseRow.average }} reps</td>
          <td class="col text-center">{{ excerciseRow.series[0]!.weightKg }}kg</td>
        </tr>
        }

        <tr class="row">
          <td class="fw-bold col">Tonnage</td>
          <td class="col text-center">&nbsp;</td>
          <td class="col text-center">{{ excerciseRow.tonnage }}kg</td>
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
  @Input({ required: true }) excerciseRow!: ExcerciseRow;
}
