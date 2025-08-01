import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FoodLogsApiService } from '@services/food-logs-api.service';
import { ProgressBarComponent } from '@components/progress-bar.component';
import { ParseToDatePipe } from '@pipes/parse-to-date.pipe';
import { PaginatorComponent } from '@components/paginator.component';

@Component({
  selector: 'app-series-per-muscle-page',
  template: `
    @for (macro of macros.value()?.data; track $index) {
      <div class="pb-2">
        <div>{{ macro.date | parseToDate }}</div>
        <app-progress-bar
          [current]="macro.calories"
          [goal]="2300"
          [label]="'Calories'"
        ></app-progress-bar>
        <app-progress-bar
          [current]="macro.protein"
          [goal]="130"
          [label]="'Protein'"
        ></app-progress-bar>
      </div>
    }
    <app-paginator
      [(currentPage)]="currentPage"
      [pageCount]="macros.value()?.pageCount ?? 0"
    ></app-paginator>
  `,
  styles: `
    .badge.chip {
      font-size: 16px;
      font-weight: 400;

      &.active {
        --bs-btn-active-border-color: transparent;
        --bs-btn-active-bg: var(--primary);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, ProgressBarComponent, PaginatorComponent, ParseToDatePipe],
})
export class SeriesPerMusclePageComponent {
  private readonly foodLogsApiService = inject(FoodLogsApiService);

  public readonly currentPage = signal<number>(0);

  public readonly macros = rxResource({
    loader: () => this.foodLogsApiService.getMacrosDaily(this.currentPage()),
  });

  public constructor() {
    effect(() => {
      this.currentPage();
      this.macros.reload();
    })
  }
}
