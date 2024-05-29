import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseLogService } from '@services/exercise-log.service';
import { TypeaheadComponent } from './typeahead.component';
import { Exercise } from '@models/exercise.model';
import { DropdownComponent } from './dropdown.component';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styles: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbTypeaheadModule, FormsModule, TitleCasePipe, NgClass, NgbDropdownModule, TypeaheadComponent, DropdownComponent],
})
export class FiltersComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public readonly exerciseFormatter = (x: string) => this.titleCasePipe.transform(x);
  public readonly weightFormatter = (x: string) => (!isNaN(parseInt(x)) ? `${x}kg` : x);

  public readonly typeControl: FormControl<string | null> = new FormControl(null);
  public readonly exerciseControl: FormControl<Exercise | null> = new FormControl(null);
  public readonly weightControl: FormControl<number | null> = new FormControl(null);

  public readonly exerciseSelector = (x: Exercise | null) => x?.name ?? '';

  public readonly exercisesFilteredByType = computed(() => {
    const selectedType = this.exerciseLogService.selectedType();

    const exercises = this.exerciseLogService
      .exercises()
      .filter(x => (!!selectedType ? x.type?.toLowerCase() === selectedType.toLowerCase() : true));

    return exercises;
  });

  public readonly weightsFilteredByExercise = computed(() => {
    return this.exerciseLogService.weights();
  });

  public constructor() {
    this.exerciseControl.valueChanges.subscribe(x => {
      let selectedExercise =
        this.exerciseLogService
          .exercises()
          .filter(y => y.name === x?.name ?? '')
          .at(0) ?? null;

      this.exerciseLogService.selectedExercise$.next(selectedExercise ? selectedExercise : null);
      this.exerciseLogService.selectedWeight$.next(null);
    });

    this.weightControl.valueChanges.subscribe(x => {
      this.exerciseLogService.selectedWeight$.next(+(x ?? 0));
    });
  }
}
