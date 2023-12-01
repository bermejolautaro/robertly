import ***REMOVED*** ChangeDetectionStrategy, Component, Input ***REMOVED*** from '@angular/core';
import ***REMOVED*** ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';

@Component(***REMOVED***
  selector: 'app-excercise-row-body',
  template: `
    @if (excerciseRow) ***REMOVED***
    <table class="table table-striped table-sm m-0">
      <tbody>
        @for (serie of excerciseRow.series; track serie.serie) ***REMOVED***
        <tr class="row">
          <td class="fw-bold col">Serie ***REMOVED******REMOVED*** serie.serie ***REMOVED******REMOVED***</td>
          <td class="col text-center">***REMOVED******REMOVED*** serie.reps ***REMOVED******REMOVED*** reps</td>
          <td class="col text-center">***REMOVED******REMOVED*** serie.weightKg ***REMOVED******REMOVED***kg</td>
        </tr>
    ***REMOVED*** 
        
        @if (excerciseRow.total) ***REMOVED***
        <tr class="row">
          <td class="fw-bold col">Total</td>
          <td class="col text-center">***REMOVED******REMOVED*** excerciseRow.total ***REMOVED******REMOVED*** reps</td>
          <td class="col text-center">***REMOVED******REMOVED*** excerciseRow.series[0]!.weightKg ***REMOVED******REMOVED***kg</td>
        </tr>
    ***REMOVED*** 
        
        @if (excerciseRow.average) ***REMOVED***
        <tr class="row">
          <td class="fw-bold col">Average</td>
          <td class="col text-center">***REMOVED******REMOVED*** excerciseRow.average ***REMOVED******REMOVED*** reps</td>
          <td class="col text-center">***REMOVED******REMOVED*** excerciseRow.series[0]!.weightKg ***REMOVED******REMOVED***kg</td>
        </tr>
    ***REMOVED***

        <tr class="row">
          <td class="fw-bold col">Tonnage</td>
          <td class="col text-center">&nbsp;</td>
          <td class="col text-center">***REMOVED******REMOVED*** excerciseRow.tonnage ***REMOVED******REMOVED***kg</td>
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
  @Input(***REMOVED*** required: true ***REMOVED***) excerciseRow!: ExcerciseRow;
***REMOVED***
