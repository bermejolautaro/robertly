import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'padStart', standalone: true })
export class PadStartPipe implements PipeTransform {
  public transform(value: number | null | undefined, pad: number, fillString?: string): string {
    if (value === null || value === undefined) {
      return '';
    }

    return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  }
}
