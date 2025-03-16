import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseApiService } from '@services/exercises-api.service';
import { Paths } from 'src/main';

@Component({
  selector: 'app-exercises-page',
  templateUrl: './exercises.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, NgbModalModule, FormsModule, ReactiveFormsModule],
})
export class ExercisesPageComponent implements OnInit {
  private readonly router = inject(Router);
  public readonly exerciseApiService = inject(ExerciseApiService);

  public constructor() {}

  public async ngOnInit(): Promise<void> {
    await this.exerciseApiService.fetchExercises();
  }

  public navigateToExercise(exerciseId: number | undefined): void {
    if (exerciseId) {
      this.router.navigate([Paths.EXERCISES, Paths.EDIT, exerciseId]);
    }
  }
}
