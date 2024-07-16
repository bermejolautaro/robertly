import {
  JsonPipe,
  KeyValuePipe,
  NgClass,
  TitleCasePipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Exercise } from '@models/exercise.model';
import { NgbActiveModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseLogService } from '@services/exercise-log.service';
import { TypeaheadComponent } from './typeahead.component';
import { ExerciseLogDto } from '@models/exercise-log.model';
import { CreateOrUpdateLogFormGroup } from '@models/create-or-update-log';

@Component({
  selector: 'app-exercise-row-body',
  templateUrl: './create-or-update-log-modal.component.html',
  styleUrl: './create-or-update-log-modal.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgbTypeaheadModule,
    NgClass,
    TypeaheadComponent,
    KeyValuePipe,
    JsonPipe,
  ],
})
export class CreateOrUpdateLogModalComponent {
  public readonly modal = inject(NgbActiveModal);
  public readonly exerciseLogService = inject(ExerciseLogService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  @Input({ required: true }) public mode: 'update' | 'create' = null!;
  @Input({ required: true }) public createOrUpdateLogFormGroup: CreateOrUpdateLogFormGroup = null!;
  @Input() public originalValue: ExerciseLogDto = null!;

  public readonly exerciseSelector = (x: string | Exercise | null) =>
    typeof x === 'string' ? '' : this.titleCasePipe.transform(x?.name) ?? '';
}
