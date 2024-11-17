import { KeyValuePipe, NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { ParseToMonthPipe } from '@pipes/parse-to-month.pipe';
import { ExerciseLogService } from '@services/exercise-log.service';

const DEFAULT_MONTH_LABEL = 'Month';

@Component({
    selector: 'app-series-per-muscle-group-monthly',
    template: `
    <div class="card border-0 shadow-material-1">
      <div class="card-body">
        <div class="card-title mb-3">
          <h5>Series Per Muscle Group - Monthly</h5>
        </div>
        <div class="mb-3">
          <div ngbDropdown class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-primary w-100" ngbDropdownToggle>
            </button>
            <div ngbDropdownMenu class="w-100">
              <!-- @for (month of exerciseLogService.months(); track $index) {
                <button
                  ngbDropdownItem
                  [ngClass]="{ active: month === this.exerciseLogService.selectedMonth() }"
                  (click)="exerciseLogService.selectedMonth$.next(month)"
                >
                  {{ month | parseToMonth: DEFAULT_MONTH_LABEL }}
                </button>
              } -->
            </div>
          </div>
        </div>
        <ng-content></ng-content>
        <div (click)="popover.open()">
          <div
            class="fw-semibold"
            style="display: inline-block"
            popoverTitle="Days trained details"
            [autoClose]="true"
            [ngbPopover]="popoverTemplate"
            #popover="ngbPopover"
          >
          </div>
        </div>
      </div>
    </div>

    <ng-template #popoverTemplate>
      <div>

      </div>
    </ng-template>
  `,
    styles: [
        `
      :host {
        display: block;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbPopoverModule, NgbDropdownModule]
})
export class SeriesPerMuscleGroupMonthlyComponent implements OnInit {
  public readonly exerciseLogService = inject(ExerciseLogService);

  public readonly DEFAULT_MONTH_LABEL = DEFAULT_MONTH_LABEL;

  public ngOnInit(): void {

  }
}
