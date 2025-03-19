import { Directive, ElementRef, forwardRef, HostListener, inject, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[onlyNumbers]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OnlyNumbersDirective),
      multi: true,
    },
  ],
})
export class OnlyNumbersDirective implements ControlValueAccessor {
  private readonly element = inject(ElementRef);
  private _onChange: (value: unknown) => void = () => {};
  private _onTouched: () => void = () => {};

  public readonly value = signal<string>('');

  @HostListener('input', ['$event'])
  public onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    let sanitizedValue = inputValue.replace(/[^0-9.]/g, '');

    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
      sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
    }

    this.element.nativeElement.value = sanitizedValue;
    this.value.set(sanitizedValue);

    this._onChange(sanitizedValue);
  }

  @HostListener('blur')
  public onBlur(): void {
    this._onTouched();
  }

  @HostListener('keypress', ['$event'])
  public onKeyPress(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    const inputElement = event.target as HTMLInputElement;

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/[\d.]/.test(event.key) || (event.key === '.' && inputElement.value.includes('.'))) {
      event.preventDefault();
    }
  }

  public writeValue(value: unknown): void {
    if (typeof value === 'string' || typeof value === 'number') {
      this.value.set(`${value}`);
      this.element.nativeElement.value = this.value();
    }
  }

  public registerOnChange(fn: unknown): void {
    this._onChange = fn as (value: unknown) => void;
  }

  public registerOnTouched(fn: unknown): void {
    this._onTouched = fn as () => void;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.element.nativeElement.disabled = isDisabled;
  }
}
