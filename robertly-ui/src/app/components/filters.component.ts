import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, output, signal } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseLogService } from '@services/exercise-log.service';
import { TypeaheadComponent } from './typeahead.component';
import { Exercise } from '@models/exercise.model';
import { DropdownComponent } from './dropdown.component';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { Filter } from '@models/filter';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styles: `
    ::ng-deep {
      .dropdown-item {
        background-color: var(--light-bg);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbTypeaheadModule, FormsModule, NgbDropdownModule, TypeaheadComponent, DropdownComponent],
})
export class FiltersComponent {
  public readonly filtersChanged = output<Filter>();

  public readonly exerciseLogService = inject(ExerciseLogService);

  private readonly authService = inject(AuthService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public readonly exerciseFormatter = (x: string) => this.titleCasePipe.transform(x);
  public readonly weightFormatter = (x: string | null | undefined) => (!isNaN(parseInt(x ?? '')) ? `${x}kg` : '');
  public readonly exerciseSelector = (x: Exercise | null) => x?.name ?? '';
  public readonly userSelector = (x: User | null) => x?.name ?? '';

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
        this.userControl.value?.userFirebaseUuid,
        this.exerciseControl.value?.exerciseId!,
        this.typeControl.value,
        this.weightControl.value ? +this.weightControl.value : null
      );
    },
  });

  readonly #onUserLoadUpdateUserControl = effect(() => {
    const user = this.authService.user();

    if (user) {
      this.userControl.patchValue(user);
    }
  });

  readonly #onFetchFilters = effect(() => {
    const filters = this.filters.value();
    const user = this.authService.user();

    if (filters) {
      this.users.set([user!, ...(user?.assignedUsers ?? [])]);
      this.types.set(filters.types);
      this.weights.set(filters.weights.map(x => `${x}`));
      this.exercises.set(this.exerciseLogService.exercises().filter(x => filters.exercisesIds.includes(x.exerciseId!)));
    }
  });

  readonly #onAnyFilterChange = effect(() => {
    const userValue = this.userControlValues();
    const typeValue = this.typeControlValues();
    const exerciseValue = this.exerciseControlValues();
    const weightValue = this.weightControlValues();

    const userFirebaseUuid = !!userValue ? [userValue.userFirebaseUuid] : [];
    const types = !!typeValue ? [typeValue] : [];
    const exercisesIds = !!exerciseValue?.exerciseId ? [exerciseValue.exerciseId] : [];
    const weights = !!weightValue ? [+weightValue] : [];

    this.filters.reload();
    this.filtersChanged.emit({ userFirebaseUuid, exercisesIds, types, weights });
  });
}
