import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExcerciseRow } from '@models/excercise-row.model';

@Component({
  selector: 'app-excercise-row-body',
  template: `
    <table *ngIf="excerciseRow" class="table table-striped table-sm m-0">
      <tbody>
        <tr class="row" *ngFor="let serie of excerciseRow.series">
          <td class="fw-bold col">Serie {{ serie.serie }}</td>
          <td class="col text-center">{{ serie.reps }} reps</td>
          <td class="col text-center">{{ serie.weightKg }}kg</td>
        </tr>
        <tr class="row" *ngIf="excerciseRow.total">
          <td class="fw-bold col">Total</td>
          <td class="col text-center">{{ excerciseRow.total }} reps</td>
          <td class="col text-center">{{ excerciseRow.series[0].weightKg }}kg</td>
        </tr>
        <tr class="row" *ngIf="excerciseRow.average">
          <td class="fw-bold col">Average</td>
          <td class="col text-center">{{ excerciseRow.average }} reps</td>
          <td class="col text-center">{{ excerciseRow.series[0].weightKg }}kg</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgIf],
})
export class ExcerciseRowBodyComponent {
  @Input({ required: true }) excerciseRow!: ExcerciseRow;
}
