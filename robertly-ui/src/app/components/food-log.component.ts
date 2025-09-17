import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FoodLog } from '@models/food-log.model';
import { PadStartPipe } from '@pipes/pad-start.pipe';
import { ParseToDatePipe } from '@pipes/parse-to-date.pipe';
import { Paths } from 'src/main';

@Component({
  selector: 'app-food-log',
  template: ` <!--  -->
    @let log = foodLog();

    @if (!!log) {
      <div
        class="log"
        (click)="navigateToEditLog()"
      >
        <div class="grid">
          <div class="d-flex flex-column align-self-center">
            <div class="title">{{ title() | titlecase }}</div>
            <div class="hint">{{ log.date | parseToDate }}</div>
            <div class="hint">{{ log.user?.name }}</div>
          </div>
          <div class="series">
            <div>
              <div class="text-end">Calories:</div>
              <div class="text-end">Protein:</div>
              <div class="text-end">Fat:</div>
              <div class="text-end">Amount:</div>
            </div>
            <div>
              <div>
                {{ calories() | padStart: 2 }}cal
              </div>
              <div>
               {{ protein() | padStart: 2 }}g
              </div>
              <div>{{ !!log.food?.fat ? ((log.food?.fat ?? log.fat) | padStart: 2) + 'g' : '-' }}</div>
              @if (log.amount && log.food) {
                <div>{{ log.amount + (log.food.unit) }}</div>
              }
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="log">
        <div style="display: grid; grid-template-columns: auto auto">
          <div class="d-flex flex-column placeholder-glow">
            <div class="title"><span class="placeholder col-6"></span></div>
            <div class="hint"><span class="placeholder col-12"></span></div>
          </div>
        </div>
      </div>
    }`,
  styles: `
    .log {
      background-color: var(--light-bg);
      color: var(--font-color);
      margin-bottom: 8px;
      border-radius: 5px;
      padding: 0.2rem 0.6rem 0.2rem 0.6rem;

      .grid {
        display: grid;
        grid-template-columns: 50% 50%;
      }

      .title {
        font-size: 15px;
        font-weight: 600;
      }

      .hint {
        font-size: 12px;
        opacity: 0.8;
      }

      .series {
        display: grid;
        grid-template-columns: 1fr 30%;
        font-size: 12px;
        opacity: 0.8;
        gap: 10px;
      }
    }
  `,
  imports: [TitleCasePipe, ParseToDatePipe, PadStartPipe],
})
export class FoodLogComponent {
  private readonly router = inject(Router);
  public readonly foodLog = input<FoodLog | null>();

  public readonly title = computed(() => {
    const foodLog = this.foodLog();

    const name = foodLog?.food?.name ?? foodLog?.description ?? '';
    const maxLength = 50

    return name.length > maxLength
      ? name.substring(0, maxLength) + '...'
      : name;
  });

  public readonly calories = computed(() => {
    const foodLog = this.foodLog();

    if (!foodLog?.food?.calories) {
      return foodLog?.calories ?? 0;
    }

    return (foodLog.food.calories * foodLog.amount) / foodLog.food.amount;
  });

  public readonly protein = computed(() => {
    const foodLog = this.foodLog();

    if (!foodLog?.food?.protein) {
      return foodLog?.protein ?? 0;
    }

    return (foodLog.food.protein * foodLog.amount) / foodLog.food.amount;
  });

  public navigateToEditLog(): void {
    const foodLog = this.foodLog();

    if (foodLog) {
      this.router.navigate([Paths.FOOD_LOGS, Paths.EDIT, foodLog.foodLogId]);
    }
  }
}
