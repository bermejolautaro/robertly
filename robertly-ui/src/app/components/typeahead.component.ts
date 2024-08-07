import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Signal, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
      [placeholder]="placeholder"
      (selectItem)="onSelectItem($event)"
      [ngbTypeahead]="search"
      [popupClass]="'typeahead'"
      [resultFormatter]="itemSelector"
      [inputFormatter]="itemSelector"
      (focus)="focus$.next(control.value)"
    />
    <button class="btn btn-outline-secondary" type="button" (click)="control.patchValue(null); typeaheadInput.value = ''">
      <i class="fa fa-times"></i>
    </button>
  </div>`,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, NgbTypeaheadModule],
})
export class TypeaheadComponent<T> implements OnInit, AfterViewInit {
  @ViewChild('typeaheadInput') public inputHtml: ElementRef<HTMLInputElement> | null = null;
  @Input({ required: true }) public items: Signal<T[]> = signal<T[]>([]);
  @Input({ required: true }) public control: FormControl<T | null> = new FormControl(null);
  @Input() public itemSelector: (item: T | null) => string = x => `${x ?? ''}`;
  @Input() placeholder: string = 'Placeholder';

  public readonly focus$: Subject<T | null> = new Subject<T | null>();
  public search: ((text$: Observable<string>) => Observable<T[]>) | null = null;

  public ngOnInit(): void {
    this.search = createAutocomplete(this.focus$, this.items, this.itemSelector);
  }

  public ngAfterViewInit(): void {
    this.inputHtml!.nativeElement.value = this.itemSelector(this.control.value);
  }

  public onSelectItem(evnt: NgbTypeaheadSelectItemEvent<T>) {
    this.control.patchValue(evnt.item)
  }
}

function createAutocomplete<T>(focus$: Observable<T | null>, elementsSignal: Signal<T[]>, selector: (item: T | null) => string) {
  return (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, focus$.pipe(map(x => selector(x)))).pipe(
      map(text => {
        const elements = elementsSignal();
        return !text ? elements : elements.filter(x => !!x).filter(x => selector(x).toLowerCase().includes(text.toLowerCase()));
      })
    );
  };
}
