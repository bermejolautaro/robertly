import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model, OnInit, output, signal } from '@angular/core';
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
        <span
          class="dropdown-label"
          [class.active]="control().value"
          >{{ selectedValue() | titlecase }}</span
        >
      </button>
      <button
        class="btn btn-outline-secondary"
        type="button"
        (click)="control().patchValue(null)"
      >
        <i class="fa fa-times"></i>
      </button>

      <div
        ngbDropdownMenu
        class="w-100"
      >
        @for (item of items(); track $index; let last = $last) {
          <button
            ngbDropdownItem
            [ngClass]="{ active: isActive()(item) }"
            (click)="control().patchValue(item)"
          >
            {{ formatter()(item) | titlecase }}
          </button>
          @if (!last) {
            <div class="dropdown-divider"></div>
          }
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
  imports: [ReactiveFormsModule, FormsModule, NgbDropdownModule, TitleCasePipe, NgClass],
})
export class DropdownComponent<T> implements OnInit {
  public readonly placeholder = input<string>('Placeholder');
  public readonly control = model<FormControl<T | null>>(new FormControl(null));
  public readonly items = input<T[]>([]);

  public readonly formatter = input<(item: T | null) => string>(x => `${x ?? ''}`);
  public readonly isActive = input<(item: T) => boolean>(y => this.selectedValue() === y);

  public readonly clearFilterClicked = output<T>();
  public readonly elementSelected = output<T>();

  public readonly selectedValue = signal<string | null>('');

  public ngOnInit(): void {
    this.control()
      .valueChanges.pipe(startWith(this.control().value))
      .subscribe(value => {
        this.selectedValue.set(value ? this.formatter()(value) : this.placeholder());
      });
  }
}
