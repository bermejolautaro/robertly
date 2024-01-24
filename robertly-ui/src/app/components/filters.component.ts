import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTypeaheadModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { EXERCISE_DEFAULT_LABEL, ExerciseLogService, WEIGHT_DEFAULT_LABEL } from '@services/exercise-log.service';
import { Subject, OperatorFunction, Observable, distinctUntilChanged, merge, map } from 'rxjs';

const CLEAR_FILTER_LABEL = 'Clear Filter';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styles: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbTypeaheadModule, FormsModule, TitleCasePipe, NgClass, NgbDropdownModule],
})
export class FiltersComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public constructor() {
    effect(() => (this.exerciseTypeahead = this.exerciseLogService.selectedExerciseLabel()));
    effect(() => (this.weightTypeahead = this.exerciseLogService.selectedWeightLabel()));
  }

  public readonly exerciseFormatter = (x: string) => this.titleCasePipe.transform(x);
  public readonly weightFormatter = (x: string) => (!isNaN(parseInt(x)) ? `${x}kg` : x);

  public exerciseTypeahead: string = '';

  @ViewChild('exerciseTypeaheadInput', { static: true }) exerciseTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly exerciseFocus$: Subject<string> = new Subject<string>();

  public readonly exerciseSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.exerciseFocus$).pipe(
      map(() => {
        const selectedType = this.exerciseLogService.selectedType();
        const exercises = this.exerciseLogService
          .exercises()
          .filter(x => (!!selectedType ? x.type.toLowerCase() === selectedType.toLowerCase() : true))
          .map(x => x.name);

        if (this.exerciseLogService.selectedExercise()) {
          exercises.unshift(CLEAR_FILTER_LABEL);
        }

        return this.exerciseTypeahead === '' || this.exerciseTypeahead === EXERCISE_DEFAULT_LABEL
          ? exercises
          : exercises.filter(x => !!x).filter(x => x.toLowerCase().includes(this.exerciseTypeahead.toLowerCase()));
      })
    );
  };

  public weightTypeahead: string = '';

  @ViewChild('weightTypeaheadInput', { static: true }) weightTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly weightFocus$: Subject<string> = new Subject<string>();

  public readonly weightSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.weightFocus$).pipe(
      map(() => {
        const weights = this.exerciseLogService.weights().map(x => `${x}`);

        if (this.exerciseLogService.selectedWeight()) {
          weights.unshift(CLEAR_FILTER_LABEL);
        }

        return this.weightTypeahead === '' || this.weightTypeahead === WEIGHT_DEFAULT_LABEL
          ? weights
          : weights.filter(x => !!x).filter(x => x.includes(this.weightTypeahead));
      })
    );
  };

  public onExerciseTypeaheadChange(event: NgbTypeaheadSelectItemEvent<string>): void {
    let selectedExercise =
      this.exerciseLogService
        .exercises()
        .filter(x => x.name === event.item)
        .at(0) ?? null;

    if (event.item === CLEAR_FILTER_LABEL) {
      selectedExercise = null;
    }

    this.exerciseLogService.selectedExercise$.next(selectedExercise ? selectedExercise : null);
    this.exerciseTypeahead = this.exerciseLogService.selectedExerciseLabel();
    this.exerciseTypeaheadInput?.nativeElement.blur();

    this.exerciseLogService.selectedWeight$.next(null);
    this.weightTypeahead = this.exerciseLogService.selectedWeightLabel();
  }

  public onWeightTypeaheadChange(event: NgbTypeaheadSelectItemEvent<string>): void {
    let selectedWeight =
      this.exerciseLogService
        .weights()
        .filter(x => `${x}` === event.item)
        .at(0) ?? null;

    if (event.item === CLEAR_FILTER_LABEL) {
      selectedWeight = null;
    }

    this.exerciseLogService.selectedWeight$.next(selectedWeight);
    this.weightTypeaheadInput?.nativeElement.blur();
  }
}
