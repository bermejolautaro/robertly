import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, output, signal } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TypeaheadComponent } from '@components/typeahead.component';
import { Exercise } from '@models/exercise.model';
import { DropdownComponent } from '@components/dropdown.component';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { Filter } from '@models/filter';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ExerciseApiService } from '@services/exercises-api.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbTypeaheadModule, FormsModule, NgbDropdownModule, TypeaheadComponent, DropdownComponent],
})
export class FiltersComponent {
  public readonly filtersChanged = output<Filter>();

  private readonly exerciseApiService = inject(ExerciseApiService);
  private readonly authService = inject(AuthService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public readonly userSelector = (x: User | null) => x?.name ?? '';
  public readonly exerciseFormatter = (x: string) => this.titleCasePipe.transform(x);
  public readonly weightFormatter = (x: string | null | undefined) => (!isNaN(parseInt(x ?? '')) ? `${x}kg` : '');
  public readonly exerciseSelector = (x: string | Exercise | null) =>
    typeof x === 'string' ? '' : this.titleCasePipe.transform(x?.name) ?? '';

  public readonly userControl = new FormControl<User | null>(null);
  public readonly typeControl = new FormControl<string | null>(null);
  public readonly exerciseControl = new FormControl<Exercise | null>(null);
  public readonly weightControl = new FormControl<string | null>(null);

  public readonly userControlValues = toSignal(this.userControl.valueChanges);
  public readonly typeControlValues = toSignal(this.typeControl.valueChanges);
  public readonly exerciseControlValues = toSignal(this.exerciseControl.valueChanges);
  public readonly weightControlValues = toSignal(this.weightControl.valueChanges);

  public readonly users = signal<User[]>([]);
  public readonly types = signal<string[]>([]);
  public readonly weights = signal<string[]>([]);
  public readonly exercises = signal<Exercise[]>([]);

  private readonly filters = rxResource({
    loader: () => {
      return this.exerciseLogApiService.getFilters(
        this.userControl.value?.userId,
        this.exerciseControl.value?.exerciseId!,
        this.typeControl.value,
        this.weightControl.value ? +this.weightControl.value : null
      );
    },
  });

  public constructor() {
    // When filters or user load then set filter values
    effect(() => {
      const filters = this.filters.value();
      const user = this.authService.user.value();

      if (filters) {
        this.users.set([user!, ...(user?.assignedUsers ?? [])]);
        this.types.set(filters.types);
        this.weights.set(filters.weights.map(x => `${x}`));
        this.exercises.set(this.exerciseApiService.exercises().filter(x => filters.exercisesIds.includes(x.exerciseId!)));
      }
    });

    // If any filter value change then refetch filters and emit an event
    effect(() => {
      const userValue = this.userControlValues();
      const typeValue = this.typeControlValues();
      const exerciseValue = this.exerciseControlValues();
      const weightValue = this.weightControlValues();

      const userId = !!userValue ? [userValue.userId] : [];
      const types = !!typeValue ? [typeValue] : [];
      const exercisesIds = !!exerciseValue?.exerciseId ? [exerciseValue.exerciseId] : [];
      const weights = !!weightValue ? [+weightValue] : [];

      this.filters.reload();
      this.filtersChanged.emit({ userId, exercisesIds, types, weights });
    });
  }
}
