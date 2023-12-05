import ***REMOVED*** ChangeDetectionStrategy, Component, Input ***REMOVED*** from '@angular/core';
import ***REMOVED*** ExerciseRow ***REMOVED*** from '@models/excercise-row.model';

@Component(***REMOVED***
  selector: 'app-excercise-row-body',
  template: `
    @if (exerciseRow) ***REMOVED***
      <table class="table table-striped table-sm m-0">
        <tbody>
          @for (serie of exerciseRow.series; track serie.serie) ***REMOVED***
            <tr class="row">
              <td class="fw-bold col">Serie ***REMOVED******REMOVED*** serie.serie ***REMOVED******REMOVED***</td>
              <td class="col text-center">***REMOVED******REMOVED*** serie.reps ***REMOVED******REMOVED*** reps</td>
              <td class="col text-center">***REMOVED******REMOVED*** serie.weightKg ***REMOVED******REMOVED***kg</td>
            </tr>
      ***REMOVED***

          @if (exerciseRow.total) ***REMOVED***
            <tr class="row">
              <td class="fw-bold col">Total</td>
              <td class="col text-center">***REMOVED******REMOVED*** exerciseRow.total ***REMOVED******REMOVED*** reps</td>
              <td class="col text-center">***REMOVED******REMOVED*** exerciseRow.series[0]!.weightKg ***REMOVED******REMOVED***kg</td>
            </tr>
      ***REMOVED***

          @if (exerciseRow.average) ***REMOVED***
            <tr class="row">
              <td class="fw-bold col">Average</td>
              <td class="col text-center">***REMOVED******REMOVED*** exerciseRow.average ***REMOVED******REMOVED*** reps</td>
              <td class="col text-center">***REMOVED******REMOVED*** exerciseRow.series[0]!.weightKg ***REMOVED******REMOVED***kg</td>
            </tr>
      ***REMOVED***

          <tr class="row">
            <td class="fw-bold col">Tonnage</td>
            <td class="col text-center">&nbsp;</td>
            <td class="col text-center">***REMOVED******REMOVED*** exerciseRow.tonnage ***REMOVED******REMOVED***kg</td>
          </tr>
        </tbody>
      </table>
***REMOVED***
  `,
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
***REMOVED***)
export class ExcerciseRowBodyComponent ***REMOVED***
  @Input(***REMOVED*** required: true ***REMOVED***) exerciseRow!: ExerciseRow;
***REMOVED***
