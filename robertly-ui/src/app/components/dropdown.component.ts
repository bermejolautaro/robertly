import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Signal, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { startWith } from 'rxjs';

@Component({
    selector: 'app-dropdown',
    template: `<div
    ngbDropdown
    class="d-flex justify-content-center"
  >
    <div class="input-group flex-nowrap has-validation ">
      <button
        type="button"
        class="btn btn-outline-primary d-flex justify-content-between align-items-center w-100 dropdown"
        ngbDropdownToggle
      >
        <span [ngClass]="{ 'dropdown-label': true, active: control.value }">{{ selectedValue() | titlecase }}</span>
      </button>
      <button
        class="btn btn-outline-secondary"
        type="button"
        (click)="control.patchValue(null)"
      >
        <i class="fa fa-times"></i>
      </button>

      <div
        ngbDropdownMenu
        class="w-100"
      >
        @for (item of items(); track $index) {
          <button
            ngbDropdownItem
            [ngClass]="{ active: isActive(item) }"
            (click)="control.patchValue(item)"
          >
            {{ formatter(item) | titlecase }}
          </button>
        }
      </div>
    </div>
  </div>`,
    styles: `
    :host {
      display: block;
      width: 100%;
    }

    .dropdown {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      --bs-btn-color: var(--body-bg);
      --bs-btn-border-color: var(--bs-border-color);
      --bs-btn-hover-border-color: var(--bs-border-color);

      & button.btn-outline-primary.show, & button.btn-outline-primary:hover {
        background-color: transparent;
        --bs-btn-active-border-color: var(--bs-border-color);
      }

      &-label {
        opacity: .6;

        &.active {
          opacity: 1
        }
      }
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, FormsModule, NgbDropdownModule, TitleCasePipe, NgClass]
})
export class DropdownComponent<T> implements OnInit {
  @Input() public placeholder: string = 'Placeholder';
  @Input({ required: true }) public control: FormControl<T | null> = new FormControl(null);
  @Input({ required: true }) public items: Signal<T[]> = signal<T[]>([]);
  @Input() public isActive: (item: T) => boolean = () => false;
  @Input() public formatter: (item: T | null) => string = x => `${x ?? ''}`;

  @Output() public readonly clearFilterClicked = new EventEmitter<void>();
  @Output() public readonly elementSelected = new EventEmitter<T>();

  public readonly selectedValue = signal<string | null>('');

  public ngOnInit(): void {
    this.control.valueChanges.pipe(startWith(null)).subscribe(x => {
      this.selectedValue.set(this.control.value ? this.formatter(this.control.value) : this.placeholder);
    });
  }
}
