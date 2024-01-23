import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExerciseRow } from '@models/excercise-row.model';
import { Exercise } from '@models/exercise.model';
import { NgbActiveModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseLogService } from '@services/exercise-log.service';
import { Subject, OperatorFunction, Observable, distinctUntilChanged, merge, map } from 'rxjs';
import { CreateOrUpdateLogFormGroup } from 'src/app/app.component';

@Component({
  selector: 'app-excercise-row-body',
  templateUrl: './create-or-update-log-modal.component.html',
  styles: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, NgbTypeaheadModule, NgClass],
})
export class CreateOrUpdateLogModalComponent {
  public readonly modal = inject(NgbActiveModal);
  public readonly exerciseLogService = inject(ExerciseLogService);

  @Input({ required: true }) public mode: 'update' | 'create' = null!;
  @Input({ required: true }) public createOrUpdateLogFormGroup: CreateOrUpdateLogFormGroup = null!;
  @Input() public originalValue: ExerciseRow = null!;

  @ViewChild('usernameTypeaheadInput', { static: true }) usernameTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly usernameFocus$: Subject<string> = new Subject<string>();

  public readonly usernameSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.usernameFocus$).pipe(
      map(() => {
        const usernames = this.exerciseLogService.usernames().map(x => x);

        return this.createOrUpdateLogFormGroup.value.user === ''
          ? usernames
          : usernames
              .filter(x => !!x)
              .filter(v => v.toLowerCase().includes(this.createOrUpdateLogFormGroup.value.user?.toLowerCase() ?? ''));
      })
    );
  };

  @ViewChild('exerciseTypeaheadInput', { static: true }) exerciseTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly exerciseFocus$: Subject<string> = new Subject<string>();

  public readonly exerciseSearch: OperatorFunction<string, readonly Exercise[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.exerciseFocus$).pipe(
      map(text => {
        const exercises = this.exerciseLogService.exercises().map(x => x);

        return !text ? exercises : exercises.filter(x => !!x).filter(x => x.name.includes(text));
      })
    );
  };

  public exerciseFormatter = (exercise: Exercise) => exercise.name;
}
