import { KeyValuePipe, NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ParseToMonthPipe } from '@pipes/parse-to-month.pipe';
import { ExerciseLogService } from '@services/excercise-log.service';

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
              {{ this.exerciseLogService.selectedMonth() | parseToMonth: DEFAULT_MONTH_LABEL }}
            </button>
            <div ngbDropdownMenu class="w-100">
              @for (month of exerciseLogService.months(); track $index) {
                <button
                  ngbDropdownItem
                  [ngClass]="{ active: month === this.exerciseLogService.selectedMonth() }"
                  (click)="exerciseLogService.selectedMonth$.next(month)"
                >
                  {{ month | parseToMonth: DEFAULT_MONTH_LABEL }}
                </button>
              }
            </div>
          </div>
        </div>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TitleCasePipe, KeyValuePipe, ParseToMonthPipe, NgbDropdownModule],
})
export class SeriesPerMuscleGroupMonthlyComponent implements OnInit {
  public readonly exerciseLogService = inject(ExerciseLogService);

  public readonly DEFAULT_MONTH_LABEL = DEFAULT_MONTH_LABEL;

  public ngOnInit(): void {
    if (!this.exerciseLogService.selectedMonth()) {
      this.exerciseLogService.selectedMonth$.next(this.exerciseLogService.months()[0] ?? null);
    }
  }
}
