import ***REMOVED*** NgFor, NgIf, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** Component, Input ***REMOVED*** from '@angular/core';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@app/models/excercise-row.model';

@Component(***REMOVED***
  selector: 'app-excercise-row-body',
  template: `
    <table *ngIf="excerciseRow" class="table table-striped" style="margin: 0">
      <tbody>
        <tr class="row" *ngFor="let serie of excerciseRow.series">
          <td class="fw-bold col">Serie ***REMOVED******REMOVED*** serie.serie ***REMOVED******REMOVED***</td>
          <td class="col text-center">***REMOVED******REMOVED*** serie.reps ***REMOVED******REMOVED*** reps</td>
          <td class="col text-center">***REMOVED******REMOVED*** serie.weightKg ***REMOVED******REMOVED***kg</td>
        </tr>
        <tr class="row" *ngIf="excerciseRow.total">
          <td class="fw-bold col">Total</td>
          <td class="col text-center">***REMOVED******REMOVED*** excerciseRow.total ***REMOVED******REMOVED*** reps</td>
          <td class="col text-center">***REMOVED******REMOVED*** excerciseRow.series[0].weightKg ***REMOVED******REMOVED***kg</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [``],
  standalone: true,
  imports: [NgFor, NgIf, TitleCasePipe],
***REMOVED***)
export class ExcerciseRowBodyComponent ***REMOVED***
  @Input() excerciseRow: ExcerciseRow | null = null;
***REMOVED***
