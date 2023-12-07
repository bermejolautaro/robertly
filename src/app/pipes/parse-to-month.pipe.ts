import { Pipe, PipeTransform } from '@angular/core';
import { parseDate } from '@helpers/date.helper';

@Pipe({ name: 'parseToMonth', standalone: true })
export class ParseToMonthPipe implements PipeTransform {
  public transform(value: string | null | undefined, defaultValue: string): string {
    const parsedDate = parseDate(value ?? '');

    if (!parsedDate.isValid()) {
      return defaultValue;
    }

    return parsedDate.format('MMMM[ - ]YYYY');
  }
}
