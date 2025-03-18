import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FoodLogComponent } from '@components/food-log/food-log.component';
import { FoodLogsApiService } from '@services/food-logs-api.service';
import { FoodsApiService } from '@services/foods-api.service';

@Component({
  selector: 'app-food-logs-page',
  templateUrl: './food-logs.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FoodLogComponent],
})
export class FoodsPageComponent {
  private readonly foodsApiService = inject(FoodsApiService);
  private readonly foodLogsApiService = inject(FoodLogsApiService);

  public readonly foodLogs = rxResource({
    loader: () => this.foodLogsApiService.getFoodLogs(),
  });

  public readonly foods = rxResource({
    loader: () => this.foodsApiService.getFoods(),
  });

  public navigateToEditLog(): void {}
}
