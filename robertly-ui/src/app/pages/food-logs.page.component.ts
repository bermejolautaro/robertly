import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FoodLogComponent } from '@components/food-log.component';
import { PaginatorComponent } from '@components/paginator.component';
import { FoodLogsApiService } from '@services/food-logs-api.service';
import { FoodsApiService } from '@services/foods-api.service';
import { Paths } from 'src/main';

@Component({
  selector: 'app-food-logs-page',
  template: `
    <div class="header-footer-padding">
      <div class="container">
        <div class="d-flex justify-content-end mb-3">
          <button
            class="btn btn-link p-0 d-flex align-items-center add-log-button"
            (click)="navigateToAddLog()"
          >
            Add Food Log
            <i class="iconoir-plus-circle-solid add-log-icon"></i>
          </button>
        </div>
        @for (log of foodLogs.value()?.data; track log.foodLogId) {
          @if (!!log) {
            <app-food-log [foodLog]="log"></app-food-log>
          } @else {
            <div class="log">
              <div class="grid">
                <div class="d-flex flex-column placeholder-glow">
                  <div class="title"><span class="placeholder col-6"></span></div>
                  <div class="hint"><span class="placeholder col-12"></span></div>
                </div>
              </div>
            </div>
          }
        } @empty {
          <div class="position-absolute top-50 start-50 translate-middle">
            <div
              class="app-spinner spinner-border text-primary"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        }

        @if (foodLogs.value()?.data?.length) {
          <app-paginator
            [(currentPage)]="currentPage"
            [pageCount]="foodLogs.value()?.pageCount ?? 0"
          ></app-paginator>
        }
      </div>
    </div>
  `,
  styles: `
    .add-log-button {
      text-decoration: none;
      color: white;
    }

    .add-log-icon {
      font-size: 1.2rem;
      margin: 0 0.3rem;
    }

    .grid {
      display: grid;
      grid-template-columns: auto auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FoodLogComponent, PaginatorComponent],
})
export class FoodsPageComponent {
  private readonly foodsApiService = inject(FoodsApiService);
  private readonly foodLogsApiService = inject(FoodLogsApiService);
  private readonly router = inject(Router);

  public readonly currentPage = signal<number>(0);

  public readonly foodLogs = rxResource({
    stream: () => this.foodLogsApiService.getFoodLogs(this.currentPage(), 10),
  });

  public readonly foods = rxResource({
    stream: () => this.foodsApiService.getFoods(),
  });

  public constructor() {
    effect(() => {
      this.currentPage();
      this.foodLogs.reload();
    });
  }

  public navigateToAddLog(): void {
    this.router.navigate([Paths.FOOD_LOGS, Paths.CREATE]);
  }
}
