import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FoodsApiService } from '@services/foods-api.service';
import { Paths } from 'src/main';

@Component({
  selector: 'app-foods-page',
  template: `
    <div class="container header-footer-padding">
      <div class="d-flex justify-content-end mb-3"></div>
      <ul class="list-group">
        @for (food of foods.value(); track food.foodId) {
          <li
            class="list-group-item d-flex align-items-center"
            (click)="navigateToExercise(food.foodId)"
          >
            <span>{{ food.name | titlecase }}</span>
          </li>
        } @empty {
          <div class="position-absolute top-50 start-50 translate-middle">
            <div
              class="robertly-spinner spinner-border text-primary"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      </ul>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, NgbModalModule, FormsModule, ReactiveFormsModule],
})
export class FoodsPageComponent {
  private readonly router = inject(Router);
  public readonly foodsApiService = inject(FoodsApiService);

  public readonly foods = rxResource({
    loader: () => this.foodsApiService.getFoods()
  });

  public constructor() {}

  public navigateToExercise(foodId: number | null): void {
    if (foodId) {
      this.router.navigate([Paths.FOODS, Paths.EDIT, foodId]);
    }
  }
}
