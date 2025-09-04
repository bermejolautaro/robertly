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
            <div class="title">{{ log.food.name | titlecase }}</div>
            <div class="hint">{{ log.date | parseToDate }}</div>
            <div class="hint">{{ log.user.name }}</div>
          </div>
          <div class="series">
            <div class="serie">
              <span>Calories:</span><span> {{ calories() | padStart: 2 }}cal</span>
            </div>
            <div class="serie">
              <span>Protein:</span><span> {{ protein() | padStart: 2 }}g</span>
            </div>
            <div class="serie">
              <span>Fat:</span><span>{{ !!log.food.fat ? (log.food.fat | padStart: 2) + 'g' : '-' }}</span>
            </div>
            <div class="serie">
              <span>Amount:</span><span>{{ log.amount + log.food.unit }}</span>
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
        font-size: 12px;
        opacity: 0.8;

        .serie {
          display: grid;
          grid-template-columns: 1fr 1fr;
          text-align: right;
        }
      }
    }
  `,
  imports: [TitleCasePipe, ParseToDatePipe, PadStartPipe],
})
export class FoodLogComponent {
  private readonly router = inject(Router);
  public readonly foodLog = input<FoodLog | null>();

  public readonly calories = computed(() => {
    const foodLog = this.foodLog();

    if (!foodLog?.food.calories) {
      return 0;
    }

    return (foodLog.food.calories * foodLog.amount) / foodLog.food.amount;
  });

  public readonly protein = computed(() => {
    const foodLog = this.foodLog();

    if (!foodLog?.food.protein) {
      return 0;
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
