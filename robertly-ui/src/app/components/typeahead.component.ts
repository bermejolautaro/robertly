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
import { NgbTypeahead, NgbTypeaheadModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, bufferTime, distinctUntilChanged, filter, map, merge } from 'rxjs';

@Component({
  selector: 'app-typeahead',
  template: `<div class="input-group">
    <input
      #typeaheadInput
      #typeaheadInstance="ngbTypeahead"
      type="text"
      class="form-control"
      [placeholder]="placeholder()"
      (selectItem)="onSelectItem($event)"
      [ngbTypeahead]="search"
      [popupClass]="'typeahead'"
      [resultFormatter]="itemSelector()"
      [inputFormatter]="itemSelector()"
      (focus)="focus$.next(control()?.value ?? null)"
      (click)="click$.next(control()?.value ?? null)"
      [disabled]="disabled() || control()?.disabled"
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
  private readonly typeaheadInputHtml = viewChild.required<ElementRef<HTMLInputElement>>('typeaheadInput');
  private readonly typeaheadInstance = viewChild.required<NgbTypeahead>('typeaheadInstance');
  public readonly disabled = input(false);
  public readonly items = input.required<T[]>();
  public readonly control = model<FormControl<T | null>>();
  public readonly value = model<T | null>();
  public readonly itemSelector = input<(item: T | null) => string>(x => `${x ?? ''}`);
  public readonly placeholder = input<string>('Placeholder');

  public readonly focus$: Subject<T | null> = new Subject<T | null>();
  public readonly click$: Subject<T | null> = new Subject<T | null>();

  public search: ((text$: Observable<string>) => Observable<T[]>) | null = null;

  public constructor() {
    this.setup_effect_update_native_element_on_form_change();
  }

  private setup_effect_update_native_element_on_form_change() {
    effect(() => {
      const control = this.control();
      const value = this.value();
      const inputHtml = this.typeaheadInputHtml();

      if (inputHtml) {
        inputHtml.nativeElement.value = this.itemSelector()(control?.value ?? value ?? null);
      }
    });
  }

  public ngOnInit(): void {
    this.search = createAutocomplete(
      this.focus$,
      this.click$,
      this.typeaheadInstance(),
      this.items,
      this.itemSelector()
    );
  }

  public clear(): void {
    const inputHtml = this.typeaheadInputHtml();

    this.control.update(x => {
      x?.reset();
      return x;
    });

    this.value.set(null);

    if (inputHtml) {
      inputHtml.nativeElement.value = '';
    }
  }

  public onSelectItem(evnt: NgbTypeaheadSelectItemEvent<T>) {
    this.control.update(x => {
      x?.patchValue(evnt.item);
      return x;
    });

    this.value.set(evnt.item);
  }
}

function createAutocomplete<T>(
  focus$: Observable<T | null>,
  click$: Observable<T | null>,
  instance: NgbTypeahead,
  elementsSignal: Signal<T[]>,
  selector: (item: T | null) => string
) {
  return (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());
    const mappedFocus$ = focus$.pipe(map(x => ({ type: 'focus', value: selector(x) })));
    const mappedClick$ = click$.pipe(map(x => ({ type: 'click', value: selector(x) })));

    const combined$ = merge(mappedFocus$, mappedClick$).pipe(
      bufferTime(50),
      filter(x => !!x.length),
      map(events => {
        if (events.map(x => x.type).includes('focus') && events.map(x => x.type).includes('click')) {
          return '';
        }

        if (events.map(x => x.type).includes('click')) {
          if (instance.isPopupOpen()) {
            return null;
          } else {
            return '';
          }
        }

        return null;
      })
    );

    return merge(debouncedText$, combined$).pipe(
      map(text => {
        const elements = elementsSignal();

        if (text === null) {
          return [];
        }

        return !text
          ? elements
          : elements.filter(x => !!x).filter(x => selector(x).toLowerCase().includes(text.toLowerCase()));
      })
    );
  };
}
