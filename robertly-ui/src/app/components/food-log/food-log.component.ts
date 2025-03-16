import { TitleCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FoodLog } from '@models/food.model';
import { PadStartPipe } from '@pipes/pad-start.pipe';
import { ParseToDatePipe } from '@pipes/parse-to-date.pipe';
import { Paths } from 'src/main';

@Component({
  selector: 'app-food-log',
  templateUrl: './food-log.component.html',
  styleUrl: './food-log.component.scss',
  imports: [TitleCasePipe, ParseToDatePipe, PadStartPipe]
})
export class FoodLogComponent {
  private readonly router = inject(Router);
  public readonly foodLog = input<FoodLog | null>();

  public navigateToEditLog(): void {
    const foodLog = this.foodLog();

    if (foodLog) {
      this.router.navigate([Paths.EXERCISE_LOGS, Paths.EDIT, foodLog.foodLogId]);
    }
  }
}
