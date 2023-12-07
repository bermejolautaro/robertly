import ***REMOVED*** KeyValuePipe, NgClass, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, inject ***REMOVED*** from '@angular/core';

import ***REMOVED*** NgbDropdownModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** ParseToMonthPipe ***REMOVED*** from '@pipes/parse-to-month.pipe';
import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';

@Component(***REMOVED***
  selector: 'app-series-per-muscle-group-summary-monthly',
  template: `
    <table class="table table-sm m-0 mb-3">
      <thead>
        <tr>
          <td scope="col" class="fw-semibold">Muscle Group</td>
          @if (this.exerciseLogService.selectedMonth(); as selectedMonth) ***REMOVED***
            @for (
              seriesPerMuscleGroup of exerciseLogService.seriesPerMuscleGroupPerUserPerMonth()[selectedMonth] | keyvalue;
              track $index
            ) ***REMOVED***
              <td class="text-center fw-semibold">***REMOVED******REMOVED*** seriesPerMuscleGroup.key | titlecase ***REMOVED******REMOVED***</td>
        ***REMOVED***
      ***REMOVED***
          <td class="text-center fw-semibold">Target</td>
        </tr>
      </thead>
      <tbody>
        @for (muscleGroup of exerciseLogService.muscleGroups(); track $index) ***REMOVED***
          <tr>
            <td class="fw-semibold">***REMOVED******REMOVED*** muscleGroup | titlecase ***REMOVED******REMOVED***</td>
            @if (this.exerciseLogService.selectedMonth(); as selectedMonth) ***REMOVED***
              @for (
                seriesPerMuscleGroupPerUser of exerciseLogService.seriesPerMuscleGroupPerUserPerMonth()[selectedMonth] | keyvalue;
                track $index
              ) ***REMOVED***
                <td class="text-center">
                  ***REMOVED******REMOVED*** seriesPerMuscleGroupPerUser.value[muscleGroup] || 0 ***REMOVED******REMOVED***
                </td>
          ***REMOVED***
        ***REMOVED***
            <td class="text-center">40</td>
          </tr>
    ***REMOVED***
      </tbody>
    </table>
  `,
  styles: [
    `
      :host ***REMOVED***
        display: block;
  ***REMOVED***
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TitleCasePipe, KeyValuePipe, ParseToMonthPipe, NgbDropdownModule],
***REMOVED***)
export class SeriesPerMuscleGroupSummaryMonthlyComponent ***REMOVED***
  public readonly exerciseLogService = inject(ExerciseLogService);
***REMOVED***
