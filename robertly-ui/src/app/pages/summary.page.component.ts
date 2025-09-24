import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FoodLogsApiService } from '@services/food-logs-api.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-summary-page',
  template: `
  <div class="header-footer-padding">
  <div class="container">
    Hello Summary!
</div>
</div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class SummaryPageComponent {
  private readonly foodLogApiService = inject(FoodLogsApiService);
  
  public readonly foodLogs = rxResource({
    stream: () => this.foodLogApiService.getFoodLogs(0, 50, '2025-08-01', '2025-09-17').pipe(tap(console.log))
  })
}