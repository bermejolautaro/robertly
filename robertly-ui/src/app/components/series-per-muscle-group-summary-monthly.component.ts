import { KeyValuePipe, NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ParseToMonthPipe } from '@pipes/parse-to-month.pipe';
import { ExerciseLogService } from '@services/exercise-log.service';

@Component({
    selector: 'app-series-per-muscle-group-summary-monthly',
    template: `
    <div class="table-responsive">
      <!-- <table class="table table-sm m-0 mb-3">
        <thead>
          <tr>
            <td scope="col" class="fw-semibold">Muscle Group</td>
            @if (this.exerciseLogService.selectedMonth(); as selectedMonth) {
              @for (
                seriesPerMuscleGroup of exerciseLogService.seriesPerMuscleGroupPerUserPerMonth()[selectedMonth] | keyvalue;
                track $index
              ) {
                <td class="text-center fw-semibold">{{ seriesPerMuscleGroup.key | titlecase }}</td>
              }
            }
            <td class="text-center fw-semibold">Target</td>
          </tr>
        </thead>
        <tbody>
          @for (muscleGroup of exerciseLogService.muscleGroups(); track $index) {
            <tr>
              <td class="fw-semibold">{{ muscleGroup | titlecase }}</td>
              @if (this.exerciseLogService.selectedMonth(); as selectedMonth) {
                @for (
                  seriesPerMuscleGroupPerUser of exerciseLogService.seriesPerMuscleGroupPerUserPerMonth()[selectedMonth] | keyvalue;
                  track $index
                ) {
                  <td class="text-center">
                    {{ seriesPerMuscleGroupPerUser.value[muscleGroup] || 0 }}
                  </td>
                }
              }
              <td class="text-center">40</td>
            </tr>
          }
        </tbody>
      </table> -->
    </div>
  `,
    styles: [
        `
      :host {
        display: block;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbDropdownModule]
})
export class SeriesPerMuscleGroupSummaryMonthlyComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
}
