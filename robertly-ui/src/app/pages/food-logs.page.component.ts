import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FoodLogComponent } from '@components/food-log/food-log.component';
import { PaginatorComponent } from '@components/paginator.component';
import { FoodLogsApiService } from '@services/food-logs-api.service';
import { FoodsApiService } from '@services/foods-api.service';
import { Paths } from 'src/main';

@Component({
  selector: 'app-food-logs-page',
  templateUrl: './food-logs.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FoodLogComponent, PaginatorComponent],
})
export class FoodsPageComponent {
  private readonly foodsApiService = inject(FoodsApiService);
  private readonly foodLogsApiService = inject(FoodLogsApiService);
  private readonly router = inject(Router);

  public readonly currentPage = signal<number>(0);

  public readonly foodLogs = rxResource({
    stream: () => this.foodLogsApiService.getFoodLogs(this.currentPage()),
  });

  public readonly foods = rxResource({
    stream: () => this.foodsApiService.getFoods(),
  });

  public constructor() {
    effect(() => {
      this.currentPage();
      this.foodLogs.reload();
    })
  }

  public navigateToAddLog(): void {
    this.router.navigate([Paths.FOOD_LOGS, Paths.CREATE]);
  }
}
