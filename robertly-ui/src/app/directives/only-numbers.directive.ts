import { Directive, ElementRef, forwardRef, HostListener, inject, input, signal } from '@angular/core';
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
  public readonly allowDecimals = input(true);
  private readonly element = inject(ElementRef);
  private _onChange: (value: unknown) => void = () => {};
  private _onTouched: () => void = () => {};

  public readonly value = signal<string>('');

  @HostListener('input', ['$event'])
  public onInput(event: Event): void {
    let inputValue = (event.target as HTMLInputElement).value;

    inputValue = inputValue.replace(',', '.').replace(/[^0-9.]/g, '');

    if (this.allowDecimals()) {
      inputValue = inputValue.replace(/[^0-9.]/g, '');

      const parts = inputValue.split('.');
      if (parts.length > 2) {
        inputValue = parts[0] + '.' + parts.slice(1).join('');
      }
    } else {
      inputValue = inputValue.replace(/\D/g, '');
    }

    if (inputValue.startsWith('.')) {
      inputValue = '';
    } else if (inputValue.startsWith('0')) {
      if (inputValue[1]) {
        if (inputValue[1] === '0') {
          inputValue = inputValue.replace(/^0+/, '0');
        } else {
          inputValue = inputValue.replace(/^0+/, '');
        }
      }
    }

    this.element.nativeElement.value = inputValue;
    this.value.set(inputValue);

    this._onChange(inputValue);
  }

  @HostListener('blur')
  public onBlur(): void {
    this._onTouched();
  }

  @HostListener('keypress', ['$event'])
  public onKeyPress(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/[\d.,]/.test(event.key)) {
      event.preventDefault();
    }
  }

  public writeValue(value: unknown): void {
    this.value.set(value as any);
    this.element.nativeElement.value = this.value();
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
