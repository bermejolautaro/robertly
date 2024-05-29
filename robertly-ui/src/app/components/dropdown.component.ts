import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dropdown',
  template: ` <div ngbDropdown class="d-flex justify-content-center">
    <div class="input-group w-100">
      <button type="button" class="btn btn-outline-primary d-flex justify-content-between align-items-center" ngbDropdownToggle>
        {{ placeholder | titlecase }}
      </button>
      <button class="btn btn-outline-secondary" type="button" (click)="control.patchValue(null)">
        <i class="fa fa-times"></i>
      </button>

      <div ngbDropdownMenu class="w-100">
        <button ngbDropdownItem (click)="clearFilterClicked.emit()">Clear filter</button>
        @for (item of items(); track $index) {
          <button ngbDropdownItem [ngClass]="{ active: isActive(item) }" (click)="elementSelected.emit(item)">
            {{ formatter(item) | titlecase }}
          </button>
        }
      </div>
    </div>
  </div>`,
  styles: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, NgbDropdownModule, TitleCasePipe, NgClass],
})
export class DropdownComponent<T> {
  @Input() public placeholder: string = 'Placeholder';
  @Input({ required: true }) public control: FormControl<T | null> = new FormControl(null);
  @Input({ required: true }) public items: Signal<T[]> = signal<T[]>([]);
  @Input() public isActive: (item: T) => boolean = () => false;
  @Input() public formatter: (item: T) => string = x => `${x ?? ''}`;

  @Output() public readonly clearFilterClicked = new EventEmitter<void>();
  @Output() public readonly elementSelected = new EventEmitter<T>();
}
