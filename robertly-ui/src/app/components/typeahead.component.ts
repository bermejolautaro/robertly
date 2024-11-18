import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  model,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, distinctUntilChanged, map, merge } from 'rxjs';

@Component({
  selector: 'app-typeahead',
  template: `<div class="input-group">
    <input
      #typeaheadInput
      type="text"
      class="form-control"
      [placeholder]="placeholder()"
      (selectItem)="onSelectItem($event)"
      [ngbTypeahead]="search"
      [popupClass]="'typeahead'"
      [resultFormatter]="itemSelector()"
      [inputFormatter]="itemSelector()"
      (focus)="focus$.next(control().value)"
    />
    <button
      class="btn btn-outline-secondary"
      type="button"
      (click)="clear()"
    >
      <i class="fa fa-times"></i>
    </button>
  </div>`,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, NgbTypeaheadModule],
})
export class TypeaheadComponent<T> implements OnInit {
  private readonly inputHtml = viewChild.required<ElementRef<HTMLInputElement>>('typeaheadInput');
  public readonly items = input.required<T[]>();
  public readonly control = model.required<FormControl<T | null>>();
  public readonly itemSelector = input<(item: T | null) => string>(x => `${x ?? ''}`);
  public readonly placeholder = input<string>('Placeholder');

  readonly #updateNativeElementOnFormChange = effect(() => {
    const control = this.control();
    const inputHtml = this.inputHtml();

    if (inputHtml) {
      inputHtml.nativeElement.value = this.itemSelector()(control.value!);
    }
  });

  public readonly focus$: Subject<T | null> = new Subject<T | null>();
  public search: ((text$: Observable<string>) => Observable<T[]>) | null = null;

  public ngOnInit(): void {
    this.search = createAutocomplete(this.focus$, this.items, this.itemSelector());
  }

  public clear(): void {
    const inputHtml = this.inputHtml();

    this.control.update(x => {
      x.reset();
      return x;
    });

    if (inputHtml) {
      inputHtml.nativeElement.value = '';
    }
  }

  public onSelectItem(evnt: NgbTypeaheadSelectItemEvent<T>) {
    this.control.update(x => {
      x.patchValue(evnt.item);
      return x;
    });
  }
}

function createAutocomplete<T>(
  focus$: Observable<T | null>,
  elementsSignal: Signal<T[]>,
  selector: (item: T | null) => string
) {
  return (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, focus$.pipe(map(x => selector(x)))).pipe(
      map(text => {
        const elements = elementsSignal();
        return !text
          ? elements
          : elements.filter(x => !!x).filter(x => selector(x).toLowerCase().includes(text.toLowerCase()));
      })
    );
  };
}
