import ***REMOVED*** KeyValuePipe, NgClass, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, OnInit, inject ***REMOVED*** from '@angular/core';

import ***REMOVED*** NgbDropdownModule, NgbPopoverModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** ParseToMonthPipe ***REMOVED*** from '@pipes/parse-to-month.pipe';
import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';

const DEFAULT_MONTH_LABEL = 'Month';

@Component(***REMOVED***
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
              ***REMOVED******REMOVED*** this.exerciseLogService.selectedMonth() | parseToMonth: DEFAULT_MONTH_LABEL ***REMOVED******REMOVED***
            </button>
            <div ngbDropdownMenu class="w-100">
              @for (month of exerciseLogService.months(); track $index) ***REMOVED***
                <button
                  ngbDropdownItem
                  [ngClass]="***REMOVED*** active: month === this.exerciseLogService.selectedMonth() ***REMOVED***"
                  (click)="exerciseLogService.selectedMonth$.next(month)"
                >
                  ***REMOVED******REMOVED*** month | parseToMonth: DEFAULT_MONTH_LABEL ***REMOVED******REMOVED***
                </button>
          ***REMOVED***
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
            ***REMOVED******REMOVED*** exerciseLogService.daysTrainedInSelectedMonthMessage() ***REMOVED******REMOVED***
          </div>
        </div>
      </div>
    </div>

    <ng-template #popoverTemplate>
      <div>
        @for (days of exerciseLogService.daysAmountByDayInSelectedMonth() | keyvalue; track $index) ***REMOVED***
          <div>***REMOVED******REMOVED*** days.key ***REMOVED******REMOVED***: ***REMOVED******REMOVED*** days.value ***REMOVED******REMOVED***</div>
    ***REMOVED***
      </div>
    </ng-template>
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
  imports: [NgClass, NgbPopoverModule, TitleCasePipe, KeyValuePipe, ParseToMonthPipe, NgbDropdownModule],
***REMOVED***)
export class SeriesPerMuscleGroupMonthlyComponent implements OnInit ***REMOVED***
  public readonly exerciseLogService = inject(ExerciseLogService);

  public readonly DEFAULT_MONTH_LABEL = DEFAULT_MONTH_LABEL;

  public ngOnInit(): void ***REMOVED***
    if (!this.exerciseLogService.selectedMonth()) ***REMOVED***
      this.exerciseLogService.selectedMonth$.next(this.exerciseLogService.months()[0] ?? null);
***REMOVED***
***REMOVED***
***REMOVED***
