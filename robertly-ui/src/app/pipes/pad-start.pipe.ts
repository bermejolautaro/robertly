import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'padStart', standalone: true })
export class PadStartPipe implements PipeTransform {
  public transform(value: number, pad: number, fillString?: string): string {
    return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1})
  }
}
